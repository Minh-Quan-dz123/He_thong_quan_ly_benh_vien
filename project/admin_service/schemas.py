from pydantic import BaseModel
from typing import Optional, List

class AdminLogin(BaseModel):
    identifier: str # username
    password: str

class AdminResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str = "admin"
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"

    class Config:
        from_attributes = True

class PatientInfo(BaseModel):
    id: str
    username: str
    name: str
    phone: str
    gender: str
    dob: str
    address: str

class DoctorInfo(BaseModel):
    id: str
    username: str
    name: str
    phone: str
    specialty: str
    gender: str

class DoctorCreate(BaseModel):
    username: str
    password: str
    name: str
    dob: str
    gender: str
    phone: str
    documentType: str
    documentNumber: str
    address: str
    specialty: str

class AppointmentInfo(BaseModel):
    id: str
    patient_name: str
    phone: str
    doctor_name: str
    date: str
    time: str
    status: str
    reason: Optional[str] = None
    appointmentType: Optional[str] = 'new'

class GuideUpdate(BaseModel):
    title: str
    content: str

class GuideResponse(BaseModel):
    slug: str
    title: str
    content: str
