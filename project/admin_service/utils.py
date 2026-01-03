import bcrypt
import hashlib
from cryptography.fernet import Fernet
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os  # để đọc biến môi trường

# JWT Configuration
SECRET_KEY = "your-jwt-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

# Encryption key (Must match doctor_service)
#ENCRYPTION_KEY = b'05MynJyhfcFt3WACEP4obL7fFMOr4WEPIbp-no9GOz4='
SECRET_KEY = os.getenv("SECRET_KEY", "your-jwt-secret") 
cipher_suite = Fernet(ENCRYPTION_KEY)

def verify_password(plain_password, hashed_password):
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def get_password_hash(password):
    pwd_bytes = password.encode('utf-8')
    if len(pwd_bytes) > 72:
        pwd_bytes = pwd_bytes[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def hash_document_number(document_number: str) -> str:
    """Hashes the document number for uniqueness checks."""
    return hashlib.sha256(document_number.encode()).hexdigest()

def encrypt_document_number(document_number: str) -> str:
    """Encrypts the document number for storage."""
    return cipher_suite.encrypt(document_number.encode()).decode()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
