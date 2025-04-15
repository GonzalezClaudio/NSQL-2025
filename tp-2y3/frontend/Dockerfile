# Imagen base oficial de Node
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /frontend

# Copia solo los archivos de dependencias primero (para aprovechar el cache)
COPY package*.json ./

# Instala dependencias sin mostrar demasiada salida
RUN npm install --silent

# Copia el resto del código de la app al contenedor
COPY . .

# Expone el puerto que usa create-react-app
EXPOSE 3000

# Comando por defecto para iniciar la app
CMD ["npm", "start"]
