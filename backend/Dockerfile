FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest

RUN npm install

COPY . .

RUN npm run build

FROM node:lts

ENV NODE_ENV=production

WORKDIR /app

RUN chown -R node:node /app

CMD ["npm", "run", "start:prod"]