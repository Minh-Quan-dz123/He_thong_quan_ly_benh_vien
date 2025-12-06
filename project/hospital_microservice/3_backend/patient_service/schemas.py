from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class UserRegister(BaseModel):
    username: str
    password: str
    name: str
    dob: str  # Or date, but frontend sends string usually
    gender: str
    phone: str
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
    # documentNumber: str # Keep sensitive info hidden or masked if needed
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
    doctor: str
    date: str
    time: str
    reason: str
    phone: str
    patient_id: Optional[str] = None # Optional, in case we want to link it to a registered user

class AppointmentResponse(BaseModel):
    id: str
    doctor: str
    date: str
    time: str
    reason: str
    phone: str
    patient_id: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
