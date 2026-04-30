"""
Debug script to test API key and endpoints
"""
import asyncio
import httpx
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

STUDIO_URL = "https://guardflow-v1.onrender.com"
API_KEY = "gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"

async def test_endpoints():
    print("=" * 60)
    print("GuardFlow API Key Debug")
    print("=" * 60)
    print(f"Studio URL: {STUDIO_URL}")
    print(f"API Key: {API_KEY[:20]}...")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        
        # Test 1: Health endpoint (no auth required)
        print("\n" + "=" * 60)
        print("TEST 1: Health Endpoint (no auth)")
        print("=" * 60)
        try:
            response = await client.get(f"{STUDIO_URL}/health")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 2: Blacklist check endpoint
        print("\n" + "=" * 60)
        print("TEST 2: Blacklist Check Endpoint")
        print("=" * 60)
        try:
            response = await client.post(
                f"{STUDIO_URL}/api/v1/telemetry/blacklist-check",
                json={"dna": "test_fingerprint_123"},
                headers={
                    "X-GuardFlow-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 401:
                print("\n❌ PROBLEM FOUND: API Key is invalid or doesn't exist!")
                print("\nSOLUTION:")
                print("1. Log into Studio: https://guardflow-v1.onrender.com")
                print("2. Go to Projects page")
                print("3. Create a new project OR copy API key from existing project")
                print("4. Update API_KEY in test_app/main.py")
            elif response.status_code == 200:
                print("✅ API Key is valid!")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 3: Telemetry endpoint
        print("\n" + "=" * 60)
        print("TEST 3: Telemetry Endpoint")
        print("=" * 60)
        try:
            response = await client.post(
                f"{STUDIO_URL}/api/v1/telemetry",
                json={
                    "ip": "192.168.1.100",
                    "dna": "test_fingerprint_123",
                    "path": "/test",
                    "status": "allowed",
                    "factors": ["test"],
                    "metadata": {}
                },
                headers={
                    "X-GuardFlow-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 401:
                print("\n❌ PROBLEM FOUND: API Key is invalid!")
            elif response.status_code == 422:
                print("\n⚠️  Validation Error - Check payload format")
            elif response.status_code == 201:
                print("✅ Telemetry accepted! Threat should appear in Studio")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 4: Runtime config endpoint
        print("\n" + "=" * 60)
        print("TEST 4: Runtime Config Endpoint")
        print("=" * 60)
        try:
            response = await client.get(
                f"{STUDIO_URL}/api/v1/telemetry/runtime-config",
                headers={
                    "X-GuardFlow-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ Runtime config retrieved successfully")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print("\nIf you see 401 errors, your API key doesn't exist in Studio.")
    print("\nTo fix:")
    print("1. Log into Studio: https://guardflow-v1.onrender.com")
    print("2. Create a project and get the API key")
    print("3. Update test_app/main.py with the correct API key")
    print("4. Restart your FastAPI app")

if __name__ == "__main__":
    asyncio.run(test_endpoints())
