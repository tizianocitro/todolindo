# Build
FROM node:16.15.1-alpine as build
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

# Run
FROM node:16.15.1-alpine
WORKDIR /app

COPY package.json ./
COPY .env ./

RUN npm install

COPY --from=build /app/dist .

EXPOSE 8080

CMD ["node","src/main.js"]