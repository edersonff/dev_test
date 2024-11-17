FROM node:16-alpine

WORKDIR /usr/src/dev_test

COPY --chown=node:node package*.json .

RUN npm install

COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/index.js" ]