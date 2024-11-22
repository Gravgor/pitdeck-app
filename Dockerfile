FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["npm", "start"]