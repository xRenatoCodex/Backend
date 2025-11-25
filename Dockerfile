FROM node:22.16.0

WORKDIR /app

# Copia el archivo JSON a un lugar seguro dentro del contenedor
COPY service_account_firebase.json /app/config/firebase-key.json

# Establece la variable de entorno (Ruta ABSOLUTA dentro del contenedor)
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/config/firebase-key.json

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/main" ]
