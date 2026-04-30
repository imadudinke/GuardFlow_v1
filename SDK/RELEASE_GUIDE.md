# How to Release GuardFlow SDK v0.1.2

## What Changed in v0.1.2

✅ **Fixed error log spam** - No more console flooding
✅ **Increased timeouts** - Better for cloud deployments  
✅ **Better error handling** - Graceful failure handling

## Quick Release (Automated)

```bash
cd SDK
./release.sh
```

The script will:
1. Clean old builds
2. Build the package
3. Check the package
4. Ask if you want Test PyPI or Production PyPI
5. Upload the package

## Manual Release (Step by Step)

### 1. Clean and Build

```bash
cd SDK

# Clean old builds
rm -rf dist/ build/ *.egg-info

# Build package
python -m build
```

### 2. Check Package

```bash
twine check dist/*
```

Should show: `Checking dist/guardflow_fastapi-0.1.2... PASSED`

### 3. Upload to Test PyPI (Recommended First)

```bash
twine upload --repository testpypi dist/*
```

Enter your Test PyPI credentials when prompted.

**Test the package:**
```bash
pip install --index-url https://test.pypi.org/simple/ guardflow-fastapi==0.1.2
```

### 4. Upload to Production PyPI

Once tested, upload to production:

```bash
twine upload dist/*
```

Enter your PyPI credentials when prompted.

## After Release

### 1. Tag the Release

```bash
git add .
git commit -m "Release v0.1.2: Fix error logging and increase timeouts"
git tag v0.1.2
git push origin main
git push origin v0.1.2
```

### 2. Create GitHub Release

1. Go to: https://github.com/yourusername/guardflow/releases/new
2. Choose tag: `v0.1.2`
3. Title: `v0.1.2 - Improved Error Handling`
4. Description: Copy from CHANGELOG.md
5. Publish release

### 3. Update Documentation

Update the docs site with:
- New version number
- Installation instructions
- Changelog

## Verify Release

### Check PyPI

Visit: https://pypi.org/project/guardflow-fastapi/

Should show version 0.1.2

### Test Installation

```bash
# Create fresh virtual environment
python -m venv test-env
source test-env/bin/activate

# Install from PyPI
pip install guardflow-fastapi==0.1.2

# Verify
python -c "import guardflow; print('✅ SDK imported successfully')"
```

### Test in Real App

```bash
# Update your test app
pip install --upgrade guardflow-fastapi

# Run your app
uvicorn test_app.main:app --reload

# Make requests - should see clean logs (no error spam)
curl http://localhost:8000/
```

## Troubleshooting

### "Invalid credentials"

Make sure you have:
- PyPI account: https://pypi.org/account/register/
- Test PyPI account: https://test.pypi.org/account/register/
- API tokens configured in `~/.pypirc`

### "Package already exists"

You can't re-upload the same version. Increment version in `pyproject.toml`:
```toml
version = "0.1.3"
```

### "Build failed"

Install build tools:
```bash
pip install --upgrade build twine
```

## Users Will Get the Fix

Once published, users can upgrade:

```bash
pip install --upgrade guardflow-fastapi
```

They'll get:
- ✅ No more error spam
- ✅ Better timeout handling
- ✅ Improved reliability

## Summary

**Current version:** 0.1.1 (has error spam)  
**New version:** 0.1.2 (fixes applied)  
**Release method:** Run `./release.sh` or follow manual steps  
**After release:** Tag in git, create GitHub release, update docs
