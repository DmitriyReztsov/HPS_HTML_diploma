# FROM nginx:alpine
# COPY . /usr/share/nginx/html
# EXPOSE 8080
# CMD ["nginx", "-g", "daemon off;"]

FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y npm
# RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm install -g http-server

COPY ./src/ /usr/apps/hello-docker/
WORKDIR /usr/apps/hello-docker/

CMD ["http-server", "-s"]