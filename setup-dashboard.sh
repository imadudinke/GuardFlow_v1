#!/bin/bash

echo "🎨 Setting up GuardFlow Dashboard"
echo "=================================="
echo ""

cd studio/frontend

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "✅ Dashboard setup complete!"
echo ""
echo "📝 What was created:"
echo "  ✓ Tailwind config for Tailwind v4"
echo "  ✓ UI components (Button, Card, Badge)"
echo "  ✓ Dashboard layout with sidebar"
echo "  ✓ Dashboard page with stats and charts"
echo "  ✓ Header with user info and logout"
echo "  ✓ Sidebar navigation"
echo ""
echo "🚀 Next steps:"
echo "  1. Run: ./rebuild.sh"
echo "  2. Visit: http://localhost:3000"
echo "  3. Login or register"
echo "  4. You'll be redirected to /dashboard"
echo ""
echo "📚 Routes:"
echo "  / - Redirects to /dashboard or /login"
echo "  /login - Login page"
echo "  /register - Registration page"
echo "  /dashboard - Main dashboard (protected)"
