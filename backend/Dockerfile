# ============================================================
# NOTE: build context must be the REPO ROOT (this is an npm
# workspace), not the backend/ directory, e.g.:
#   docker build -f backend/Dockerfile .
# ============================================================

# ============================================================
# STAGE 1: Build stage
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace manifest + backend's own manifest (npm
# workspaces need both present to resolve the "backend" workspace)
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/
COPY backend/docker-entrypoint.sh ./backend/

# Install all dependencies (including dev) for the backend workspace
RUN npm ci --workspace=backend --include-workspace-root

# Copy backend source code
COPY backend/tsconfig*.json backend/nest-cli.json ./backend/
COPY backend/src ./backend/src

# Generate Prisma client and compile TypeScript
RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build --workspace=backend

# ============================================================
# STAGE 2: Production runner
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install openssl and curl for Prisma & healthcheck
RUN apk add --no-cache openssl curl

# Copy production artifacts (hoisted node_modules + built backend workspace)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend

RUN chmod +x ./backend/docker-entrypoint.sh

WORKDIR /app/backend

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT:-4000}/api/v1/health || exit 1

CMD ["./docker-entrypoint.sh"]
