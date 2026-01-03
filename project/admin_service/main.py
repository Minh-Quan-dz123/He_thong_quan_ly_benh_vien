from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from database import db
from schemas import AdminLogin, AdminResponse, PatientInfo, DoctorInfo, AppointmentInfo, DoctorCreate, GuideUpdate, GuideResponse
from utils import verify_password, get_password_hash, create_access_token, hash_document_number, encrypt_document_number
from jose import JWTError, jwt
from utils import SECRET_KEY, ALGORITHM
import uvicorn
from pymongo import MongoClient
from bson import ObjectId
import certifi
from typing import List, Optional
import pandas as pd
import io

app = FastAPI(title="Admin Service")

# Use MONGO_URI from database.py to avoid duplication
from database import MONGO_URI
PATIENT_DB_NAME = "hospital_db"
DOCTOR_DB_NAME = "hospital_doctors_db"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    db.connect()
    # Create default admin if not exists
    admin_db = db.get_db()
    default_admin = admin_db.admins.find_one({"username": "admin"})
    if not default_admin:
        admin_db.admins.insert_one({
            "username": "admin",
            "password_hash": get_password_hash("admin123"),
            "name": "System Administrator",
            "role": "admin"
        })
        print("Default admin account created: admin / admin123")
    
    # Initialize default guides
    patient_db = db.client[PATIENT_DB_NAME]
    default_guides = [
        {
            "slug": "process",
            "title": "Quy trình khám chữa bệnh",
            "content": """<div class="space-y-8">
  <div class="flex">
    <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">1</div>
    <div class="ml-6">
      <h3 class="text-xl font-bold text-gray-900">Đăng ký khám</h3>
      <p class="mt-2 text-gray-600">Bệnh nhân có thể đăng ký khám trực tiếp tại quầy tiếp đón hoặc đặt lịch hẹn trực tuyến qua website/hotline. Vui lòng mang theo CMND/CCCD và thẻ BHYT (nếu có).</p>
    </div>
  </div>
  <div class="flex">
    <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
    <div class="ml-6">
      <h3 class="text-xl font-bold text-gray-900">Khám bệnh</h3>
      <p class="mt-2 text-gray-600">Bệnh nhân đến phòng khám chuyên khoa theo hướng dẫn. Bác sĩ sẽ thăm khám lâm sàng và chỉ định các xét nghiệm cần thiết.</p>
    </div>
  </div>
  <div class="flex">
    <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">3</div>
    <div class="ml-6">
      <h3 class="text-xl font-bold text-gray-900">Thực hiện cận lâm sàng</h3>
      <p class="mt-2 text-gray-600">Thực hiện các xét nghiệm, chụp X-quang, siêu âm... theo chỉ định. Nhận kết quả tại nơi thực hiện hoặc qua ứng dụng.</p>
    </div>
  </div>
  <div class="flex">
    <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">4</div>
    <div class="ml-6">
      <h3 class="text-xl font-bold text-gray-900">Kết luận và tư vấn</h3>
      <p class="mt-2 text-gray-600">Quay lại phòng khám ban đầu. Bác sĩ đọc kết quả, chẩn đoán bệnh, kê đơn thuốc hoặc chỉ định nhập viện.</p>
    </div>
  </div>
  <div class="flex">
    <div class="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">5</div>
    <div class="ml-6">
      <h3 class="text-xl font-bold text-gray-900">Thanh toán và Lĩnh thuốc</h3>
      <p class="mt-2 text-gray-600">Thanh toán viện phí tại quầy thu ngân. Lĩnh thuốc tại nhà thuốc bệnh viện (nếu có BHYT) hoặc mua thuốc theo đơn.</p>
    </div>
  </div>
</div>"""
        },
        {
            "slug": "insurance",
            "title": "Dịch vụ bảo hiểm",
            "content": """<div class="prose max-w-none text-gray-700">
  <h3 class="text-xl font-bold text-gray-900 mb-4">1. Bảo hiểm Y tế (BHYT) Nhà nước</h3>
  <p class="mb-6">Bệnh viện tiếp nhận khám chữa bệnh BHYT cho tất cả các đối tượng có thẻ BHYT trên toàn quốc. Quyền lợi được hưởng theo quy định hiện hành của Luật BHYT.<br/><strong>Lưu ý:</strong> Vui lòng xuất trình thẻ BHYT và giấy tờ tùy thân có ảnh ngay khi đăng ký khám.</p>
  <h3 class="text-xl font-bold text-gray-900 mb-4">2. Bảo hiểm bảo lãnh (Bảo hiểm tư nhân)</h3>
  <p class="mb-6">Chúng tôi hợp tác với nhiều công ty bảo hiểm uy tín để cung cấp dịch vụ bảo lãnh viện phí trực tiếp, giúp khách hàng giảm bớt gánh nặng tài chính và thủ tục hành chính.</p>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Bảo Việt</div>
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">PVI</div>
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Manulife</div>
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Prudential</div>
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Dai-ichi Life</div>
    <div class="border rounded-lg p-4 flex items-center justify-center font-semibold text-gray-600 bg-gray-50">Insmart</div>
  </div>
  <h3 class="text-xl font-bold text-gray-900 mb-4">3. Quy trình bảo lãnh</h3>
  <ul class="list-disc pl-5 space-y-2">
    <li>Xuất trình thẻ bảo hiểm và giấy tờ tùy thân tại quầy Bảo hiểm.</li>
    <li>Bệnh viện kiểm tra thông tin và hạn mức bảo hiểm.</li>
    <li>Bệnh viện gửi yêu cầu bảo lãnh sang công ty bảo hiểm.</li>
    <li>Sau khi được xác nhận, khách hàng chỉ cần thanh toán phần chi phí không thuộc phạm vi bảo hiểm (nếu có).</li>
  </ul>
</div>"""
        },
        {
            "slug": "payment",
            "title": "Thủ tục thanh toán",
            "content": """<div class="prose max-w-none text-gray-700">
  <h3 class="text-xl font-bold text-gray-900 mb-4">1. Các hình thức thanh toán</h3>
  <p class="mb-6">Để thuận tiện cho khách hàng, bệnh viện chấp nhận đa dạng các hình thức thanh toán:</p>
  <ul class="list-disc pl-5 space-y-2 mb-8">
    <li><strong>Tiền mặt:</strong> Thanh toán trực tiếp tại các quầy thu ngân.</li>
    <li><strong>Thẻ ngân hàng:</strong> Chấp nhận tất cả các loại thẻ ATM nội địa, Visa, Mastercard, JCB...</li>
    <li><strong>Chuyển khoản:</strong> Quét mã QR Code tại quầy hoặc chuyển khoản qua ngân hàng.</li>
    <li><strong>Ví điện tử:</strong> Momo, ZaloPay, VNPay...</li>
  </ul>
  <h3 class="text-xl font-bold text-gray-900 mb-4">2. Quy trình thanh toán</h3>
  <div class="space-y-4 mb-8">
    <div class="flex items-start">
      <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">1</div>
      <div class="ml-4">
        <p class="font-semibold text-gray-900">Nhận phiếu chỉ định/đơn thuốc</p>
        <p class="text-gray-600 text-sm">Sau khi khám, bác sĩ sẽ in phiếu chỉ định cận lâm sàng hoặc đơn thuốc.</p>
      </div>
    </div>
    <div class="flex items-start">
      <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">2</div>
      <div class="ml-4">
        <p class="font-semibold text-gray-900">Đến quầy thu ngân</p>
        <p class="text-gray-600 text-sm">Nộp phiếu tại quầy thu ngân. Nhân viên sẽ kiểm tra và thông báo số tiền cần thanh toán.</p>
      </div>
    </div>
    <div class="flex items-start">
      <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm mt-1">3</div>
      <div class="ml-4">
        <p class="font-semibold text-gray-900">Thực hiện thanh toán</p>
        <p class="text-gray-600 text-sm">Lựa chọn hình thức thanh toán phù hợp và nhận hóa đơn đỏ (nếu cần).</p>
      </div>
    </div>
  </div>
  <h3 class="text-xl font-bold text-gray-900 mb-4">3. Xuất hóa đơn GTGT</h3>
  <p class="mb-6">Khách hàng có nhu cầu xuất hóa đơn GTGT vui lòng cung cấp thông tin xuất hóa đơn cho nhân viên thu ngân ngay khi thanh toán. Hóa đơn điện tử sẽ được gửi qua email hoặc tra cứu trên website của bệnh viện.</p>
</div>"""
        }
    ]
    
    for guide in default_guides:
        if not patient_db.guides.find_one({"slug": guide["slug"]}):
            patient_db.guides.insert_one(guide)
            print(f"Initialized default guide: {guide['slug']}")

