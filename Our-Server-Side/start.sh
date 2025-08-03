#!/bin/sh

# Wait for Postgres to be ready (optional but recommended)
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z $PG_HOST $PG_PORT; do
  sleep 1
done


# Run Prisma migration
echo "🚀 Running Prisma migration..."
npx prisma migrate deploy

# Start your app
echo "▶️ Starting backend server..."
node server.js
