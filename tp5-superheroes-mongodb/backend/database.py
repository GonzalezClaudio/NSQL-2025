from pymongo import MongoClient

client = MongoClient("mongodb://superheroes-mongo:27017/")
db = client["superheroes_db"]
superheroes_collection = db["superheroes"]
