from fastapi import FastAPI, HTTPException, status, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from database import db, MONGO_URI
from schemas import DoctorRegister, DoctorResponse, DoctorDetailResponse
from schemas import DoctorLogin, DoctorUpdate, PatientResponse, MedicalRecordCreate, MedicalRecordResponse, PaginatedPatientResponse
from utils import get_password_hash, hash_document_number, encrypt_document_number, decrypt_document_number, verify_password, create_access_token, decode_access_token
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from schemas import DoctorLogin
from typing import List, Optional
from pymongo import MongoClient
import certifi
import re
from datetime import datetime

app = FastAPI(title="Doctor Service API")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_doctor(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload or payload.get("role") != "doctor":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    doctor = db.get_db().doctors.find_one({"username": username})
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db_client():
    db.connect()

@app.on_event("shutdown")
def shutdown_db_client():
    db.close()

@app.post("/register", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
async def register_doctor(doctor: DoctorRegister):
    # Basic validations
    if not doctor.phone.isdigit():
        raise HTTPException(status_code=400, detail="Phone number must contain only digits")
    if not doctor.documentNumber.isdigit():
        raise HTTPException(status_code=400, detail="Document number must contain only digits")

    # cross-check uniqueness across doctors collection
    if db.get_db().doctors.find_one({"username": doctor.username}) or db.get_db().patients.find_one({"username": doctor.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.get_db().doctors.find_one({"phone": doctor.phone}) or db.get_db().patients.find_one({"phone": doctor.phone}):
        raise HTTPException(status_code=400, detail="Phone number already exists")

    doc_hash = hash_document_number(doctor.documentNumber)
    if db.get_db().doctors.find_one({"document_number_hash": doc_hash}) or db.get_db().patients.find_one({"document_number_hash": doc_hash}):
        raise HTTPException(status_code=400, detail="Document number already registered")

    doctor_dict = doctor.dict()
    del doctor_dict['password']
    del doctor_dict['documentNumber']

    doctor_dict['password_hash'] = get_password_hash(doctor.password)
    doctor_dict['document_number_hash'] = doc_hash
    doctor_dict['document_number_encrypted'] = encrypt_document_number(doctor.documentNumber)

    try:
        new_doc = db.get_db().doctors.insert_one(doctor_dict)
        created = db.get_db().doctors.find_one({"_id": new_doc.inserted_id})
        return DoctorResponse(id=str(created["_id"]), username=created["username"], name=created["name"], phone=created["phone"])
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Doctor with this information already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/doctors/{doctor_id}", response_model=DoctorDetailResponse)
async def get_doctor_detail(doctor_id: str):
    d = db.get_db().doctors.find_one({"_id": ObjectId(doctor_id)})
    if not d:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return DoctorDetailResponse(
        id=str(d["_id"]),
        username=d["username"],
        name=d["name"],
        dob=d.get("dob","") ,
        gender=d.get("gender",""),
        phone=d.get("phone",""),
        documentType=d.get("documentType",""),
        documentNumber=(lambda s: (s if len(s) <=3 else ('*'*(len(s)-3)+s[-3:])))(decrypt_document_number(d.get('document_number_encrypted',''))),
        address=d.get("address",""),
        specialty=d.get("specialty")
    )


@app.post("/login", response_model=DoctorResponse)
async def login_doctor(user_login: DoctorLogin):
    # Try by username
    d = db.get_db().doctors.find_one({"username": user_login.identifier})
    # If not found by username, try phone
    if not d:
        d = db.get_db().doctors.find_one({"phone": user_login.identifier})

    if not d:
        raise HTTPException(status_code=400, detail="Tên đăng nhập hoặc số điện thoại không tồn tại")

    if not verify_password(user_login.password, d['password_hash']):
        raise HTTPException(status_code=400, detail="Mật khẩu không chính xác")

    access_token = create_access_token(data={"sub": d["username"], "role": "doctor"})

    return DoctorResponse(
        id=str(d["_id"]), 
        username=d["username"], 
        name=d["name"], 
        phone=d.get("phone",""), 
        role='doctor',
        specialty=d.get("specialty"),
        access_token=access_token,
        token_type="bearer"
    )


@app.put("/doctors/{doctor_id}", response_model=DoctorDetailResponse)
async def update_doctor(doctor_id: str, doctor_update: DoctorUpdate):
    try:
        update_data = {k: v for k, v in doctor_update.dict().items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")

        # If phone is being updated, ensure uniqueness within doctors DB
        if "phone" in update_data:
            existing = db.get_db().doctors.find_one({"phone": update_data["phone"], "_id": {"$ne": ObjectId(doctor_id)}})
            if existing:
                raise HTTPException(status_code=400, detail="Phone number already exists")

        result = db.get_db().doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Doctor not found")

        d = db.get_db().doctors.find_one({"_id": ObjectId(doctor_id)})
        return DoctorDetailResponse(
            id=str(d["_id"]),
            username=d["username"],
            name=d.get("name",""),
            dob=d.get("dob",""),
            gender=d.get("gender",""),
            phone=d.get("phone",""),
            documentType=d.get("documentType",""),
            documentNumber=(lambda s: (s if len(s) <=3 else ('*'*(len(s)-3)+s[-3:])))(decrypt_document_number(d.get('document_number_encrypted',''))),
            address=d.get("address",""),
            specialty=d.get("specialty"),
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/doctors", response_model=list[DoctorResponse])
async def get_all_doctors():
    try:
        docs = []
        cursor = db.get_db().doctors.find()
        for d in cursor:
            docs.append(DoctorResponse(
                id=str(d["_id"]), 
                username=d.get("username",""), 
                name=d.get("name",""), 
                phone=d.get("phone",""), 
                role='doctor',
                specialty=d.get("specialty")
            ))
        return docs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/patients/search", response_model=PaginatedPatientResponse)
async def search_patients(query: Optional[str] = None, page: int = 1, limit: int = 10):
    """Allow doctors to search patients by name or phone (partial, case-insensitive for name).
    If no query, returns all patients sorted by name.
    """
    try:
        # Use the existing client from db
        hospital_db = db.client["hospital_db"]
        
        filter_query = {}
        if query:
            # build a safe regex from the incoming query
            try:
                safe_q = re.escape(query)
            except Exception:
                safe_q = re.sub(r"[^\w\d\s]", "", query)

            regex_name = {"$regex": safe_q, "$options": "i"}
            regex_phone = {"$regex": safe_q}
            filter_query = {
                "$or": [
                    {"name": regex_name},
                    {"phone": regex_phone}
                ]
            }

        total = hospital_db.patients.count_documents(filter_query)
        
        # Sort by name (alphabetical)
        cursor = hospital_db.patients.find(filter_query).sort("name", 1).skip((page - 1) * limit).limit(limit)

        results: List[PatientResponse] = []
        for doc in cursor:
            results.append(PatientResponse(
                id=str(doc.get("_id")),
                username=doc.get("username",""),
                name=doc.get("name",""),
                phone=doc.get("phone",""),
                dob=doc.get("dob",""),
                address=doc.get("address","")
            ))

        return PaginatedPatientResponse(
            total=total,
            page=page,
            limit=limit,
            patients=results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Patient search failed: {e}")


@app.post("/patients/{patient_id}/medical_records", response_model=MedicalRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_medical_record(patient_id: str, record: MedicalRecordCreate, current_doctor: dict = Depends(get_current_doctor)):
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        hospital_db = client["hospital_db"]
        
        patient = hospital_db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            client.close()
            raise HTTPException(status_code=404, detail="Patient not found")

        rec = record.dict()
        rec['created_at'] = datetime.utcnow().isoformat()
        rec_id = str(ObjectId())
        rec['_id'] = rec_id

        hospital_db.patients.update_one({"_id": ObjectId(patient_id)}, {"$push": {"medical_records": rec}})
        client.close()

        return MedicalRecordResponse(
            id=rec_id,
            diagnosis=rec.get('diagnosis'),
            medications=rec.get('medications'),
            instructions=rec.get('instructions'),
            follow_up_date=rec.get('follow_up_date'),
            created_at=rec['created_at'],
            doctor_name=rec.get('doctor_name'),
            doctor_specialty=rec.get('doctor_specialty')
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patients/{patient_id}/medical_records", response_model=List[MedicalRecordResponse])
async def get_medical_records(patient_id: str):
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        hospital_db = client["hospital_db"]
        
        patient = hospital_db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            client.close()
            raise HTTPException(status_code=404, detail="Patient not found")
        
        records = patient.get("medical_records", [])
        client.close()
        
        return [MedicalRecordResponse(
            id=r.get('_id'),
            diagnosis=r.get('diagnosis'),
            medications=r.get('medications'),
            instructions=r.get('instructions'),
            follow_up_date=r.get('follow_up_date'),
            created_at=r.get('created_at'),
            doctor_name=r.get('doctor_name'),
            doctor_specialty=r.get('doctor_specialty'),
            edit_history=r.get('edit_history', [])
        ) for r in records]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/patients/{patient_id}/medical_records/{record_id}", response_model=MedicalRecordResponse)
async def update_medical_record(patient_id: str, record_id: str, record_update: MedicalRecordCreate):
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        hospital_db = client["hospital_db"]
        
        patient = hospital_db.patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            client.close()
            raise HTTPException(status_code=404, detail="Patient not found")

        records = patient.get("medical_records", [])
        target_record = next((r for r in records if r.get("_id") == record_id), None)
        
        if not target_record:
            client.close()
            raise HTTPException(status_code=404, detail="Medical record not found")

        # Create history entry from current state
        history_entry = {
            "edited_at": datetime.utcnow().isoformat(),
            "diagnosis": target_record.get("diagnosis"),
            "medications": target_record.get("medications"),
            "instructions": target_record.get("instructions"),
            "follow_up_date": target_record.get("follow_up_date")
        }

        # Update record
        updated_data = record_update.dict()
        updated_data["created_at"] = target_record.get("created_at")
        updated_data["doctor_name"] = record_update.doctor_name or target_record.get("doctor_name")
        updated_data["doctor_specialty"] = record_update.doctor_specialty or target_record.get("doctor_specialty")
        updated_data["_id"] = record_id
        
        # Add to history
        edit_history = target_record.get("edit_history", [])
        edit_history.append(history_entry)
        updated_data["edit_history"] = edit_history

        # Update in DB
        hospital_db.patients.update_one(
            {"_id": ObjectId(patient_id), "medical_records._id": record_id},
            {"$set": {"medical_records.$": updated_data}}
        )
        
        client.close()
        return MedicalRecordResponse(id=record_id, **updated_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/patients/{patient_id}/medical_records/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_medical_record(patient_id: str, record_id: str):
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        hospital_db = client["hospital_db"]
        
        result = hospital_db.patients.update_one(
            {"_id": ObjectId(patient_id)},
            {"$pull": {"medical_records": {"_id": record_id}}}
        )
        
        client.close()
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Medical record not found")
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/doctors", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_doctors():
    try:
        db.get_db().doctors.delete_many({})
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
