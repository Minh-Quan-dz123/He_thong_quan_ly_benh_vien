from fastapi import FastAPI, HTTPException, status, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import db, MONGO_URI
import certifi
from pymongo import MongoClient
DOCTOR_DB_NAME = "hospital_doctors_db"
from schemas import UserRegister, UserResponse, UserLogin, OTPRequest, OTPVerify, ResetPassword, UserDetailResponse, UserUpdate, AppointmentCreate, AppointmentResponse
from utils import get_password_hash, hash_document_number, encrypt_document_number, decrypt_document_number, verify_password
# from sms_service import send_sms
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from typing import List, Optional
import random
from mangum import Mangum
from datetime import datetime
from schemas import MedicalRecordCreate, MedicalRecordResponse

app = FastAPI(title="Patient Service API")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"Validation error: {exc.errors()}")
    print(f"Body: {await request.body()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

# In-memory OTP storage (for demonstration)
otp_storage = {}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
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

@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    # Check password length
    if len(user.password) <= 6:
        raise HTTPException(status_code=400, detail="Password must be longer than 6 characters")

    # Check phone number format
    if not user.phone.isdigit():
        raise HTTPException(status_code=400, detail="Phone number must contain only digits")

    # Check document number format
    if not user.documentNumber.isdigit():
        raise HTTPException(status_code=400, detail="Document number must contain only digits")

    # Check uniqueness within respective databases
    doc_hash = hash_document_number(user.documentNumber)
    if getattr(user, 'role', 'patient') == 'doctor':
        # check in doctors DB only
        doctor_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        doctor_db = doctor_client[DOCTOR_DB_NAME]
        if doctor_db.doctors.find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="Username already exists")
        if doctor_db.doctors.find_one({"phone": user.phone}):
            raise HTTPException(status_code=400, detail="Phone number already exists")
        if doctor_db.doctors.find_one({"document_number_hash": doc_hash}):
            raise HTTPException(status_code=400, detail="Document number already registered")
    else:
        # patient checks only in patients DB
        if db.get_db().patients.find_one({"username": user.username}):
            raise HTTPException(status_code=400, detail="Username already exists")
        if db.get_db().patients.find_one({"phone": user.phone}):
            raise HTTPException(status_code=400, detail="Phone number already exists")
        if db.get_db().patients.find_one({"document_number_hash": doc_hash}):
            raise HTTPException(status_code=400, detail="Document number already registered")

    # Prepare user data for storage
    user_dict = user.dict()
    
    # Remove plain text sensitive data
    del user_dict['password']
    del user_dict['documentNumber']

    # Add processed data
    user_dict['password_hash'] = get_password_hash(user.password)
    user_dict['document_number_hash'] = doc_hash
    user_dict['document_number_encrypted'] = encrypt_document_number(user.documentNumber)
    
    # Insert into MongoDB (patients or doctors depending on role)
    try:
        if getattr(user, 'role', 'patient') == 'doctor':
            # insert into doctor DB
            doctor_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
            doctor_db = doctor_client[DOCTOR_DB_NAME]
            new_user = doctor_db.doctors.insert_one(user_dict)
            created_user = doctor_db.doctors.find_one({"_id": new_user.inserted_id})
        else:
            new_user = db.get_db().patients.insert_one(user_dict)
            created_user = db.get_db().patients.find_one({"_id": new_user.inserted_id})

        return UserResponse(
            id=str(created_user["_id"]),
            username=created_user["username"],
            name=created_user["name"],
            phone=created_user["phone"]
        )
    except DuplicateKeyError:
        # This is a fallback in case the race condition checks above fail
        raise HTTPException(status_code=400, detail="User with this information already exists")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login", response_model=UserResponse)
