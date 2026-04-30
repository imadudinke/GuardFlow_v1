#!/bin/bash

# GuardFlow SDK Test Deployment Script
set -e

echo "🚀 GuardFlow SDK Test Deployment"
echo "================================"

# Build and start the test deployment
echo "📦 Building test deployment..."
docker-compose -f docker-compose.test.yml build

echo "🔄 Starting services..."
docker-compose -f docker-compose.test.yml up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Test the deployment
echo "🧪 Running tests..."

# Test 1: Basic connectivity
echo "Test 1: Basic connectivity"
curl -f http://localhost:8080/ || echo "❌ Basic connectivity failed"

# Test 2: Health check
echo "Test 2: Health check"
curl -f http://localhost:8080/health || echo "❌ Health check failed"

# Test 3: Protected endpoint
echo "Test 3: Protected endpoint"
curl -f http://localhost:8080/test-protection || echo "❌ Protected endpoint failed"

# Test 4: Attack simulation
echo "Test 4: Attack simulation"
curl -f http://localhost:8080/simulate-attack || echo "❌ Attack simulation failed"

echo ""
echo "🎉 Test deployment complete!"
echo "📋 Access the test app at: http://localhost:8080"
echo "📋 Health check at: http://localhost:8080/health"
echo ""
echo "🔧 To stop the test deployment:"
echo "   docker-compose -f docker-compose.test.yml down"