# syntax=docker/dockerfile:1

FROM node:18.12.0

RUN npm install -g tsc && npm install -g concurrently && npm install -g typescript

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]