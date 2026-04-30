#!/bin/bash

# Render Start Script for GuardFlow Backend
set -e

echo "🚀 Starting GuardFlow Backend..."

# Run database migrations
echo "📊 Running database migrations..."
alembic upgrade head

# Start the application
echo "🌐 Starting Uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8001}
