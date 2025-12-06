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

class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    phone: str
    # We don't return sensitive info like password or document number by default

    class Config:
        from_attributes = True
