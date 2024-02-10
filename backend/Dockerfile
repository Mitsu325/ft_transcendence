FROM node:20-alpine as dev
RUN apk --update add postgresql-client

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ---

FROM node:20-alpine as production
RUN apk --update add postgresql-client

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
