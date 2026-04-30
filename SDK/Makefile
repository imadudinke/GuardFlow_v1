# GuardFlow SDK Makefile
# Professional development workflow for SDK publishing

.PHONY: help install-dev install clean build check upload upload-test dev-install

help:  ## Show this help message
	@echo "🚀 GuardFlow SDK - Development Commands"
	@echo "======================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📋 Typical workflow:"
	@echo "  1. make install-dev     # Install development tools"
	@echo "  2. make build          # Build the package"
	@echo "  3. make upload-test    # Upload to Test PyPI"
	@echo "  4. make upload         # Upload to production PyPI"

install-dev:  ## Install development tools (build, twine, etc.)
	pip install build twine
	@echo "✅ Development tools installed!"

install:  ## Install runtime dependencies only
	pip install -r requirements.txt
	@echo "✅ Runtime dependencies installed!"

clean:  ## Clean build artifacts
	rm -rf build/ dist/ *.egg-info/ __pycache__/ .pytest_cache/
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "🧹 Build artifacts cleaned!"

build: clean install-dev  ## Build the package (official method)
	python -m build
	@echo "✅ Package built successfully!"
	@echo "📁 Built files:"
	@ls -la dist/

check: build  ## Check the built package quality
	python -m twine check dist/*
	@echo "✅ Package quality check passed!"

upload-test: check  ## Upload to Test PyPI
	@echo "🚀 Uploading to Test PyPI..."
	python -m twine upload --repository testpypi dist/*
	@echo "✅ Uploaded to Test PyPI!"
	@echo "📦 Test install: pip install --index-url https://test.pypi.org/simple/ guardflow-sdk"

upload: check  ## Upload to PyPI (production)
	@echo "🚀 Uploading to production PyPI..."
	@read -p "Are you sure you want to upload to production PyPI? (y/N): " confirm && [ "$$confirm" = "y" ]
	python -m twine upload dist/*
	@echo "🎉 Successfully uploaded to PyPI!"
	@echo "📦 Install with: pip install guardflow-sdk"

dev-install: build  ## Install package in development mode
	pip install -e .
	@echo "🔧 Installed in development mode!"

# Development workflow commands
format:  ## Format code with black and isort
	black guardflow/
	isort guardflow/
	@echo "✨ Code formatted!"

lint:  ## Run linting checks
	black --check guardflow/
	isort --check-only guardflow/
	@echo "✅ Linting passed!"

test:  ## Run tests
	pytest tests/ -v
	@echo "✅ Tests completed!"

release: clean build check upload-test  ## Complete release workflow (test only)
	@echo "🎉 Release workflow completed!"
	@echo "📋 Next: Test the package, then run 'make upload' for production"

# Quick commands
quick-build:  ## Quick build without cleaning
	python -m build

status:  ## Show current package status
	@echo "📦 GuardFlow SDK Status"
	@echo "====================="
	@if [ -d "dist" ]; then echo "📁 Built files:"; ls -la dist/; else echo "❌ No built files found"; fi
	@echo ""
	@echo "🔧 Development tools:"
	@python -c "import build; print('✅ build installed')" 2>/dev/null || echo "❌ build not installed"
	@python -c "import twine; print('✅ twine installed')" 2>/dev/null || echo "❌ twine not installed"