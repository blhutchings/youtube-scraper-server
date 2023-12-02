FROM node:alpine as base

WORKDIR /server

COPY src tsconfig.json package.json package-lock.json ./

RUN npm install

EXPOSE 3000
CMD ["node", "./build/server.js"] 