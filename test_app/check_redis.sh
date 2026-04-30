#!/bin/bash

echo "============================================================"
echo "Redis Status Check"
echo "============================================================"

# Check if Docker Redis container is running
echo -e "\n1. Checking Docker Redis container..."
if docker ps | grep -q guardflow_redis; then
    echo "✅ Docker Redis container is running"
    docker ps --filter "name=guardflow_redis" --format "   Name: {{.Names}}\n   Status: {{.Status}}\n   Ports: {{.Ports}}"
else
    echo "❌ Docker Redis container is NOT running"
    echo "   Start it with: docker compose up -d redis"
    exit 1
fi

# Check Redis health
echo -e "\n2. Testing Redis connection..."
if docker exec guardflow_redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is responding to PING"
else
    echo "❌ Redis is not responding"
    exit 1
fi

# Check Redis from host
echo -e "\n3. Testing Redis from host (localhost:6379)..."
if command -v redis-cli &> /dev/null; then
    if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
        echo "✅ Redis is accessible from host"
    else
        echo "❌ Redis is not accessible from host"
    fi
else
    echo "⚠️  redis-cli not installed on host (this is OK)"
    echo "   Testing with Python instead..."
    python3 << 'EOF'
import redis
try:
    r = redis.from_url("redis://localhost:6379")
    r.ping()
    print("✅ Redis is accessible from Python")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
EOF
fi

# Check Redis info
echo -e "\n4. Redis Information..."
docker exec guardflow_redis redis-cli INFO server | grep -E "redis_version|os|uptime_in_seconds"

# Check Redis memory usage
echo -e "\n5. Redis Memory Usage..."
docker exec guardflow_redis redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human"

# Check Redis keys
echo -e "\n6. Redis Keys Count..."
KEY_COUNT=$(docker exec guardflow_redis redis-cli DBSIZE | grep -oE '[0-9]+')
echo "   Total keys: $KEY_COUNT"

if [ "$KEY_COUNT" -gt 0 ]; then
    echo -e "\n   Sample keys:"
    docker exec guardflow_redis redis-cli --scan --count 5 | head -5 | sed 's/^/   - /'
fi

# Check Redis logs
echo -e "\n7. Recent Redis Logs..."
docker logs guardflow_redis --tail 5 2>&1 | sed 's/^/   /'

echo -e "\n============================================================"
echo "Summary"
echo "============================================================"
echo "✅ Docker Redis is running and healthy"
echo "✅ Accessible on: localhost:6379"
echo "✅ Container name: guardflow_redis"
echo ""
echo "To view logs: docker logs guardflow_redis"
echo "To stop Redis: docker stop guardflow_redis"
echo "To restart Redis: docker restart guardflow_redis"
echo "============================================================"
