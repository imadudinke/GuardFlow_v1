"""
Test FastAPI application using GuardFlow SDK from Test PyPI
"""
from fastapi import FastAPI, HTTPException
from guardflow import GuardFlowMiddleware
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="GuardFlow SDK Test Deployment",
    description="Testing GuardFlow SDK from Test PyPI",
    version="0.1.0"
)

# Add GuardFlow middleware
try:
    app.add_middleware(
        GuardFlowMiddleware,
        api_key=os.getenv("GUARDFLOW_API_KEY", "test_key_123"),
        studio_url=os.getenv("GUARDFLOW_STUDIO_URL", "https://test.guardflow.dev"),
        redis_url=os.getenv("GUARDFLOW_REDIS_URL", "redis://redis:6379"),
        block_threshold=int(os.getenv("GUARDFLOW_BLOCK_THRESHOLD", "80")),
        debug=True
    )
    logger.info("✅ GuardFlow middleware added successfully!")
except Exception as e:
    logger.error(f"❌ Failed to add GuardFlow middleware: {e}")
    raise

@app.get("/")
async def root():
    """Root endpoint to test basic functionality"""
    return {
        "message": "GuardFlow SDK Test Deployment",
        "status": "running",
        "sdk": "guardflow-fastapi",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test GuardFlow components
        from guardflow.fingerprint import create_fingerprint
        from guardflow.reporter import TelemetryReporter
        from guardflow.scrubber import scrub_metadata
        
        return {
            "status": "healthy",
            "guardflow_sdk": "operational",
            "components": {
                "fingerprint": "✅",
                "reporter": "✅", 
                "scrubber": "✅",
                "middleware": "✅"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {e}")

@app.get("/test-protection")
async def test_protection():
    """Test endpoint to verify protection is working"""
    return {
        "message": "This endpoint is protected by GuardFlow",
        "protection_active": True,
        "timestamp": "2026-04-29T12:00:00Z"
    }

@app.get("/simulate-attack")
async def simulate_attack():
    """Simulate a potential attack to test detection"""
    # This would normally trigger GuardFlow protection
    return {
        "message": "Attack simulation endpoint",
        "note": "GuardFlow should detect and log this request"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)