async def login(user_login: UserLogin):
    # Try to find user across patients and doctors by username
    user = db.get_db().patients.find_one({"username": user_login.identifier})
    role = 'patient'

    if not user:
        # look in separate doctor DB
        doctor_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        doctor_db = doctor_client[DOCTOR_DB_NAME]
        user = doctor_db.doctors.find_one({"username": user_login.identifier})
        role = 'doctor' if user else role
        doctor_client.close()

    # If not found by username, try by phone across both collections
    if not user:
        user = db.get_db().patients.find_one({"phone": user_login.identifier})
        role = 'patient' if user else role

    if not user:
        doctor_client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
        doctor_db = doctor_client[DOCTOR_DB_NAME]
        user = doctor_db.doctors.find_one({"phone": user_login.identifier})
        role = 'doctor' if user else role
        doctor_client.close()

    if not user:
        raise HTTPException(status_code=400, detail="Tên đăng nhập hoặc số điện thoại không tồn tại")

    if not verify_password(user_login.password, user['password_hash']):
        raise HTTPException(status_code=400, detail="Mật khẩu không chính xác")

    return UserResponse(
        id=str(user["_id"]),
        username=user["username"],
        name=user["name"],
        phone=user["phone"],
        role=role
    )

# @app.post("/forgot-password/request-otp")
# async def request_otp(request: OTPRequest):
#     user = db.get_db().patients.find_one({"phone": request.phone})
#     if not user:
#         raise HTTPException(status_code=404, detail="Số điện thoại không tồn tại trong hệ thống")
    
#     otp = str(random.randint(100000, 999999))
#     otp_storage[request.phone] = otp
    
#     message = f"Ma OTP cua ban la: {otp}. Ma nay co hieu luc trong 5 phut."
#     send_sms(request.phone, message)
    
#     return {"message": "Mã OTP đã được gửi"}

@app.post("/forgot-password/verify-otp")
async def verify_otp(request: OTPVerify):
    if request.phone not in otp_storage or otp_storage[request.phone] != request.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác hoặc đã hết hạn")
    return {"message": "Mã OTP hợp lệ"}

@app.post("/forgot-password/reset")
async def reset_password(request: ResetPassword):
    if request.phone not in otp_storage or otp_storage[request.phone] != request.otp:
        raise HTTPException(status_code=400, detail="Mã OTP không chính xác hoặc đã hết hạn")
    
    password_hash = get_password_hash(request.new_password)
    db.get_db().patients.update_one(
        {"phone": request.phone},
        {"$set": {"password_hash": password_hash}}
    )
    del otp_storage[request.phone]
    return {"message": "Đổi mật khẩu thành công"}




