#!/bin/bash

# Render Build Script for GuardFlow Backend
set -e

echo "🚀 Starting GuardFlow Backend build..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete!"
