FROM node:6.9

RUN mkdir /app
COPY package.json /app
COPY src/ /app/src
RUN cd /app && npm i

WORKDIR /app
ENTRYPOINT npm start
