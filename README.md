# NSQL-2025
# TP2 y TP3 - Sistema de Alquiler con Redis + Flask + React

Este proyecto es parte de los trabajos prácticos 2 y 3. Se trata de una aplicación web que permite gestionar el alquiler de los capitulos de todas las temporadas de the Mandalorian. 
Genera una lista con los capitulos donde se puede reservar una pelicula, en caso
de que no se confirme el pago despues de 4 min vuelve al estado de disponible.


- **Frontend**: React
- **Backend**: Flask (Python)
- **Base de datos**: Redis (clave-valor)


## Ejecucion del programa!!!

Asegurate de tener **Docker** y **Docker Compose** instalados.

1. Cloná el repositorio:

```bash
git https://github.com/GonzalezClaudio/NSQL-2025.git


2. Creaamos entorno virtual y lo abrimos

python3 -m venv env
source env/bin/activate
pip install redis

cd tp-2y3

3. Ejecutá el entorno con Docker Compose:

docker compose up --build

------------------------------------------------------------------------------------

# Trabajo Practico 3 - TP3-turismo-geo-redis

Este proyecto cosiste en una apllicacion web que permite:
- Agregar lugares turisticos clasificados por grupos.
- Buscar lugares cercanos dentro de 5 km, apartir de un punto fijo seleccionado.
- Calcula la dictancia en km entre el punto fijo seleccionado y el lugar que seleccionemos,.

La app esta dividida en dos partes:

- **Frontend**: React
- **Backend**: Desarrollado con Python + FastAPI,    maneja la logica y almacenamiento.
- **Base de datos**: Redis (clave-valor)



3. Ejecutá el entorno con Docker Compose:

cd tp3-turismo-geo-redis
docker compose up --build

🧪 Ejemplo de uso
Seleccionás un grupo como "farmacias".

Elegís un punto fijo, por ejemplo, "Punto A".

La app lista las farmacias cercanas a ese punto.

Hacés clic en una para calcular la distancia.
