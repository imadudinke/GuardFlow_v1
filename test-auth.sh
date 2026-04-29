#!/bin/bash

echo "🧪 Testing GuardFlow Authentication System"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "1️⃣  Testing health endpoint..."
HEALTH=$(curl -s http://localhost:8001/health)
if [[ $HEALTH == *"healthy"* ]]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Register
echo "2️⃣  Testing user registration..."
REGISTER=$(curl -s -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"password123\"}" \
  -c /tmp/cookies.txt)

if [[ $REGISTER == *"user"* ]]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    echo "Response: $REGISTER" | jq '.' 2>/dev/null || echo "$REGISTER"
else
    echo -e "${YELLOW}⚠ Registration response: $REGISTER${NC}"
fi
echo ""

# Test 3: Get Current User
echo "3️⃣  Testing get current user (with cookie)..."
ME=$(curl -s http://localhost:8001/api/v1/auth/me -b /tmp/cookies.txt)
if [[ $ME == *"email"* ]]; then
    echo -e "${GREEN}✓ Authentication working${NC}"
    echo "User: $ME" | jq '.' 2>/dev/null || echo "$ME"
else
    echo -e "${RED}✗ Authentication failed${NC}"
    echo "Response: $ME"
fi
echo ""

# Test 4: Logout
echo "4️⃣  Testing logout..."
LOGOUT=$(curl -s -X POST http://localhost:8001/api/v1/auth/logout -b /tmp/cookies.txt)
if [[ $LOGOUT == *"Logout successful"* ]]; then
    echo -e "${GREEN}✓ Logout successful${NC}"
else
    echo -e "${YELLOW}⚠ Logout response: $LOGOUT${NC}"
fi
echo ""

# Test 5: Verify logout (should fail)
echo "5️⃣  Testing authentication after logout (should fail)..."
ME_AFTER=$(curl -s http://localhost:8001/api/v1/auth/me -b /tmp/cookies.txt)
if [[ $ME_AFTER == *"Not authenticated"* ]]; then
    echo -e "${GREEN}✓ Logout verified - user is no longer authenticated${NC}"
else
    echo -e "${YELLOW}⚠ Unexpected response: $ME_AFTER${NC}"
fi
echo ""

# Cleanup
rm -f /tmp/cookies.txt

echo "=========================================="
echo -e "${GREEN}🎉 Authentication tests complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Try registering a new user"
echo "  3. Login with your credentials"
echo "  4. Test the logout functionality"
