from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import db
from schemas import UserRegister, UserResponse
from utils import get_password_hash, hash_document_number, encrypt_document_number
from pymongo.errors import DuplicateKeyError
import uvicorn
from typing import List

app = FastAPI(title="Patient Service API")

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

    # Check if username exists
    if db.get_db().patients.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if phone exists
    if db.get_db().patients.find_one({"phone": user.phone}):
        raise HTTPException(status_code=400, detail="Phone number already exists")

    # Check if document number exists (using hash)
    doc_hash = hash_document_number(user.documentNumber)
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
    
    # Insert into MongoDB
    try:
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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
