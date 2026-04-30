#!/bin/bash

# 🚀 Official GuardFlow SDK Release Script
# Follow the exact sequence for PyPI publishing

set -e  # Exit on any error

echo "🚀 GuardFlow SDK - Official Release Process"
echo "=========================================="

# Check if we're in the SDK directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Must be run from the SDK directory (where pyproject.toml exists)"
    exit 1
fi

# Step 1: Clean Environment
echo ""
echo "🧹 Step 1: Cleaning environment..."
rm -rf build/ dist/ *.egg-info/
echo "✅ Environment cleaned"

# Step 2: Install Development Tools (if not already installed)
echo ""
echo "🔧 Step 2: Installing build tools..."
echo "Installing build and twine (development tools)..."
pip install build twine
echo "✅ Build tools installed"

# Step 3: Create Distribution Files
echo ""
echo "📦 Step 3: Creating distribution files..."
echo "Running: python -m build"
python -m build

# Verify build success
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Build failed - no dist directory or files found"
    exit 1
fi

echo "✅ Distribution files created successfully!"
echo ""
echo "📁 Built files:"
ls -la dist/

# Step 4: Check Package Quality
echo ""
echo "🔍 Step 4: Checking package quality..."
python -m twine check dist/*
echo "✅ Package quality check passed!"

# Final Instructions
echo ""
echo "🎉 SDK is ready for PyPI!"
echo "=========================="
echo ""
echo "📋 Next steps:"
echo "   1. Test PyPI upload:    twine upload --repository testpypi dist/*"
echo "   2. Test installation:   pip install --index-url https://test.pypi.org/simple/ guardflow-sdk"
echo "   3. Production upload:   twine upload dist/*"
echo ""
echo "🔑 Make sure you have PyPI credentials configured:"
echo "   - Create API tokens at https://pypi.org and https://test.pypi.org"
echo "   - Configure ~/.pypirc (see .pypirc.template)"
echo ""
echo "✨ Happy shipping!"