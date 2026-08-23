#!/bin/sh
set -e

cd /app

echo "🚀 Starting SABO Backend API..."

# Synchronize Database Schema if DATABASE_URL is configured
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Syncing Prisma schema with PostgreSQL..."
  npx prisma db push --accept-data-loss || echo "⚠️ Prisma schema push skipped or deferred."

  if [ "$RUN_SEED" = "true" ] || [ -n "$ADMIN_BOOTSTRAP_EMAIL" ]; then
    echo "🌱 Running database seed..."
    npx ts-node prisma/seed.ts || echo "⚠️ Seed skipped or already applied."
  fi
fi

echo "🟢 Starting NestJS server on port ${PORT:-4000}..."
exec node dist/main
