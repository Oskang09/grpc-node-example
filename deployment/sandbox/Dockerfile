FROM node:12

WORKDIR /usr/src/user-service

COPY package*.json ./

RUN npm install -g ts-node
RUN npm install

COPY . .

ENTRYPOINT npm start