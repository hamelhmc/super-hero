# Usa una imagen base de Node.js
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json e package-lock.json a la imagen
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm ci

COPY api/ .

# Expone el puerto 3000 para acceder a JSON Server
EXPOSE 3000

# Comando para iniciar JSON Server
CMD ["node", "server.js"]
