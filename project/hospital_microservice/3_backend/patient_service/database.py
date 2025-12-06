from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

MONGO_URI = "mongodb+srv://ngoquan:ngoquan@cluster0.sjfre6b.mongodb.net/"
DB_NAME = "hospital_db"

class Database:
    client: MongoClient = None
    db = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI)
            self.db = self.client[DB_NAME]
            # Create unique indexes
            self.db.patients.create_index("username", unique=True)
            self.db.patients.create_index("phone", unique=True)
            self.db.patients.create_index("document_number_hash", unique=True)
            print("Connected to MongoDB and ensured indexes.")
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")

    def get_db(self):
        return self.db

    def close(self):
        if self.client:
            self.client.close()

db = Database()
