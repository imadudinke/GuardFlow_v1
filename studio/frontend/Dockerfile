# syntax=docker/dockerfile:1.7
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

CMD ["sh", "./dev-entrypoint.sh"]
