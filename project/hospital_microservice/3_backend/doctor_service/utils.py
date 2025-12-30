from passlib.context import CryptContext
from cryptography.fernet import Fernet
import hashlib

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Encryption key (In production, load this from environment variables)
ENCRYPTION_KEY = b'05MynJyhfcFt3WACEP4obL7fFMOr4WEPIbp-no9GOz4='
cipher_suite = Fernet(ENCRYPTION_KEY)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def hash_document_number(document_number: str) -> str:
    """Hashes the document number for uniqueness checks."""
    return hashlib.sha256(document_number.encode()).hexdigest()


def encrypt_document_number(document_number: str) -> str:
    """Encrypts the document number for storage."""
    return cipher_suite.encrypt(document_number.encode()).decode()


def decrypt_document_number(encrypted_document_number: str) -> str:
    """Decrypts the document number."""
    return cipher_suite.decrypt(encrypted_document_number.encode()).decode()
