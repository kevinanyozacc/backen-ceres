FROM node:lts-alpine3.14

RUN npm i -g forever npm@8.1.3

WORKDIR /app

COPY --chown=node:node . .

RUN npm install && \
    npm audit fix

USER node

CMD ["forever", "./src/server.js"]