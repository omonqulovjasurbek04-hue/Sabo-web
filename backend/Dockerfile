# ============================================================
# STAGE 1: Build stage
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY tsconfig*.json nest-cli.json ./
COPY src ./src

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# ============================================================
# STAGE 2: Production runner
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install openssl and curl for Prisma & healthcheck
RUN apk add --no-cache openssl curl

# Copy production artifacts
COPY package*.json ./
COPY prisma ./prisma/
COPY docker-entrypoint.sh ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Ensure entrypoint script is executable
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT:-4000}/api/v1/health || exit 1

CMD ["/app/docker-entrypoint.sh"]
