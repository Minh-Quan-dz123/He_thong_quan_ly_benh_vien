from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import certifi

MONGO_URI = "mongodb+srv://ngoquan:ngoquan@cluster0.sjfre6b.mongodb.net/?retryWrites=true&w=majority&connectTimeoutMS=30000&socketTimeoutMS=30000"
DB_NAME = "admin_db"

class Database:
    client: MongoClient = None
    db = None

    def connect(self):
        try:
            self.client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
            self.db = self.client[DB_NAME]
            # Create unique indexes
            self.db.admins.create_index("username", unique=True)
            print("Connected to MongoDB (Admin DB) and ensured indexes.")
        except ConnectionFailure as e:
            print(f"Could not connect to MongoDB: {e}")

    def get_db(self):
        return self.db

    def close(self):
        if self.client:
            self.client.close()

db = Database()
