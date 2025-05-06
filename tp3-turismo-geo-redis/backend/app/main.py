from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import redis
from fastapi.middleware.cors import CORSMiddleware
from math import radians, sin, cos, sqrt, atan2


 
app = FastAPI()
origins = [
    "http://localhost:3000",  # Permitir solicitudes de tu frontend en React
    "http://localhost",  # Si usas localhost de manera directa
    # Puedes agregar más orígenes aquí si es necesario
]
# Middleware CORS (para permitir peticiones desde el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Podés restringir si querés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión a Redis
r = redis.Redis(host="redis", port=6379, decode_responses=True)

# Grupos definidos en la consigna
GROUPS = {
    "cervecerias",
    "universidades",
    "farmacias",
    "emergencias",
    "supermercados"
}

# Modelo de datos para un lugar
class Lugar(BaseModel):
    nombre: str
    grupo: str
    lat: float
    lon: float



# Ruta para agregar un lugar
@app.post("/lugares/")
def agregar_lugar(lugar: Lugar):
    if lugar.grupo not in GROUPS:
        raise HTTPException(status_code=400, detail="Grupo inválido")

    if r.exists(f"lugar:{lugar.nombre}"):
        raise HTTPException(status_code=400, detail="El lugar ya existe")

    # Guardar en índice geoespacial
    r.geoadd(f"geo:{lugar.grupo}", (lugar.lon, lugar.lat, lugar.nombre))

    # Guardar información adicional en Hash
    r.hset(f"lugar:{lugar.nombre}", mapping={
        "nombre": lugar.nombre,
        "grupo": lugar.grupo,
        "lat": str(lugar.lat),
        "lon": str(lugar.lon)
    })

    return {"mensaje": "✅ Lugar agregado exitosamente"}

# Ruta para obtener los datos de un lugar específico
@app.get("/lugares/{nombre}")
def obtener_lugar(nombre: str):
    lugar = r.hgetall(f"lugar:{nombre}")
    if not lugar:
        raise HTTPException(status_code=404, detail="Lugar no encontrado.")

    posicion = r.geopos(f"geo:{lugar['grupo']}", nombre)
    if posicion and posicion[0]:
        lugar["lat"] = posicion[0][1]
        lugar["lon"] = posicion[0][0]

    return lugar

# Ruta para obtener lugares cercanos a una ubicación en un grupo
@app.get("/lugares/grupo/{grupo}")
def lugares_por_grupo(grupo: str, lat: float, lon: float):
    if grupo not in GROUPS:
        raise HTTPException(status_code=400, detail="Grupo inválido")

    # Buscar lugares dentro de un radio de 5 km desde la ubicación (lon, lat)
    nombres = r.georadius(f"geo:{grupo}", lon, lat, 5, unit="km")

    lugares = []
    for nombre in nombres:
        datos = r.hgetall(f"lugar:{nombre}")
        if datos:
            lugares.append({
                "nombre": datos.get("nombre"),
                "lat": datos.get("lat"),
                "lon": datos.get("lon")
            })

    return {"lugares": lugares}




# Función para calcular distancia entre dos coordenadas (Haversine)
def calcular_distancia(lat1, lon1, lat2, lon2):
    R = 6371  # Radio de la Tierra en km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

@app.get("/distancia")
def distancia_a_lugar(grupo: str, nombre: str, lat: float, lon: float):
    if grupo not in GROUPS:
        raise HTTPException(status_code=400, detail="Grupo inválido")

    if not r.exists(f"lugar:{nombre}"):
        raise HTTPException(status_code=404, detail="Lugar no encontrado")

    print(f"grupo: {grupo}, nombre: {nombre}, lon: {lon}, lat: {lat}")

    # Obtener coordenadas desde Redis
    pos = r.geopos(f"geo:{grupo}", nombre)
    if not pos or pos[0] is None:
        raise HTTPException(status_code=404, detail="No se pudo obtener la posición del lugar")

    lon_db, lat_db = map(float, pos[0])

    # Calcular la distancia
    distancia = calcular_distancia(lat_db, lon_db, lat, lon)

    return {"distancia_km": round(distancia, 3)}

