FROM node:14.16.0-alpine

WORKDIR /app

ARG PATH
ENV API_PATH=${PATH}

COPY ./package*.json /app/

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "src/app.js"]