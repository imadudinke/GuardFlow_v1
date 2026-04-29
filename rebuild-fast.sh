#!/bin/bash

echo "🚀 Fast Rebuild (uses cache when possible)"
echo "=========================================="
echo ""

echo "🔄 Stopping containers..."
docker-compose down

echo "🏗️  Rebuilding containers (with cache)..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 5

echo "📊 Checking container status..."
docker-compose ps

echo ""
echo "✅ Done! Check the logs:"
echo "   Backend:  docker logs guardflow_studio_api"
echo "   Frontend: docker logs guardflow_studio_ui"
echo ""
echo "🌐 Access your app:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
