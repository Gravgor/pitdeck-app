FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN apk add --no-cache perl make gcc musl-dev linux-headers && \
    wget -O - https://www.openssl.org/source/openssl-1.1.1u.tar.gz | tar zxf - && \
    cd openssl-1.1.1u && \
    ./config --prefix=/usr/local && \
    make && \
    make install && \
    cd .. && \
    rm -rf openssl-1.1.1u

RUN npx prisma generate

ARG DATABASE_URL
ARG REDIS_URL
RUN echo $DATABASE_URL
RUN echo $REDIS_URL

RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]