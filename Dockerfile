FROM node:20-bookworm

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends git \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run web:build

ENV DYAD_WEB_MODE=true
ENV DYAD_WEB_HOST=0.0.0.0
ENV DYAD_WEB_PORT=4000
ENV DYAD_DATA_PATH=/data/dyad

EXPOSE 4000

CMD ["npm", "run", "web:server"]
