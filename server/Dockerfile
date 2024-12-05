FROM node:16-alphine

WORKDIR /server

COPY package.json /server
COPY  package-lock.json /server

RUN npm install

COPY . /server

EXPOSE 7200

CMD ["node","index.js"]