from pydantic import BaseModel
from typing import Optional, List

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

class PatientResponse(BaseModel):
    id: str
    username: str
    name: str
    phone: Optional[str] = None
    dob: Optional[str] = None
    address: Optional[str] = None

    class Config:
        from_attributes = True

class PaginatedPatientResponse(BaseModel):
    total: int
    page: int
    limit: int
    patients: List[PatientResponse]

class DoctorRegister(BaseModel):
    username: str
    password: str
    name: str
    dob: str
    gender: str
    phone: str
    documentType: str
    documentNumber: str
    address: str
    specialty: Optional[str] = None

class DoctorResponse(BaseModel):
    id: str
    username: str
    name: str
    phone: str
    role: Optional[str] = None
    specialty: Optional[str] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"

    class Config:
        from_attributes = True

class DoctorDetailResponse(BaseModel):
    id: str
    username: str
    name: str
    dob: str
    gender: str
    phone: str
    documentType: str
    documentNumber: str
    address: str
    specialty: Optional[str] = None

    class Config:
        from_attributes = True

class DoctorLogin(BaseModel):
    identifier: str
    password: str


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    specialty: Optional[str] = None
    bloodType: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    allergies: Optional[str] = None
