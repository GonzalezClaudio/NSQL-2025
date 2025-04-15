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






