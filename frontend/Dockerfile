FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

# RUN chown -R node:node /app

CMD ["npm","start"]