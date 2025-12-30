from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

class UserRegister(BaseModel):
    username: str
    password: str
    name: str
    dob: str  # Or date, but frontend sends string usually
    gender: str
    phone: str
    role: Optional[str] = 'patient'
    specialty: Optional[str] = None
    documentType: str
    documentNumber: str
    address: str
    bloodType: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    allergies: Optional[str] = None

class UserLogin(BaseModel):
    identifier: str # username or phone
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    phone: str
    role: Optional[str] = None
    # We don't return sensitive info like password or document number by default

    class Config:
        from_attributes = True

class UserDetailResponse(BaseModel):
    id: str
    username: str
    name: str
    dob: str
    gender: str
    phone: str
    documentType: str
    documentNumber: str
    address: str
    bloodType: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    allergies: Optional[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bloodType: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    allergies: Optional[str] = None

class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class ResetPassword(BaseModel):
    phone: str
    otp: str
    new_password: str

class AppointmentCreate(BaseModel):
    appointmentType: str = "new"
    doctor: Optional[str] = None
    date: str
    reason: str
    phone: str
    patient_id: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: str
    appointmentType: str
    doctor: Optional[str] = None
    date: str
    reason: str
    phone: str
    patient_id: Optional[str] = None
    status: str
    sequence_number: int
    message: Optional[str] = None

    class Config:
        from_attributes = True


class Medication(BaseModel):
    drug_name: str
    dosage: str
    timing: str # "Trước ăn" or "Sau ăn"

class MedicalRecordCreate(BaseModel):
    diagnosis: str
    medications: List[Medication]
    instructions: Optional[str] = None
    follow_up_date: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_specialty: Optional[str] = None

class EditHistory(BaseModel):
    edited_at: str
    diagnosis: str
    medications: List[Medication]
    instructions: Optional[str] = None
    follow_up_date: Optional[str] = None

class MedicalRecordResponse(BaseModel):
    id: str
    diagnosis: str
    medications: List[Medication]
    instructions: Optional[str] = None
    follow_up_date: Optional[str] = None
    created_at: str
    doctor_name: Optional[str] = None
    doctor_specialty: Optional[str] = None
    edit_history: Optional[List[EditHistory]] = []

    class Config:
        from_attributes = True