@app.on_event("shutdown")
async def shutdown_db_client():
    db.close()

@app.post("/login", response_model=AdminResponse)
async def login_admin(user_login: AdminLogin):
    admin_db = db.get_db()
    admin = admin_db.admins.find_one({"username": user_login.identifier})
    
    if not admin:
        raise HTTPException(status_code=400, detail="Tài khoản admin không tồn tại")

    if not verify_password(user_login.password, admin['password_hash']):
        raise HTTPException(status_code=400, detail="Mật khẩu không chính xác")

    access_token = create_access_token(data={"sub": admin["username"], "role": "admin"})

    return AdminResponse(
        id=str(admin["_id"]),
        username=admin["username"],
        name=admin["name"],
        role="admin",
        access_token=access_token,
        token_type="bearer"
    )


async def get_current_admin(request: Request):
    """Authorization dependency for admin endpoints.
    Prefer forwarded headers from gateway (`x-user-id`, `x-user-role`).
    Fallback to Authorization: Bearer <token> and decode locally using admin SECRET_KEY.
    """
    forwarded_user = request.headers.get("x-user-id") or request.headers.get("x-user")
    forwarded_role = request.headers.get("x-user-role") or request.headers.get("x-user-roles")
    username = None

    if forwarded_user:
        username = forwarded_user
        role = (forwarded_role or "admin").lower()
        if role != "admin":
            raise HTTPException(status_code=403, detail="Admin role required")
    else:
        auth = request.headers.get("authorization")
        if not auth:
            raise HTTPException(status_code=401, detail="Missing credentials")
        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        token = parts[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin role required")
        username = payload.get("sub")

    if not username:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    admin = db.get_db().admins.find_one({"username": username})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin

@app.get("/patients", response_model=List[PatientInfo])
async def get_all_patients():
    patient_db = db.client[PATIENT_DB_NAME]
    patients = list(patient_db.patients.find())
    
    return [
        PatientInfo(
            id=str(p["_id"]),
            username=p.get("username", "N/A"),
            name=p.get("name", "N/A"),
            phone=p.get("phone", "N/A"),
            gender=p.get("gender", "N/A"),
            dob=p.get("dob", "N/A"),
            address=p.get("address", "N/A")
        ) for p in patients
    ]

@app.get("/doctors", response_model=List[DoctorInfo])
async def get_all_doctors(specialty: Optional[str] = None):
    doctor_db = db.client[DOCTOR_DB_NAME]
    query = {}
    if specialty:
        query["specialty"] = specialty
    doctors = list(doctor_db.doctors.find(query))
    
    return [
        DoctorInfo(
            id=str(d["_id"]),
            username=d.get("username", "N/A"),
            name=d.get("name", "N/A"),
            phone=d.get("phone", "N/A"),
            specialty=d.get("specialty", "N/A"),
            gender=d.get("gender", "N/A")
        ) for d in doctors
    ]

@app.get("/guides", response_model=List[GuideResponse])
async def get_all_guides():
    patient_db = db.client[PATIENT_DB_NAME]
    guides = list(patient_db.guides.find())
    return [GuideResponse(slug=g["slug"], title=g["title"], content=g["content"]) for g in guides]

@app.get("/guides/{slug}", response_model=GuideResponse)
async def get_guide(slug: str):
    patient_db = db.client[PATIENT_DB_NAME]
    guide = patient_db.guides.find_one({"slug": slug})
    if not guide:
        raise HTTPException(status_code=404, detail="Guide not found")
    return GuideResponse(slug=guide["slug"], title=guide["title"], content=guide["content"])

@app.put("/guides/{slug}", response_model=GuideResponse)
async def update_guide(slug: str, guide_update: GuideUpdate):
    patient_db = db.client[PATIENT_DB_NAME]
    result = patient_db.guides.find_one_and_update(
        {"slug": slug},
        {"$set": {"title": guide_update.title, "content": guide_update.content}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Guide not found")
    return GuideResponse(slug=result["slug"], title=result["title"], content=result["content"])

@app.post("/doctors/register")
async def register_doctor(doctor: DoctorCreate):
    doctor_db = db.client[DOCTOR_DB_NAME]
    admin_db = db.get_db()
    
    # Check if username exists
    if doctor_db.doctors.find_one({"username": doctor.username}):
        raise HTTPException(status_code=400, detail="Tên đăng nhập đã tồn tại")
    
    # Check if document number already exists
    doc_hash = hash_document_number(doctor.documentNumber)
    if doctor_db.doctors.find_one({"document_number_hash": doc_hash}):
        raise HTTPException(status_code=400, detail="Số định danh (CCCD/Hộ chiếu) đã được đăng ký")

    doctor_data = doctor.dict()
    doctor_data["password_hash"] = get_password_hash(doctor_data.pop("password"))
    
    # Hash and encrypt document number for security and uniqueness
    doctor_data["document_number_hash"] = doc_hash
    doctor_data["documentNumber"] = encrypt_document_number(doctor.documentNumber)
    
    # Insert into doctors collection
    result = doctor_db.doctors.insert_one(doctor_data)
    
    # Sync to admins collection for login
    if not admin_db.admins.find_one({"username": doctor.username}):
        admin_db.admins.insert_one({
            "username": doctor.username,
            "password_hash": doctor_data["password_hash"],
            "name": doctor.name,
            "role": "doctor"
        })
        
    return {"message": "Đăng ký bác sĩ thành công", "id": str(result.inserted_id)}

@app.post("/doctors/bulk-register")
async def bulk_register_doctors(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file Excel (.xlsx, .xls)")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        # Clean column names (strip spaces and convert to lowercase for easier matching)
        df.columns = [str(col).strip().lower() for col in df.columns]
        print(f"Excel columns found: {list(df.columns)}")
        
        # Expected columns (lowercase)
        required_cols = ["username", "password", "name", "dob", "gender", "phone", "id_type", "id_number", "address", "specialty"]
        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Thiếu cột bắt buộc: {col}. Các cột hiện có: {list(df.columns)}")
        
        doctor_db = db.client[DOCTOR_DB_NAME]
        admin_db = db.get_db() # For syncing to admins table if needed
        
        success_count = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                # Skip empty rows
                if pd.isna(row.get("username")) or str(row.get("username")).strip() == "":
                    continue
                    
                username = str(row["username"]).strip()
                
                # Check if username exists in doctors or admins
                if doctor_db.doctors.find_one({"username": username}):
                    errors.append(f"Dòng {index+2}: Tên đăng nhập '{username}' đã tồn tại")
                    continue
                
                # Clean numeric fields (remove .0 if pandas read them as float)
                def clean_val(val):
                    if pd.isna(val): return ""
                    s = str(val).strip()
                    if s.endswith('.0'):
                        return s[:-2]
                    return s

                doc_num = clean_val(row.get("id_number"))
                doc_hash = hash_document_number(doc_num)
                
                print(f"Processing row {index+2}: username={username}, doc_num={doc_num}, doc_hash={doc_hash}")
                
                # Check if document number already exists
                if doctor_db.doctors.find_one({"document_number_hash": doc_hash}):
                    errors.append(f"Dòng {index+2}: Số định danh '{doc_num}' đã được đăng ký")
                    continue

                # Format date of birth
                dob_val = row.get("dob")
                if isinstance(dob_val, pd.Timestamp):
                    dob_str = dob_val.strftime('%Y-%m-%d')
                elif pd.isna(dob_val):
                    dob_str = "N/A"
                else:
                    dob_str = str(dob_val).split(' ')[0]

                doctor_data = {
                    "username": username,
                    "password_hash": get_password_hash(clean_val(row.get("password"))),
                    "name": clean_val(row.get("name")),
                    "dob": dob_str,
                    "gender": clean_val(row.get("gender")),
                    "phone": clean_val(row.get("phone")),
                    "documentType": clean_val(row.get("id_type")),
                    "documentNumber": encrypt_document_number(doc_num),
                    "document_number_hash": doc_hash,
                    "address": clean_val(row.get("address")),
                    "specialty": clean_val(row.get("specialty"))
                }
                
                # Insert into doctors collection
                doctor_db.doctors.insert_one(doctor_data)
                
                # Sync to admins collection
                if not admin_db.admins.find_one({"username": username}):
                    admin_db.admins.insert_one({
                        "username": username,
                        "password_hash": doctor_data["password_hash"],
                        "name": doctor_data["name"],
                        "role": "doctor"
                    })
                
                success_count += 1
            except Exception as e:
                print(f"Error at row {index+2}: {str(e)}")
                errors.append(f"Dòng {index+2}: {str(e)}")
        
        return {
            "message": f"Đã đăng ký thành công {success_count} bác sĩ",
            "errors": errors
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý file: {str(e)}")

@app.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    patient_db = db.client[PATIENT_DB_NAME]
    try:
        result = patient_db.patients.delete_one({"_id": ObjectId(patient_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Patient not found")
        return {"message": "Patient deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: str):
    doctor_db = db.client[DOCTOR_DB_NAME]
    try:
        result = doctor_db.doctors.delete_one({"_id": ObjectId(doctor_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Doctor not found")
        return {"message": "Doctor deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/appointments", response_model=List[AppointmentInfo])
async def get_all_appointments():
    patient_db = db.client[PATIENT_DB_NAME]
    appointments = list(patient_db.appointments.find())
    
    # Get all patients to map names
    patients = list(patient_db.patients.find())
    patient_map = {str(p["_id"]): p.get("name", "N/A") for p in patients}
    # Also map by phone just in case
    phone_map = {p.get("phone"): p.get("name", "N/A") for p in patients if p.get("phone")}
    
    result = []
    for a in appointments:
        # Try to get name from patient_id or phone
        p_id = a.get("patient_id")
        phone = a.get("phone")
        
        name = "N/A"
        if p_id and p_id in patient_map:
            name = patient_map[p_id]
        elif phone and phone in phone_map:
            name = phone_map[phone]
            
        result.append(AppointmentInfo(
            id=str(a["_id"]),
            patient_name=name,
            phone=a.get("phone", "N/A"),
            doctor_name=a.get("doctor", "N/A"), # Use 'doctor' field from DB
            date=a.get("date", "N/A"),
            time=a.get("time", "N/A"),
            status=a.get("status", "pending"),
            reason=a.get("reason"),
            appointmentType=a.get("appointmentType", a.get("type", "new"))
        ))
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
