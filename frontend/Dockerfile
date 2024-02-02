FROM node:latest AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:latest

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/build /app

RUN chown -R node:node /app

CMD ["npm","start"]