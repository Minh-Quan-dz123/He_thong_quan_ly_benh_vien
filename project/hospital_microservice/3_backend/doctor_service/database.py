from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import certifi
import os
from dotenv import load_dotenv
load_dotenv()
# Use same URI and DB as patient_service
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://ngoquan:ngoquan@cluster0.sjfre6b.mongodb.net/?retryWrites=true&w=majority&connectTimeoutMS=30000&socketTimeoutMS=30000")
# Use a separate database for doctors
DB_NAME = "hospital_doctors_db"

class Database:
    client: MongoClient = None
    db = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
            self.db = self.client[DB_NAME]
            # ensure indexes for doctors
            self.db.doctors.create_index("username", unique=True)
            self.db.doctors.create_index("phone", unique=True)
            self.db.doctors.create_index("document_number_hash", unique=True)
            print("Doctor service connected to MongoDB and ensured indexes.")
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")

    def get_db(self):
        return self.db

    def close(self):
        if self.client:
            self.client.close()

db = Database()
