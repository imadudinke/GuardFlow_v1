"""
Check if threats are being saved to the database
"""
import asyncio
import httpx

STUDIO_URL = "https://guardflow-v1.onrender.com"
API_KEY = "gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"

async def check_threats():
    print("=" * 60)
    print("Checking Threats in Studio")
    print("=" * 60)
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            # Get the project ID first
            response = await client.get(
                f"{STUDIO_URL}/api/v1/telemetry/runtime-config",
                headers={"X-GuardFlow-Key": API_KEY}
            )
            
            if response.status_code != 200:
                print(f"❌ Failed to get project info: {response.status_code}")
                return
            
            # Now get threats for this project
            response = await client.get(
                f"{STUDIO_URL}/api/v1/threats",
                params={
                    "limit": 10,
                    "skip": 0
                },
                headers={"X-GuardFlow-Key": API_KEY}
            )
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, dict) and "threats" in data:
                    threats = data["threats"]
                    total = data.get("total", len(threats))
                elif isinstance(data, list):
                    threats = data
                    total = len(threats)
                else:
                    threats = []
                    total = 0
                
                print(f"\n✅ Found {total} total threats")
                
                if threats:
                    print(f"\nShowing last {len(threats)} threats:")
                    for i, threat in enumerate(threats[:5], 1):
                        print(f"\n{i}. Threat ID: {threat.get('id', 'N/A')[:8]}...")
                        print(f"   IP: {threat.get('ip_address', 'N/A')}")
                        print(f"   Path: {threat.get('path', 'N/A')}")
                        print(f"   Risk Score: {threat.get('risk_score', 0)}")
                        print(f"   Factors: {threat.get('risk_factors', [])}")
                        print(f"   Created: {threat.get('created_at', 'N/A')}")
                else:
                    print("\n⚠️  No threats found yet")
                    print("\nTo generate threats:")
                    print("1. Start your FastAPI app: uvicorn test_app.main:app --reload")
                    print("2. Make requests: curl http://localhost:8000/")
                    print("3. Run this script again")
            else:
                print(f"❌ Failed to get threats: {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_threats())
