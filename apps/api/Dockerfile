FROM node:22-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/api ./apps/api

RUN pnpm --filter api install --frozen-lockfile

WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 5000

CMD ["pnpm", "start"]
