# Pre-Release Checklist for v0.1.2

## ✅ URLs Updated

All documentation now points to production URLs:

- **Studio Dashboard**: https://guard-flow-v1.vercel.app
- **API Backend**: https://guardflow-v1.onrender.com
- **Documentation**: https://guard-flow-v1.vercel.app/docs
- **GitHub Repo**: https://github.com/imadudinke/GuardFlow_v1

## ✅ Files Updated

- [x] `SDK/pyproject.toml` - Project URLs
- [x] `SDK/README.md` - All documentation links
- [x] `SDK/CHANGELOG.md` - Version 0.1.2 entry
- [x] Test files already use correct URLs

## ✅ Version Information

- **Current Version**: 0.1.1
- **New Version**: 0.1.2
- **Release Date**: 2026-04-30

## ✅ Changes in v0.1.2

### Fixed
- Reduced error log spam (ERROR → DEBUG level)
- Increased API timeouts for cloud deployments
- Better error handling for transient failures

### Changed
- Telemetry timeout: 2s → 5s
- Blacklist check timeout: 1s → 3s
- Runtime config timeout: 1s → 3s

## 📋 Pre-Release Steps

### 1. Verify Local Build

```bash
cd SDK

# Clean old builds
rm -rf dist/ build/ *.egg-info

# Build package
python -m build

# Check package
twine check dist/*
```

Expected output: `PASSED`

### 2. Test Installation Locally

```bash
# Create test environment
python -m venv test-env
source test-env/bin/activate

# Install from local build
pip install dist/guardflow_fastapi-0.1.2-py3-none-any.whl

# Test import
python -c "from guardflow import GuardFlowMiddleware; print('✅ Import successful')"

# Deactivate
deactivate
rm -rf test-env
```

### 3. Upload to Test PyPI

```bash
twine upload --repository testpypi dist/*
```

### 4. Test from Test PyPI

```bash
# Create test environment
python -m venv test-pypi-env
source test-pypi-env/bin/activate

# Install from Test PyPI
pip install --index-url https://test.pypi.org/simple/ guardflow-fastapi==0.1.2

# Test
python -c "from guardflow import GuardFlowMiddleware; print('✅ Test PyPI install successful')"

# Deactivate
deactivate
rm -rf test-pypi-env
```

### 5. Upload to Production PyPI

```bash
twine upload dist/*
```

### 6. Verify on PyPI

Visit: https://pypi.org/project/guardflow-fastapi/0.1.2/

Check:
- [x] Version shows 0.1.2
- [x] README displays correctly
- [x] Links work (Studio, Docs, GitHub)
- [x] Installation command is correct

### 7. Test Production Installation

```bash
# Create fresh environment
python -m venv prod-test-env
source prod-test-env/bin/activate

# Install from PyPI
pip install guardflow-fastapi==0.1.2

# Test
python -c "from guardflow import GuardFlowMiddleware; print('✅ Production install successful')"

# Deactivate
deactivate
rm -rf prod-test-env
```

## 📋 Post-Release Steps

### 1. Commit and Push to GitHub

```bash
git add .
git commit -m "Release v0.1.2: Fix error logging and increase timeouts"
git push origin main
```

### 2. Create Git Tag

```bash
git tag v0.1.2
git push origin v0.1.2
```

### 3. Create GitHub Release

1. Go to: https://github.com/imadudinke/GuardFlow_v1/releases/new
2. Choose tag: `v0.1.2`
3. Title: `v0.1.2 - Improved Error Handling & Cloud Compatibility`
4. Description:

```markdown
## What's New in v0.1.2

### Fixed
- 🔇 **Reduced error log spam** - Changed non-critical errors from ERROR to DEBUG level
- ⏱️ **Increased API timeouts** - Better compatibility with cloud deployments (Render, AWS, etc.)
- 🛡️ **Better error handling** - Graceful handling of timeout and connection errors

### Changed
- Telemetry timeout: 2s → 5s
- Blacklist check timeout: 1s → 3s
- Runtime config timeout: 1s → 3s

### Installation

```bash
pip install --upgrade guardflow-fastapi
```

### Links
- 📖 [Documentation](https://guard-flow-v1.vercel.app/docs)
- 🎛️ [Studio Dashboard](https://guard-flow-v1.vercel.app)
- 📦 [PyPI Package](https://pypi.org/project/guardflow-fastapi/0.1.2/)

### Full Changelog
See [CHANGELOG.md](https://github.com/imadudinke/GuardFlow_v1/blob/main/SDK/CHANGELOG.md)
```

5. Publish release

### 4. Update Documentation Site

Update the docs at https://guard-flow-v1.vercel.app/docs with:
- New version number
- Installation instructions
- Changelog

### 5. Announce Release

Optional:
- Tweet about the release
- Post in Discord/Slack
- Update README badges

## 🧪 Verification Checklist

After release, verify:

- [ ] PyPI shows version 0.1.2
- [ ] `pip install guardflow-fastapi` installs 0.1.2
- [ ] README displays correctly on PyPI
- [ ] All links work
- [ ] GitHub release is published
- [ ] Git tag exists
- [ ] Documentation is updated

## 🎉 Release Complete!

Users can now upgrade with:

```bash
pip install --upgrade guardflow-fastapi
```

And get all the improvements automatically!

---

**Next Version**: 0.1.3 (TBD)
