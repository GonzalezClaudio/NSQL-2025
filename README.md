# 📦 NSQL-2025

Este repositorio contiene los trabajos prácticos desarrollados con tecnologías NoSQL, utilizando bases de datos como Redis y MongoDB junto con frameworks modernos de frontend y backend.

---

## 🧩 TP2 y TP3 - Sistema de Alquiler con Redis + Flask + React

Aplicación web que permite gestionar el alquiler de capítulos de todas las temporadas de *The Mandalorian*.

### 🛠️ Características

- Lista todos los capítulos disponibles para alquiler.
- Permite reservar capítulos.
- Si no se confirma el pago en 4 minutos, el capítulo vuelve al estado de *disponible*.

### ⚙️ Tecnologías utilizadas

- **Frontend**: React  
- **Backend**: Flask (Python)  
- **Base de datos**: Redis (clave-valor)

### 🚀 Ejecución del programa

Asegurate de tener **Docker** y **Docker Compose** instalados.

#### 1. Clonar el repositorio

```bash
git clone https://github.com/GonzalezClaudio/NSQL-2025.git
cd NSQL-2025/tp-2y3
```

#### 2. Crear entorno virtual (opcional, si no usás Docker)

```bash
python3 -m venv env
source env/bin/activate
pip install redis
```

#### 3. Ejecutar con Docker Compose

```bash
docker compose up --build
```

---

## 🗺️ TP3 - Turismo Geo Redis

Aplicación web para:

- Agregar lugares turísticos clasificados por grupos.
- Buscar lugares cercanos dentro de 5 km desde un punto fijo.
- Calcular la distancia en km entre el punto fijo y un lugar seleccionado.

### ⚙️ Tecnologías utilizadas

- **Frontend**: React  
- **Backend**: FastAPI (Python)  
- **Base de datos**: Redis (clave-valor)

### 🚀 Ejecución del programa

Asegurate de tener **Docker** y **Docker Compose** instalados.

#### 1. Clonar el repositorio (si no lo hiciste antes)

```bash
git clone https://github.com/GonzalezClaudio/NSQL-2025.git
```

#### 2. Ir a la carpeta del TP3

```bash
cd NSQL-2025/tp3-turismo-geo-redis
```

#### 3. Ejecutar con Docker Compose

```bash
docker compose up --build
```

### 🧪 Ejemplo de uso

- Seleccionás un grupo como "farmacias".
- Elegís un punto fijo, por ejemplo, "Punto A".
- La app lista las farmacias cercanas a ese punto.
- Hacés clic en una para calcular la distancia.

---

## 🦸‍♂️ TP5 - SuperHeroes MongoDB

Aplicación web que permite:

- Mostrar una lista de superhéroes cargados desde una base de datos.
- Buscar superhéroes por nombre presionando la tecla Enter.
- Visualizar detalles de cada superhéroe en formato de tarjeta (card).

### ⚙️ Tecnologías utilizadas

- **Frontend**: React  
- **Backend**: FastAPI (Python)  
- **Base de datos**: MongoDB (NoSQL)

### 🚀 Ejecución del programa

Asegurate de tener **Docker** y **Docker Compose** instalados.

#### 1. Clonar el repositorio (si no lo hiciste antes)

```bash
git clone https://github.com/GonzalezClaudio/NSQL-2025.git
```

#### 2. Ir a la carpeta del TP5

```bash
cd NSQL-2025/tp5-superheroes-mongodb
```

#### 3. Ejecutar con Docker Compose

```bash
docker compose up --build
```

### 🧪 Ejemplo de uso

- Se carga la aplicación y se listan todos los superhéroes disponibles.
- En el campo de búsqueda, escribís el nombre del superhéroe y presionás Enter.
- Se muestran únicamente los superhéroes cuyo nombre coincide con la búsqueda.
- Si no se encuentra ninguno, se muestra un mensaje indicándolo.