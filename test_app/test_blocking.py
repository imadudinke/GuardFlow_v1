"""
Test to verify IP blocking is working
"""
import requests
import time

BASE_URL = "http://127.0.0.1:8000"

print("=" * 70)
print("GuardFlow Blocking Test")
print("=" * 70)
print("\nThis test will:")
print("1. Make 60 requests with the SAME fingerprint")
print("2. Verify rate limiting kicks in (429)")
print("3. Verify banning kicks in (403)")
print("\n" + "=" * 70)

# Use consistent headers (same fingerprint)
headers = {
    "User-Agent": "TestBot/1.0",
    "Accept": "text/html",
    "Accept-Language": "en-US",
}

print("\nMaking requests with consistent headers...")
print(f"User-Agent: {headers['User-Agent']}")
print("\n" + "=" * 70)

results = []
rate_limited_at = None
banned_at = None

for i in range(1, 61):
    try:
        response = requests.get(BASE_URL + "/", headers=headers, timeout=5)
        status = response.status_code
        results.append(status)
        
        # Track when rate limiting starts
        if status == 429 and rate_limited_at is None:
            rate_limited_at = i
            print(f"\n⚠️  Request #{i}: RATE LIMITED (429)")
            print("   Rate limiting is working!")
        
        # Track when banning starts
        if status == 403 and banned_at is None:
            banned_at = i
            print(f"\n🚫 Request #{i}: BANNED (403)")
            print("   IP banning is working!")
            print("   Making 5 more requests to confirm ban persists...")
            
            # Verify ban persists
            for j in range(5):
                r = requests.get(BASE_URL + "/", headers=headers, timeout=5)
                print(f"   Request #{i+j+1}: Status {r.status_code}")
            break
        
        # Show progress every 10 requests
        if i % 10 == 0 and status not in [429, 403]:
            print(f"Request #{i}: Status {status} (still allowed)")
        
        time.sleep(0.05)  # Small delay
        
    except Exception as e:
        print(f"Request #{i}: Error - {e}")
        break

print("\n" + "=" * 70)
print("RESULTS")
print("=" * 70)

# Count statuses
status_counts = {}
for status in results:
    status_counts[status] = status_counts.get(status, 0) + 1

print(f"\nTotal requests: {len(results)}")
for status, count in sorted(status_counts.items()):
    emoji = "✅" if status in [200, 404] else "⚠️" if status == 429 else "🚫"
    print(f"  {emoji} Status {status}: {count} requests")

print("\n" + "-" * 70)

if rate_limited_at:
    print(f"✅ Rate limiting triggered at request #{rate_limited_at}")
else:
    print("❌ Rate limiting NOT triggered")

if banned_at:
    print(f"✅ IP banning triggered at request #{banned_at}")
else:
    print("❌ IP banning NOT triggered (need 50+ requests)")

print("\n" + "=" * 70)
print("DIAGNOSIS")
print("=" * 70)

if not rate_limited_at and not banned_at:
    print("\n❌ BLOCKING IS NOT WORKING")
    print("\nPossible issues:")
    print("1. Redis is not running")
    print("2. Middleware is not installed correctly")
    print("3. Fingerprinting is changing between requests")
    print("\nTo debug:")
    print("  - Check Redis: docker ps | grep redis")
    print("  - Check app logs for GuardFlow messages")
    print("  - Verify middleware is added to FastAPI app")
elif rate_limited_at and not banned_at:
    print("\n⚠️  PARTIAL BLOCKING")
    print(f"   Rate limiting works (triggered at #{rate_limited_at})")
    print(f"   But banning needs 50+ requests")
    print(f"   You only made {len(results)} requests")
    print("\nTo trigger ban:")
    print("  - Run this script again (will make 60 requests)")
elif banned_at:
    print("\n✅ FULL BLOCKING IS WORKING!")
    print(f"   Rate limiting: Request #{rate_limited_at}")
    print(f"   IP banning: Request #{banned_at}")
    print("\nYour GuardFlow SDK is protecting your API correctly!")

print("=" * 70)
