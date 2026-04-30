"""
Test script to verify GuardFlow SDK is working correctly
"""
import sys
import os
import asyncio
import httpx

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

# Test 1: Check if SDK can be imported
print("=" * 60)
print("TEST 1: Importing GuardFlow SDK")
print("=" * 60)
try:
    from guardflow.middleware import GuardFlowMiddleware
    from guardflow.reporter import TelemetryReporter
    print("✅ SDK imported successfully")
except Exception as e:
    print(f"❌ Failed to import SDK: {e}")
    sys.exit(1)

# Test 2: Check Redis connection
print("\n" + "=" * 60)
print("TEST 2: Testing Redis Connection")
print("=" * 60)
try:
    import redis
    r = redis.from_url("redis://localhost:6379")
    r.ping()
    print("✅ Redis is running and accessible")
except Exception as e:
    print(f"❌ Redis connection failed: {e}")
    print("   Make sure Redis is running:")
    print("   - docker-compose up -d redis")
    print("   - OR: sudo systemctl start redis")

# Test 3: Check Studio API connection
print("\n" + "=" * 60)
print("TEST 3: Testing Studio API Connection")
print("=" * 60)
studio_url = "https://guardflow-v1.onrender.com"
api_key = "gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"

async def test_studio_connection():
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test health endpoint
            response = await client.get(f"{studio_url}/health")
            if response.status_code == 200:
                print(f"✅ Studio API is reachable: {studio_url}")
                print(f"   Response: {response.json()}")
            else:
                print(f"⚠️  Studio API returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to connect to Studio API: {e}")
        print(f"   URL: {studio_url}")
        print("   Make sure your backend is deployed and running on Render")

asyncio.run(test_studio_connection())

# Test 4: Test threat reporting
print("\n" + "=" * 60)
print("TEST 4: Testing Threat Reporting")
print("=" * 60)

async def test_threat_reporting():
    try:
        reporter = TelemetryReporter(
            api_key=api_key,
            studio_url=studio_url
        )
        
        # Create a test threat payload
        test_payload = {
            "ip_address": "192.168.1.100",
            "fingerprint": "test_fingerprint_12345",
            "path": "/test",
            "method": "GET",
            "risk_score": 75,
            "risk_factors": ["test_threat"],
            "metadata": {"test": True}
        }
        
        print(f"Sending test threat to: {studio_url}/api/v1/telemetry")
        await reporter.send_report(test_payload)
        print("✅ Test threat sent successfully")
        print("   Check your Studio dashboard for the threat log")
        
    except Exception as e:
        print(f"❌ Failed to report threat: {e}")
        print("\nPossible issues:")
        print("1. Invalid API key - Make sure this API key exists in Studio")
        print("2. Studio API is not accessible")
        print("3. Project not found for this API key")
        print("\nTo fix:")
        print("- Log into Studio: https://guardflow-v1.onrender.com")
        print("- Go to Projects page")
        print("- Create a project or copy the API key from existing project")
        print("- Update the api_key in test_app/main.py")

asyncio.run(test_threat_reporting())

# Test 5: Instructions
print("\n" + "=" * 60)
print("TEST 5: Testing FastAPI App with GuardFlow")
print("=" * 60)
print("\nTo test your FastAPI app:")
print("1. Start your app:")
print("   source .venv/bin/activate")
print("   uvicorn test_app.main:app --reload")
print("\n2. Make test requests:")
print("   curl http://localhost:8000/")
print("\n3. Trigger rate limiting (make many rapid requests):")
print("   for i in {1..20}; do curl http://localhost:8000/; done")
print("\n4. Check Studio dashboard:")
print("   https://guardflow-v1.onrender.com")
print("   - Log in to your account")
print("   - Select your project")
print("   - Go to 'Threats' page")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
print("If all tests pass, your GuardFlow SDK is configured correctly.")
print("\nNext steps:")
print("1. Start Redis: docker-compose up -d redis")
print("2. Start your FastAPI app: uvicorn test_app.main:app --reload")
print("3. Make requests to trigger threat detection")
print("4. Check Studio dashboard: https://guardflow-v1.onrender.com")


