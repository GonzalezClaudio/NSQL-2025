from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import superheroes_collection
import json
import os
import shutil

app = FastAPI()

# CORS para frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorios para las imagenes
static_dir = os.path.join(os.path.dirname(__file__), "static")
carousel_dir = os.path.join(static_dir, "carousel")
os.makedirs(carousel_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.mount("/carousel", StaticFiles(directory=carousel_dir), name="carousel")

# Cargar datos del JSON si la colección está vacía
@app.on_event("startup")
def cargar_datos_si_vacio():
    if superheroes_collection.count_documents({}) == 0:
        print("Colección vacía. Cargando datos iniciales...")
        ruta_json = os.path.join(os.path.dirname(__file__), "superheroes.json")
        with open(ruta_json, "r", encoding="utf-8") as f:
            datos = json.load(f)
            superheroes_collection.insert_many(datos)
        print("Superhéroes cargados correctamente.")
    else:
        print("La colección ya contiene datos. No se cargó nada.")

# rutas para listar Superhéroes

@app.get("/superheroes")
async def obtener_todos():
    heroes = list(superheroes_collection.find({}, {'_id': 0}))
    return heroes

# rutas para listar los de la casa de marvel
@app.get("/marvel")
async def obtener_marvel():
    heroes = list(superheroes_collection.find({"casa": "Marvel"}, {'_id': 0}))
    return heroes

# rutas para listar los de la casa dc
@app.get("/dc")
async def obtener_dc():
    heroes = list(superheroes_collection.find({"casa": "DC"}, {'_id': 0}))
    return heroes

# rutas para listar por filtro del nombre
@app.get("/superheroes/{nombre}")
async def detalle_heroe(nombre: str):
    heroe = superheroes_collection.find_one({"nombre": nombre}, {'_id': 0})
    if heroe:
        heroe["cantidad_imagenes"] = len(heroe.get("imagenes_carousel", []))
        return heroe
    return {"error": "Superhéroe no encontrado"}

# ruta para crear un superheroe
@app.post("/superheroes")
async def crear_heroe(request: Request):
    nuevo_heroe = await request.json()
    superheroes_collection.insert_one(nuevo_heroe)
    return {"mensaje": "Superhéroe creado con éxito"}

# ruta para editar un superheroe
@app.put("/superheroes/{nombre}")
async def actualizar_heroe(nombre: str, request: Request):
    datos = await request.json()
    resultado = superheroes_collection.update_one({"nombre": nombre}, {"$set": datos})
    if resultado.matched_count == 0:
        return {"error": "Superhéroe no encontrado"}
    return {"mensaje": "Superhéroe actualizado con éxito"}

# ruta para eliminar un superheroe
@app.delete("/superheroes/{nombre}")
async def eliminar_heroe(nombre: str):
    resultado = superheroes_collection.delete_one({"nombre": nombre})
    if resultado.deleted_count == 0:
        return {"error": "Superhéroe no encontrado"}
    return {"mensaje": "Superhéroe eliminado con éxito"}

# Subir imagen al servidor
@app.post("/superheroes/subir_imagen")
async def subir_imagen(imagen: UploadFile = File(...)):
    if not imagen.filename:
        raise HTTPException(status_code=400, detail="Archivo no válido")

    ruta_destino = os.path.join(carousel_dir, imagen.filename)
    try:
        with open(ruta_destino, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar la imagen: {str(e)}")

    url_imagen = f"static/carousel/{imagen.filename}"
    return {"mensaje": "Imagen subida correctamente", "url": url_imagen}

#Asociar imagen al superhéroe
@app.put("/superheroes/{nombre}/agregar_imagen")
async def agregar_imagen(nombre: str, request: Request):
    data = await request.json()
    nombre_imagen = data.get("nueva_imagen")

    if not nombre_imagen:
        raise HTTPException(status_code=400, detail="Nombre de imagen no proporcionado")

    nueva_imagen_url = f"static/carousel/{nombre_imagen}"

    resultado = superheroes_collection.update_one(
        {"nombre": nombre},
        {
            "$push": {"imagenes_carousel": nueva_imagen_url},
            "$inc": {"cantidad_imagenes": 1}
        }
    )

    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Superhéroe no encontrado")

    return {"mensaje": f"Imagen agregada a {nombre} correctamente", "url": nueva_imagen_url}

