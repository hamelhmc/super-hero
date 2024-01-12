FROM node:latest

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . /app

RUN npm run build

EXPOSE 4200

CMD ["npx", "http-server", "dist/super-hero", "--port=4200"]
