#!/bin/sh
set -e

cd /app/backend

echo "🚀 Starting SABO Backend API..."

# Apply versioned database migrations if DATABASE_URL is configured.
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Applying Prisma migrations..."
  npx prisma migrate deploy

  if [ "$RUN_SEED" = "true" ] || [ -n "$ADMIN_BOOTSTRAP_EMAIL" ]; then
    echo "🌱 Running database seed..."
    npx ts-node prisma/seed.ts || echo "⚠️ Seed skipped or already applied."
  fi
fi

echo "🟢 Starting NestJS server on port ${PORT:-4000}..."
exec node dist/main
