import json
from database import superheroes_collection

# Ruta al archivo JSON
with open("superheroes.json", encoding="utf-8") as archivo:
    datos = json.load(archivo)

# Insertar todos los documentos del archivo json
resultado = superheroes_collection.insert_many(datos)
print(f"Insertados {len(resultado.inserted_ids)} superhéroes.")
