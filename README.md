# 📦 NSQL-2025

## TP2 y TP3 - Sistema de Alquiler con Redis + Flask + React

Este proyecto es parte de los **trabajos prácticos 2 y 3**. Se trata de una aplicación web que permite **gestionar el alquiler de los capítulos de todas las temporadas de *The Mandalorian***.

🛠️ **Características**:

- Lista todos los capítulos disponibles para alquiler.
- Permite reservar capítulos.
- Si no se confirma el pago en 4 minutos, el capítulo vuelve al estado de *disponible*.

---

### ⚙️ Tecnologías utilizadas

- **Frontend**: React  
- **Backend**: Flask (Python)  
- **Base de datos**: Redis (clave-valor)

---

### 🚀 Ejecución del programa

Asegurate de tener **Docker** y **Docker Compose** instalados.

#### 1. Clonar el repositorio

```bash
git clone https://github.com/GonzalezClaudio/NSQL-2025.git
cd NSQL-2025/tp-2y3
```

#### 2. Crear entorno virtual (opcional si no usás Docker)

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

Este proyecto consiste en una aplicación web que permite:

- Agregar **lugares turísticos** clasificados por grupos.
- Buscar lugares cercanos dentro de **5 km** a partir de un **punto fijo** seleccionado.
- Calcular la **distancia en km** entre el punto fijo y un lugar seleccionado.

---

### ⚙️ Tecnologías utilizadas

- **Frontend**: React  
- **Backend**: FastAPI (Python)  
- **Base de datos**: Redis (clave-valor)

---

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

---

### 🧪 Ejemplo de uso

1. Seleccionás un grupo como **"farmacias"**.  
2. Elegís un punto fijo, por ejemplo, **"Punto A"**.  
3. La app lista las farmacias cercanas a ese punto.  
4. Hacés clic en una para calcular la distancia.

---
