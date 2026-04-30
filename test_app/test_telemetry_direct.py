"""
Test telemetry sending directly to see what's failing
"""
import asyncio
import httpx
import time

STUDIO_URL = "https://guardflow-v1.onrender.com"
API_KEY = "gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"

async def test_telemetry():
    print("=" * 60)
    print("Testing Telemetry Endpoint")
    print("=" * 60)
    
    # Test payload (same format as SDK sends)
    payload = {
        "ip": "127.0.0.1",
        "dna": "test_fingerprint_abc123",
        "path": "/test",
        "status": "LIMIT",
        "trace_id": "gf_test123",
        "factors": ["high_request_velocity"],
        "metadata": {
            "user-agent": "Mozilla/5.0",
            "accept": "text/html"
        }
    }
    
    print(f"\nSending to: {STUDIO_URL}/api/v1/telemetry")
    print(f"API Key: {API_KEY[:20]}...")
    print(f"Payload: {payload}")
    
    start_time = time.time()
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(
                f"{STUDIO_URL}/api/v1/telemetry",
                json=payload,
                headers={
                    "X-GuardFlow-Key": API_KEY,
                    "Content-Type": "application/json"
                }
            )
            
            elapsed = time.time() - start_time
            
            print(f"\n✅ Response received in {elapsed:.2f}s")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 201:
                print("\n✅ SUCCESS: Telemetry accepted!")
                print("   Check Studio dashboard for the threat log")
            elif response.status_code == 401:
                print("\n❌ ERROR: Invalid API key")
            elif response.status_code == 422:
                print("\n❌ ERROR: Invalid payload format")
                print(f"   Details: {response.json()}")
            else:
                print(f"\n⚠️  Unexpected status: {response.status_code}")
                
        except httpx.TimeoutException:
            elapsed = time.time() - start_time
            print(f"\n❌ TIMEOUT after {elapsed:.2f}s")
            print("   Studio API is too slow or unreachable")
            print("   This is why SDK shows 'Telemetry Transport Error'")
        except httpx.ConnectError as e:
            print(f"\n❌ CONNECTION ERROR: {e}")
            print("   Cannot connect to Studio API")
        except Exception as e:
            print(f"\n❌ ERROR: {type(e).__name__}: {e}")
    
    print("\n" + "=" * 60)
    print("DIAGNOSIS")
    print("=" * 60)
    print("\nIf you see TIMEOUT errors:")
    print("  - Studio backend on Render might be slow/sleeping")
    print("  - Network latency is too high")
    print("  - SDK timeout (2s) is too short")
    print("\nSolution:")
    print("  1. The SDK will continue working (errors are non-critical)")
    print("  2. Threats are logged when Studio responds")
    print("  3. Consider increasing timeout in SDK reporter.py")
    print("  4. Or deploy Studio closer to your app")

if __name__ == "__main__":
    asyncio.run(test_telemetry())
