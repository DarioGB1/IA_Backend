FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY apps/identity-access ./apps/identity-access
COPY libs ./libs

RUN npm ci
RUN npm run build identity-access


FROM node:22-alpine AS dependencies
WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production


FROM node:22-alpine AS production
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/identity-access ./dist/apps/identity-access
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

CMD ["node", "dist/apps/identity-access/main"]

# Metadata
LABEL org.opencontainers.image.title="Identity-Access Microservice" \
      org.opencontainers.image.description="Microservicio de gestión de identidades para IA-LEARN" \
      org.opencontainers.image.vendor="Smart-Academy" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Smart-Academy Team"