from pymongo import MongoClient
import certifi

MONGO_URI = "mongodb+srv://ngoquan:ngoquan@cluster0.sjfre6b.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "hospital_doctors_db"

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client[DB_NAME]

# Delete doctors with null or missing document_number_hash
result = db.doctors.delete_many({
    "$or": [
        {"document_number_hash": None},
        {"document_number_hash": {"$exists": False}}
    ]
})

print(f"Deleted {result.deleted_count} invalid doctor records.")

# Also check admin_db for any partial syncs
admin_db = client["admin_db"]
# We don't necessarily want to delete admins, but good to know
print("Cleanup complete.")
