"""
Enhanced test app with multiple endpoints to test GuardFlow features
"""
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from fastapi import FastAPI, HTTPException, Request
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI(title="GuardFlow Test App")

# Configure GuardFlow Middleware
app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com",
    # Rate limiting: 10 requests per minute
    rate_limit=10,
    rate_window=60,
    # Honeypot traps
    honeypot_paths=["/admin", "/wp-admin", "/.env", "/config"],
    # Enable all features
    enable_fingerprinting=True,
    enable_rate_limiting=True,
    enable_pii_scrubbing=True,
)

@app.get("/")
async def root():
    """Normal endpoint - should work fine"""
    return {
        "status": "Protected by GuardFlow",
        "message": "This endpoint is being monitored"
    }

@app.get("/api/data")
async def get_data():
    """Another normal endpoint"""
    return {
        "data": [1, 2, 3, 4, 5],
        "count": 5
    }

@app.post("/api/submit")
async def submit_data(request: Request):
    """Endpoint that accepts data"""
    body = await request.json()
    return {
        "status": "received",
        "data": body
    }

@app.get("/protected")
async def protected_route():
    """
    Protected route - accessing without auth should trigger threat
    You can customize this based on your auth logic
    """
    return {"message": "This is a protected resource"}

# Honeypot endpoints (these will trigger high-risk threats)
@app.get("/admin")
async def fake_admin():
    """Honeypot: Should never be accessed by legitimate users"""
    raise HTTPException(status_code=404, detail="Not found")

@app.get("/wp-admin")
async def fake_wordpress():
    """Honeypot: WordPress admin (common bot target)"""
    raise HTTPException(status_code=404, detail="Not found")

@app.get("/.env")
async def fake_env():
    """Honeypot: Environment file (common attack vector)"""
    raise HTTPException(status_code=404, detail="Not found")

@app.get("/config")
async def fake_config():
    """Honeypot: Config file"""
    raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("GuardFlow Test App")
    print("=" * 60)
    print("Starting server on http://localhost:8000")
    print("\nTest endpoints:")
    print("  GET  /              - Normal endpoint")
    print("  GET  /api/data      - Normal endpoint")
    print("  POST /api/submit    - Normal endpoint")
    print("  GET  /protected     - Protected endpoint")
    print("\nHoneypot endpoints (will trigger threats):")
    print("  GET  /admin         - Honeypot trap")
    print("  GET  /wp-admin      - Honeypot trap")
    print("  GET  /.env          - Honeypot trap")
    print("  GET  /config        - Honeypot trap")
    print("\nTo trigger rate limiting:")
    print("  for i in {1..20}; do curl http://localhost:8000/; done")
    print("\nCheck threats at: https://guardflow-v1.onrender.com")
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
