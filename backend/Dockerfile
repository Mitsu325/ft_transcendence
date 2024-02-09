FROM node:latest

WORKDIR /src

COPY package*.json ./

RUN npm install -g npm@latest

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN chown -R node:node /src

CMD ["npm", "run", "start:prod"]