@app.get("/patients/{user_id}", response_model=UserDetailResponse)
async def get_patient_detail(user_id: str):
    try:
        user = db.get_db().patients.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserDetailResponse(
            id=str(user["_id"]),
            username=user["username"],
            name=user["name"],
            dob=user["dob"],
            gender=user["gender"],
            phone=user["phone"],
                documentType=user["documentType"],
                documentNumber=(lambda d: (d if len(d) <= 3 else ('*' * (len(d)-3) + d[-3:])))(decrypt_document_number(user.get('document_number_encrypted', ''))),
            address=user["address"],
            bloodType=user.get("bloodType"),
            height=user.get("height"),
            weight=user.get("weight"),
            allergies=user.get("allergies")
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/patients/{user_id}", response_model=UserDetailResponse)
async def update_patient(user_id: str, user_update: UserUpdate):
    try:
        # Filter out None values
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")

        # Check if phone is being updated and if it already exists
        if "phone" in update_data:
            existing_user = db.get_db().patients.find_one({"phone": update_data["phone"], "_id": {"$ne": ObjectId(user_id)}})
            if existing_user:
                raise HTTPException(status_code=400, detail="Phone number already exists")

        result = db.get_db().patients.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Fetch updated user
        updated_user = db.get_db().patients.find_one({"_id": ObjectId(user_id)})
        
        return UserDetailResponse(
            id=str(updated_user["_id"]),
            username=updated_user["username"],
            name=updated_user["name"],
            dob=updated_user["dob"],
            gender=updated_user["gender"],
            phone=updated_user["phone"],
            documentType=updated_user["documentType"],
            documentNumber=(lambda d: (d if len(d) <= 3 else ('*' * (len(d)-3) + d[-3:])))(decrypt_document_number(updated_user.get('document_number_encrypted', ''))),
            address=updated_user["address"],
            bloodType=updated_user.get("bloodType"),
            height=updated_user.get("height"),
            weight=updated_user.get("weight"),
            allergies=updated_user.get("allergies")
        )
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/patients", response_model=List[UserResponse])
async def get_all_patients():
    patients = []
    cursor = db.get_db().patients.find()
    for doc in cursor:
        patients.append(UserResponse(
            id=str(doc["_id"]),
            username=doc["username"],
            name=doc["name"],
            phone=doc["phone"]
        ))
    return patients


@app.delete("/patients", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_patients():
    try:
        db.get_db().patients.delete_many({})
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/patients/{patient_id}/medical_records", response_model=List[MedicalRecordResponse])
async def get_medical_records(patient_id: str):
    try:
        patient = db.get_db().patients.find_one({"_id": ObjectId(patient_id)})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        records = patient.get("medical_records", [])
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
@app.post("/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentCreate):
    appointment_dict = appointment.dict()
    appointment_dict['status'] = 'Pending'
    
    try:
        # Calculate sequence number for the specific date
        count = db.get_db().appointments.count_documents({"date": appointment.date})
        sequence_number = count + 1
        appointment_dict['sequence_number'] = sequence_number

        new_appointment = db.get_db().appointments.insert_one(appointment_dict)
        created_appointment = db.get_db().appointments.find_one({"_id": new_appointment.inserted_id})
        
        return AppointmentResponse(
            id=str(created_appointment["_id"]),
            appointmentType=created_appointment.get("appointmentType", "new"),
            doctor=created_appointment.get("doctor"),
            date=created_appointment["date"],
            reason=created_appointment["reason"],
            phone=created_appointment["phone"],
            patient_id=created_appointment.get("patient_id"),
            status=created_appointment["status"],
            sequence_number=created_appointment["sequence_number"],
            message=f"Số thứ tự của bạn là {created_appointment['sequence_number']}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(date: Optional[str] = None):
    try:
        query = {}
        if date:
            query["date"] = date
            
        appointments = list(db.get_db().appointments.find(query))
        return [
            AppointmentResponse(
                id=str(appt["_id"]),
                appointmentType=appt.get("appointmentType", "new"),
                doctor=appt.get("doctor"),
                date=appt["date"],
                reason=appt["reason"],
                phone=appt["phone"],
                patient_id=appt.get("patient_id"),
                status=appt["status"],
                sequence_number=appt.get("sequence_number", 0)
            )
            for appt in appointments
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/appointments/patient/{patient_id}", response_model=List[AppointmentResponse])
async def get_patient_appointments(patient_id: str):
    try:
        appointments = list(db.get_db().appointments.find({"patient_id": patient_id}))
        return [
            AppointmentResponse(
                id=str(appt["_id"]),
                appointmentType=appt.get("appointmentType", "new"),
                doctor=appt.get("doctor"),
                date=appt["date"],
                reason=appt["reason"],
                phone=appt["phone"],
                patient_id=appt.get("patient_id"),
                status=appt.get("status", "Pending"),
                sequence_number=appt.get("sequence_number", 0)
            )
            for appt in appointments
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(appointment_id: str):
    try:
        result = db.get_db().appointments.delete_one({"_id": ObjectId(appointment_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Appointment not found")
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/appointments", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointments_by_date(date: str):
    try:
        # Delete all appointments for the specific date
        db.get_db().appointments.delete_many({"date": date})
        return
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Handler for Vercel deployment
handler = Mangum(app)



