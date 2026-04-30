#!/bin/bash

echo "============================================================"
echo "GuardFlow SDK Release Script"
echo "============================================================"

# Check if we're in the SDK directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Must run from SDK directory"
    echo "   cd SDK && ./release.sh"
    exit 1
fi

# Get version from pyproject.toml
VERSION=$(grep "^version" pyproject.toml | cut -d'"' -f2)
echo "📦 Preparing to release version: $VERSION"

# Confirm
read -p "Continue with release? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Release cancelled"
    exit 1
fi

echo ""
echo "Step 1: Cleaning old builds..."
rm -rf dist/ build/ *.egg-info
echo "✅ Cleaned"

echo ""
echo "Step 2: Building package..."
python -m build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Built"

echo ""
echo "Step 3: Checking package..."
twine check dist/*
if [ $? -ne 0 ]; then
    echo "❌ Package check failed"
    exit 1
fi
echo "✅ Package OK"

echo ""
echo "============================================================"
echo "Ready to upload!"
echo "============================================================"
echo ""
echo "Choose upload destination:"
echo "  1) Test PyPI (recommended for testing)"
echo "  2) Production PyPI (live release)"
echo ""
read -p "Enter choice (1 or 2): " -n 1 -r
echo

if [[ $REPLY == "1" ]]; then
    echo ""
    echo "📤 Uploading to Test PyPI..."
    twine upload --repository testpypi dist/*
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Package uploaded to Test PyPI"
        echo ""
        echo "To test installation:"
        echo "  pip install --index-url https://test.pypi.org/simple/ guardflow-fastapi==$VERSION"
        echo ""
        echo "View package:"
        echo "  https://test.pypi.org/project/guardflow-fastapi/$VERSION/"
    fi
    
elif [[ $REPLY == "2" ]]; then
    echo ""
    echo "⚠️  WARNING: This will publish to PRODUCTION PyPI!"
    read -p "Are you absolutely sure? (yes/no): " CONFIRM
    
    if [[ $CONFIRM == "yes" ]]; then
        echo ""
        echo "📤 Uploading to Production PyPI..."
        twine upload dist/*
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ SUCCESS! Package published to PyPI"
            echo ""
            echo "To install:"
            echo "  pip install guardflow-fastapi==$VERSION"
            echo ""
            echo "View package:"
            echo "  https://pypi.org/project/guardflow-fastapi/$VERSION/"
            echo ""
            echo "Don't forget to:"
            echo "  1. Create a git tag: git tag v$VERSION"
            echo "  2. Push tag: git push origin v$VERSION"
            echo "  3. Create GitHub release with CHANGELOG"
        fi
    else
        echo "❌ Production upload cancelled"
    fi
else
    echo "❌ Invalid choice"
    exit 1
fi

echo ""
echo "============================================================"
echo "Release process complete!"
echo "============================================================"
