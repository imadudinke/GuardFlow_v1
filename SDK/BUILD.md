# 🚀 Official GuardFlow SDK Release Guide

This guide follows senior development practices for building and publishing Python packages to PyPI.

## 📋 Understanding Dependencies

### Runtime Dependencies (`requirements.txt` / `pyproject.toml`)
These are what **users** need when they install your SDK:
- `httpx`, `redis`, `fastapi` - Required for the SDK to function
- Users get these automatically with `pip install guardflow-security`

### Development Tools (installed separately)
These are what **you** (the developer) need to build and ship:
- `build`, `twine` - For packaging and uploading
- Install once on your machine, not in requirements.txt

## 🔧 Prerequisites

### 1. Install Development Tools (One-time setup)

```bash
# Install build tools (development dependencies)
pip install build twine
```

### 2. PyPI Account Setup

1. Create accounts:
   - [Test PyPI](https://test.pypi.org/account/register/) (for testing)
   - [PyPI](https://pypi.org/account/register/) (for production)

2. Generate API tokens:
   - Account Settings → API tokens
   - Create tokens for both Test PyPI and PyPI

3. Configure credentials:
   ```bash
   # Copy template and edit with your tokens
   cp .pypirc.template ~/.pypirc
   # Edit ~/.pypirc with your API tokens
   ```

## 🚀 Official SDK Release Steps

Follow this **exact sequence** for PyPI publishing:

### 1. Clean Your Environment

Make sure you're in the `SDK/` folder:

```bash
cd SDK/
```

Clean previous builds:
```bash
rm -rf build/ dist/ *.egg-info/
```

### 2. Install Development Tools

```bash
pip install build twine
```

### 3. Create Distribution Files

This creates `dist/` folder with `.tar.gz` (source) and `.whl` (wheel):

```bash
python -m build
```

### 4. Check Package Quality

```bash
python -m twine check dist/*
```

### 5. Upload to Test PyPI (Always test first!)

```bash
python -m twine upload --repository testpypi dist/*
```

### 6. Test Installation

```bash
# Install from Test PyPI
pip install --index-url https://test.pypi.org/simple/ guardflow-security

# Test the import
python -c "from guardflow import GuardFlowMiddleware; print('✅ Success!')"
```

### 7. Upload to Production PyPI

```bash
python -m twine upload dist/*
```

## 🛠️ Using the Makefile (Recommended)

For convenience, use the provided Makefile:

```bash
# Install development tools
make install-dev

# Build package
make build

# Upload to Test PyPI
make upload-test

# Upload to production PyPI
make upload
```

## 🎯 Quick Commands

```bash
# Complete workflow
make install-dev    # Install build tools
make build         # Clean + build package
make upload-test   # Upload to Test PyPI
make upload        # Upload to production

# Development
make clean         # Clean build artifacts
make status        # Show current status
make dev-install   # Install in development mode
```

## 📦 What Gets Built

After `python -m build`, you'll have:

```
dist/
├── guardflow_sdk-0.1.0-py3-none-any.whl  # Wheel (compiled)
└── guardflow_sdk-0.1.0.tar.gz            # Source distribution
```

## 🔄 Version Management

1. Update `pyproject.toml`:
   ```toml
   [project]
   version = "0.1.1"
   ```

2. Update `guardflow/__init__.py`:
   ```python
   __version__ = "0.1.1"
   ```

3. Update `CHANGELOG.md`

4. Build and upload new version

## ✅ Pre-Release Checklist

- [ ] Version bumped in `pyproject.toml` and `__init__.py`
- [ ] `CHANGELOG.md` updated
- [ ] Code formatted (`make format`)
- [ ] Tests pass (`make test`)
- [ ] Package builds cleanly (`make build`)
- [ ] Package check passes (`make check`)
- [ ] Tested on Test PyPI (`make upload-test`)
- [ ] Ready for production (`make upload`)

## 🎉 Success!

Once published, users install with:

```bash
pip install guardflow-security
```

And use in FastAPI:

```python
from guardflow import GuardFlowMiddleware
from fastapi import FastAPI

app = FastAPI()
app.add_middleware(GuardFlowMiddleware, api_key="your-key")
```

## 🚨 Common Mistakes to Avoid

❌ **Don't** add `build` and `twine` to `requirements.txt`
✅ **Do** install them separately as development tools

❌ **Don't** upload directly to PyPI without testing
✅ **Do** always test on Test PyPI first

❌ **Don't** forget to update version numbers
✅ **Do** update both `pyproject.toml` and `__init__.py`