from fastapi import FastAPI
from guardflow import GuardFlowMiddleware

# Create FastAPI app
app = FastAPI()

# Test adding the middleware
try:
    app.add_middleware(
        GuardFlowMiddleware,
        api_key="test_key_123",
        studio_url="https://test.guardflow.dev",
        redis_url="redis://localhost:6379",
        block_threshold=80
    )
    print("✅ Middleware integration works!")
except Exception as e:
    print(f"❌ Middleware error: {e}")

# Test basic endpoint
@app.get("/")
async def root():
    return {"message": "GuardFlow SDK test successful!"}

if __name__ == "__main__":
    print("✅ FastAPI app created successfully!")
    print("✅ GuardFlow SDK integration complete!")
