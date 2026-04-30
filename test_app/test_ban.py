"""
Test script to trigger IP banning (50+ requests with same fingerprint)
"""
import requests
import time

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("Testing GuardFlow IP Banning")
print("=" * 60)
print("\nMaking 60 requests with the SAME fingerprint...")
print("Expected behavior:")
print("  Requests 1-10:  ✅ Allowed (Status 200)")
print("  Requests 11-50: ⚠️  Rate Limited (Status 429)")
print("  Requests 51+:   🚫 BANNED (Status 403)")
print("\n" + "=" * 60)

# Use consistent headers (same fingerprint)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

status_counts = {200: 0, 404: 0, 429: 0, 403: 0}
banned = False

for i in range(1, 61):
    try:
        response = requests.get(BASE_URL + "/", headers=headers, timeout=5)
        status = response.status_code
        status_counts[status] = status_counts.get(status, 0) + 1
        
        # Show status changes
        if status == 429 and status_counts[429] == 1:
            print(f"\n⚠️  Request {i}: RATE LIMITED (Status 429)")
            print("   GuardFlow detected high request rate!")
        elif status == 403 and not banned:
            print(f"\n🚫 Request {i}: BANNED (Status 403)")
            print("   GuardFlow banned this fingerprint for 1 hour!")
            banned = True
            # Show a few more to confirm ban persists
            for j in range(5):
                r = requests.get(BASE_URL + "/", headers=headers, timeout=5)
                print(f"   Request {i+j+1}: Still banned (Status {r.status_code})")
            break
        elif i % 10 == 0:
            print(f"Request {i}: Status {status}")
            
        time.sleep(0.1)  # Small delay
        
    except Exception as e:
        print(f"Request {i}: Error - {e}")
        break

print("\n" + "=" * 60)
print("RESULTS")
print("=" * 60)
print(f"Total requests made: {sum(status_counts.values())}")
print(f"  ✅ Allowed (200/404): {status_counts[200] + status_counts[404]}")
print(f"  ⚠️  Rate Limited (429): {status_counts[429]}")
print(f"  🚫 Banned (403): {status_counts[403]}")

if banned:
    print("\n✅ SUCCESS: IP banning is working!")
    print("   The fingerprint is now banned for 1 hour.")
    print("   Check Studio dashboard to see the threat logs.")
else:
    print("\n⚠️  Ban threshold not reached yet.")
    print("   Run the script again or increase request count.")

print("=" * 60)
