FROM node:12
WORKDIR /usr/src/survey
COPY ./package.json ./
RUN npm install --only=prod