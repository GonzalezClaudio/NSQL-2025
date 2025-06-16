# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

COPY app /app/app
COPY data_trasport.json /app/data_trasport.json  

COPY app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


