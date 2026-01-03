from passlib.context import CryptContext
from cryptography.fernet import Fernet
import hashlib
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

# Password hashing
# Use pbkdf2_sha256 as the default scheme to avoid bcrypt's 72-byte limit
# but keep bcrypt in the list to verify existing bcrypt hashes.
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], default="pbkdf2_sha256", deprecated="auto")

# JWT Configuration
SECRET_KEY = "your-jwt-secret" # In production, use a secure environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Encryption key (In production, load this from environment variables)
ENCRYPTION_KEY = b'05MynJyhfcFt3WACEP4obL7fFMOr4WEPIbp-no9GOz4='
cipher_suite = Fernet(ENCRYPTION_KEY)

def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-byte limit. Newer versions of the bcrypt library throw ValueError
    # if the password exceeds this limit. We truncate it to 72 bytes for bcrypt hashes
    # to maintain compatibility and avoid the crash.
    if hashed_password.startswith(("$2a$", "$2b$", "$2y$")) and len(plain_password) > 72:
        plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def hash_document_number(document_number: str) -> str:
    """Hashes the document number for uniqueness checks."""
    return hashlib.sha256(document_number.encode()).hexdigest()


def encrypt_document_number(document_number: str) -> str:
    """Encrypts the document number for storage."""
    return cipher_suite.encrypt(document_number.encode()).decode()


def decrypt_document_number(encrypted_document_number: str) -> str:
    """Decrypts the document number."""
    return cipher_suite.decrypt(encrypted_document_number.encode()).decode()
