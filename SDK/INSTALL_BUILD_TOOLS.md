# Install Build Tools

Before releasing the SDK, you need to install the build tools.

## Quick Install

```bash
pip install --upgrade build twine
```

## What These Tools Do

- **build**: Creates the package distribution files (.whl and .tar.gz)
- **twine**: Uploads packages to PyPI securely

## Verify Installation

```bash
# Check build
python -m build --version

# Check twine
python -m twine --version
```

Both should show version numbers.

## Using Virtual Environment (Recommended)

If you want to use a virtual environment for building:

```bash
# Create virtual environment
python -m venv build-env

# Activate it
source build-env/bin/activate  # Linux/Mac
# OR
build-env\Scripts\activate  # Windows

# Install tools
pip install --upgrade build twine

# Now you can run release.sh
cd SDK
./release.sh

# When done, deactivate
deactivate
```

## Troubleshooting

### "No module named build"

Install build:
```bash
pip install build
```

### "No module named twine"

Install twine:
```bash
pip install twine
```

### "Permission denied"

Use pip with --user flag:
```bash
pip install --user build twine
```

### "pip not found"

Install pip:
```bash
# Ubuntu/Debian
sudo apt install python3-pip

# macOS
python -m ensurepip --upgrade

# Or download get-pip.py
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

## Now You're Ready!

Run the release script:

```bash
cd SDK
./release.sh
```

The script will now automatically install missing dependencies!
