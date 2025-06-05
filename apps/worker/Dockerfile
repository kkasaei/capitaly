FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Adding CA certificates and updating Alpine repos, then install libc6-compat
RUN apk update --no-cache && \
    apk add --no-cache ca-certificates && \
    update-ca-certificates && \
    apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml ./
COPY apps/worker/package.json ./apps/worker/package.json
COPY packages/config-typescript/package.json ./packages/config-typescript/package.json
COPY packages/database/package.json ./packages/database/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the worker app
RUN npm install -g turbo
RUN turbo build --filter=worker...

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/apps/worker/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set the correct permission for prerender cache
RUN mkdir -p dist
RUN chown -R nestjs:nodejs /app

USER nestjs

# Listen on all network interfaces
ENV HOST=0.0.0.0
ENV PORT=3000

# Redis connection configuration
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
