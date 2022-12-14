FROM node:lts-alpine3.14

ENV LD_LIBRARY_PATH=/lib
ENV PACKAGE=instantclient-basiclite-linux.x64-21.4.0.0.0dbru.zip

RUN wget https://download.oracle.com/otn_software/linux/instantclient/214000/$PACKAGE && \
    unzip $PACKAGE && \
    cp -r instantclient*/* $LD_LIBRARY_PATH && \
    rm -rf instantclient* && \
    apk add libaio libnsl libc6-compat && \
    cd $LD_LIBRARY_PATH && \
    ln -s /lib64/* $LD_LIBRARY_PATH && \
    ln -s $LD_LIBRARY_PATH/libc.so* /usr/lib/libresolv.so.2

RUN npm i -g forever npm@8.1.3

WORKDIR /app

COPY --chown=node:node . .

RUN npm install && \
    npm audit fix

USER node

CMD ["forever", "./src/server.js"]