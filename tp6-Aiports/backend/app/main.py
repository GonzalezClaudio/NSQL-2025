from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional
import redis
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a MongoDB
mongo_client = MongoClient("mongodb://mongo:27017/")
db = mongo_client["aeropuerto"]
collection = db["airports"]

# Conexión a Redis GEO
redis_geo = redis.Redis(host="redis-geo", port=6379, decode_responses=True)

# Conexión a Redis Popularidad
redis_pop = redis.Redis(host="redis-pop", port=6379, decode_responses=True)


class Airport(BaseModel):
    name: str
    city: str
    iata_faa: Optional[str]
    icao: Optional[str]
    lat: float
    lng: float
    alt: Optional[int]
    tz: Optional[str]


def validar_coordenadas(lat: float, lng: float) -> bool:
    return (-85.05112878 <= lat <= 85.05112878) and (-180 <= lng <= 180)


@app.on_event("startup")
def load_data():
    print("📥 Cargando datos desde airports.json...")
    try:
        with open("data_trasport.json", "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Error al leer el archivo JSON: {e}")
        return

    if collection.count_documents({}) == 0:
        collection.insert_many(data)
        print("✅ Datos insertados en MongoDB")

    for airport in data:
        lat = airport.get("lat")
        lng = airport.get("lng")
        key = airport.get("iata_faa") or airport.get("icao")

        if not key or lat is None or lng is None:
            continue

        if not validar_coordenadas(lat, lng):
            print(f"❌ Coordenadas inválidas para {key}: lat={lat}, lng={lng} - Se omite")
            continue

        redis_geo.geoadd("aeropuertos_geo", (lng, lat, key))

        if not redis_pop.zscore("aeropuertos_pop", key):
            redis_pop.zadd("aeropuertos_pop", {key: 0})

    redis_pop.expire("aeropuertos_pop", 86400)  # TTL 1 día
    print("📍 Coordenadas cargadas y popularidad inicializada")


# POST /airports
@app.post("/airports")
def create_airport(airport: Airport):
    key = airport.iata_faa or airport.icao
    if not key:
        raise HTTPException(status_code=400, detail="Debe tener IATA o ICAO")

    if collection.find_one({"$or": [{"iata_faa": key}, {"icao": key}]}):
        raise HTTPException(status_code=400, detail="Aeropuerto ya existe")

    if not validar_coordenadas(airport.lat, airport.lng):
        raise HTTPException(status_code=400, detail="Coordenadas inválidas")

    collection.insert_one(airport.dict())
    redis_geo.geoadd("aeropuertos_geo", (airport.lng, airport.lat, key))
    redis_pop.zadd("aeropuertos_pop", {key: 0})
    redis_pop.expire("aeropuertos_pop", 86400)
    return {"message": "Aeropuerto creado correctamente"}


# GET /airports
@app.get("/airports")
def list_airports():
    return list(collection.find({}, {"_id": 0}))

# GET /airports/popular
@app.get("/airports/popular")
def popular_airports():
    top = redis_pop.zrevrange("aeropuertos_pop", 0, 9, withscores=True)
    return [{"airport": a, "visits": int(score)} for a, score in top]

# GET /airports/{code}
@app.get("/airports/{code}")
def get_airport(code: str):
    airport = collection.find_one({"$or": [{"iata_faa": code}, {"icao": code}]}, {"_id": 0})
    if not airport:
        raise HTTPException(status_code=404, detail="Aeropuerto no encontrado")

    redis_pop.zincrby("aeropuertos_pop", 1, code)
    return airport


# PUT /airports/{code}
@app.put("/airports/{code}")
def update_airport(code: str, airport: Airport):
    result = collection.update_one({"$or": [{"iata_faa": code}, {"icao": code}]}, {"$set": airport.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Aeropuerto no encontrado")

    return {"message": "Aeropuerto actualizado correctamente"}


# DELETE /airports/{code}
@app.delete("/airports/{code}")
def delete_airport(code: str):
    airport = collection.find_one({"$or": [{"iata_faa": code}, {"icao": code}]})
    if not airport:
        raise HTTPException(status_code=404, detail="Aeropuerto no encontrado")

    key = airport.get("iata_faa") or airport.get("icao")
    collection.delete_one({"$or": [{"iata_faa": code}, {"icao": code}]})
    redis_geo.zrem("aeropuertos_geo", key)
    redis_pop.zrem("aeropuertos_pop", key)
    return {"message": "Aeropuerto eliminado correctamente"}


# GET /airports/nearby?lat=..&lng=..&radius=..
@app.get("/airports/nearby")
def nearby_airports(lat: float, lng: float, radius: float):
    results = redis_geo.georadius("aeropuertos_geo", lng, lat, radius, unit="km", withdist=True)
    return [{"airport": name, "distance_km": dist} for name, dist in results]


# GET /airports/popular
@app.get("/airports/popular")
def popular_airports():
    top = redis_pop.zrevrange("aeropuertos_pop", 0, 9, withscores=True)
    return [{"airport": a, "visits": int(score)} for a, score in top]


