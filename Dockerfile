FROM node:12
WORKDIR /usr/src/survey
COPY ./package.json ./
RUN npm install --only=prod
COPY ./dist ./dist
EXPOSE 5000
RUN npm start