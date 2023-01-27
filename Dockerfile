# syntax=docker/dockerfile:1

FROM node:18.12.0

EXPOSE 3002

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]