from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import redis
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Conexión a Redis (docker)
connection = redis.StrictRedis(
    host="redis",
    port=6379,
    db=0,
    decode_responses=True
)

# Inicialización de capítulos (solo una vez para pruebas iniciales)
def inicializar_capitulos():
    capitulos = [
    {"id": 1, "titulo": "Capítulo 1: El Mandaloriano", "estado": "disponible", "reservado_hasta": None},
    {"id": 2, "titulo": "Capítulo 2: El niño", "estado": "disponible", "reservado_hasta": None},
    {"id": 3, "titulo": "Capítulo 3: La Sin Hueso", "estado": "disponible", "reservado_hasta": None},
    {"id": 4, "titulo": "Capítulo 4: El Santuario", "estado": "disponible", "reservado_hasta": None},
    {"id": 5, "titulo": "Capítulo 5: El Pistolero", "estado": "disponible", "reservado_hasta": None},
    {"id": 6, "titulo": "Capítulo 6: El Prisionero", "estado": "disponible", "reservado_hasta": None},
    {"id": 7, "titulo": "Capítulo 7: La Redada", "estado": "disponible", "reservado_hasta": None},
    {"id": 8, "titulo": "Capítulo 8: La Batalla Final", "estado": "disponible", "reservado_hasta": None},
    {"id": 9, "titulo": "Capítulo 9: El Marshall", "estado": "disponible", "reservado_hasta": None},
    {"id": 10, "titulo": "Capítulo 10: La Trampa", "estado": "disponible", "reservado_hasta": None},
    {"id": 11, "titulo": "Capítulo 11: La Believer", "estado": "disponible", "reservado_hasta": None},
    {"id": 12, "titulo": "Capítulo 12: El Sitio", "estado": "disponible", "reservado_hasta": None},
    {"id": 13, "titulo": "Capítulo 13: El Jedi", "estado": "disponible", "reservado_hasta": None},
    {"id": 14, "titulo": "Capítulo 14: La Trampa", "estado": "disponible", "reservado_hasta": None},
    {"id": 15, "titulo": "Capítulo 15: La Fuerza Oscura", "estado": "disponible", "reservado_hasta": None},
    {"id": 16, "titulo": "Capítulo 16: El Rescate", "estado": "disponible", "reservado_hasta": None},
]
    # Guardamos los capítulos en Redis
    for cap in capitulos:
        connection.set(f"capitulo:{cap['id']}", json.dumps(cap))

# Inicializamos los capítulos si no están ya en Redis (esto solo debe hacerse una vez)
# Inicializamos los capítulos solo si no están cargados aún en Redis
if not connection.exists("capitulo:1"):
    inicializar_capitulos()


@app.route('/')
def home():
    return jsonify({"message": "Bienvenido a la API de capítulos. Usá /capitulos para ver la lista."}), 200


# Ruta para listar los capítulos
@app.route('/capitulos', methods=['GET'])
def listar_capitulos():
    capitulos = []
    # Obtenemos todos los capítulos (suponiendo que tenemos 5 capítulos)
    for i in range(1, 17):
        cap_data = connection.get(f"capitulo:{i}")
        if cap_data:
            cap = json.loads(cap_data)
            # Verificar si el capítulo está reservado por más de 4 minutos, cambiar a disponible
            if cap['estado'] == 'reservado' and cap['reservado_hasta']:
                if datetime.now() > datetime.strptime(cap['reservado_hasta'], "%Y-%m-%d %H:%M:%S"):
                    cap['estado'] = 'disponible'
                    cap['reservado_hasta'] = None
                    # Guardamos la actualización en Redis
                    connection.set(f"capitulo:{i}", json.dumps(cap))
            capitulos.append(cap)

    return jsonify(capitulos), 200

# Ruta para alquilar un capítulo (reservar por 4 minutos)
@app.route('/alquilar/<int:id>', methods=['POST'])
def alquilar(id):
    cap_data = connection.get(f"capitulo:{id}")
    if cap_data:
        cap = json.loads(cap_data)
        if cap['estado'] == 'disponible':
            cap['estado'] = 'reservado'
            cap['reservado_hasta'] = (datetime.now() + timedelta(minutes=4)).strftime("%Y-%m-%d %H:%M:%S")
            connection.set(f"capitulo:{id}", json.dumps(cap))
            return jsonify({"message": f"Capítulo {id} reservado por 4 minutos"}), 200
        else:
            return jsonify({"message": "Capítulo no disponible para alquilar"}), 400
    else:
        return jsonify({"message": "Capítulo no encontrado"}), 404

# Ruta para confirmar el pago
@app.route('/confirmar_pago/<int:id>', methods=['POST'])
def confirmar_pago(id):
    cap_data = connection.get(f"capitulo:{id}")
    if cap_data:
        cap = json.loads(cap_data)
        if cap['estado'] == 'reservado':
            # Confirmar el pago y registrar el alquiler por 24 horas
            cap['estado'] = 'alquilado'
            cap['reservado_hasta'] = (datetime.now() + timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S")
            connection.set(f"capitulo:{id}", json.dumps(cap))
            return jsonify({"message": f"Pago confirmado. Capítulo {id} alquilado por 24 horas"}), 200
        else:
            return jsonify({"message": "Capítulo no reservado o ya alquilado"}), 400
    else:
        return jsonify({"message": "Capítulo no encontrado"}), 404

# Ruta para cancelar la reserva si no se paga a tiempo
@app.route('/cancelar_reserva/<int:id>', methods=['POST'])
def cancelar_reserva(id):
    cap_data = connection.get(f"capitulo:{id}")
    if cap_data:
        cap = json.loads(cap_data)
        if cap['estado'] == 'reservado':
            cap['estado'] = 'disponible'
            cap['reservado_hasta'] = None
            connection.set(f"capitulo:{id}", json.dumps(cap))
            return jsonify({"message": f"Reserva del capítulo {id} cancelada"}), 200
        else:
            return jsonify({"message": "Capítulo no está reservado"}), 400
    else:
        return jsonify({"message": "Capítulo no encontrado"}), 404

if __name__ == '__main__':
    app.run(debug=True, host="backend")

