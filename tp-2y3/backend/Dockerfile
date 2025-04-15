FROM python:3.11-slim

WORKDIR /backend

# Instalación directa de dependencias sin requirements.txt
RUN pip install --no-cache-dir flask flask-cors redis

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
