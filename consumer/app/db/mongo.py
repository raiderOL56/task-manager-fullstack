from pymongo import MongoClient

from app.core.config import settings


client = MongoClient(settings.mongodb_url)

database = client[settings.mongodb_database]

audit_logs_collection = database[settings.mongodb_collection]