FROM node:14.16.0-alpine as client

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

ARG API_URL
# ENV BASE_API_URL=$API_URL
ENV BASE_API_URL="localhost:8000"


COPY ./package*.json /app/

RUN npm install --silent

COPY . .

RUN yarn build

FROM nginx:1.21.3-alpine

EXPOSE 80

COPY --from=client /app/build/ /var/www/html

COPY ./nginx/default.conf /etc/nginx/conf.d

CMD [ "nginx", "-g", "daemon off;" ]