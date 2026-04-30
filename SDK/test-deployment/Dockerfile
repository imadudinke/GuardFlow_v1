# Test Deployment for GuardFlow SDK
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy test application
COPY test_app.py .
COPY requirements.txt .

# Install dependencies from both Test PyPI and PyPI
RUN pip install --index-url https://test.pypi.org/simple/ \
    --extra-index-url https://pypi.org/simple/ \
    -r requirements.txt

# Expose port
EXPOSE 8000

# Run the test application
CMD ["uvicorn", "test_app:app", "--host", "0.0.0.0", "--port", "8000"]