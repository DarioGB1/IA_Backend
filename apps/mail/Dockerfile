FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY apps/mail ./apps/mail
COPY libs ./libs

RUN npm ci
RUN npm run build mail


FROM node:22-alpine AS dependencies
WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production


FROM node:22-alpine AS production
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/dist/apps/mail ./dist/apps/mail
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules

USER nestjs

CMD ["node", "dist/apps/mail/main"]

# Metadata
LABEL org.opencontainers.image.title="Mail Microservice" \
    org.opencontainers.image.description="Microservicio de correo electrónico para IA-LEARN" \
    org.opencontainers.image.vendor="Smart-Academy" \
    org.opencontainers.image.version="1.0.0" \
    org.opencontainers.image.authors="Smart-Academy Team"