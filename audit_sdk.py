import requests
import time
import random
import concurrent.futures
from typing import Dict

# ====================== CONFIG ======================
BASE_URL = "http://127.0.0.1:8000"

LOGIN_URL = f"{BASE_URL}/auth/login"
PROTECTED_URL = f"{BASE_URL}/admin/dashboard"
SENSITIVE_URL = f"{BASE_URL}/api/users"

# Realistic browser fingerprints pool
BROWSER_FINGERPRINTS = [
    {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://www.google.com/",
    },
    {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.8",
        "Referer": "https://github.com/",
    },
    {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://stackoverflow.com/",
    },
]

def get_random_fingerprint() -> Dict:
    """Return a random realistic browser fingerprint"""
    fp = random.choice(BROWSER_FINGERPRINTS).copy()
    fp["Connection"] = random.choice(["keep-alive", "close"])
    fp["Cache-Control"] = random.choice(["no-cache", "max-age=0"])
    return fp


def run_test(name: str, func):
    print(f"\n{'='*75}")
    print(f"   [ATTACK TEST] {name.upper()}")
    print(f"{'='*75}")
    try:
        func()
    except Exception as e:
        print(f"    [!] Test crashed: {e}")


# ====================== TEST 1: Advanced Brute Force with Fingerprint Rotation ======================
def test_brute_force():
    print("[*] Starting advanced brute force with rotating fingerprints...")

    for i in range(1, 100):
        if i % 15 == 0:
            print(f"    --- Changing DNA fingerprint (request {i}) ---")

        fingerprint = get_random_fingerprint()
        
        payload = {
            "username": "admin",
            "password": f"password{random.randint(100,999)}"
        }

        try:
            response = requests.post(
                LOGIN_URL, 
                json=payload, 
                headers=fingerprint,
                timeout=6
            )

            print(f"    Attempt {i:3d} | Status: {response.status_code} | UA: {fingerprint['User-Agent'][:40]}...")

            if response.status_code == 429:
                print("    [+] SUCCESS: Rate limiting triggered!")
                return
            if response.status_code in [200, 201]:
                print("    [!] CRITICAL: Weak credentials allowed!")
                break

        except Exception as e:
            print(f"    [!] Request failed: {e}")

        # Random delay between 0.1 - 0.8 seconds (human-like)
        time.sleep(random.uniform(0.1, 0.8))


# ====================== TEST 2: Advanced Scraping with Fingerprint Rotation ======================
def test_scraping():
    print("[*] Starting concurrent scraping with frequent fingerprint changes...")

    def make_request():
        fingerprint = get_random_fingerprint()
        # Occasionally change path slightly to look more natural
        path = random.choice(["", "/profile", "/data", "/users"])
        url = f"{SENSITIVE_URL}{path}"
        
        return requests.get(url, headers=fingerprint, timeout=8)

    blocked = 0
    total = 60

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(total)]
        
        for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
            try:
                resp = future.result()
                if resp.status_code in [403, 429]:
                    blocked += 1
                
                if i % 15 == 0:
                    print(f"    --- Rotating fingerprint at request {i} ---")
            except:
                pass

    print(f"    [+] Scraping Test Complete: {blocked}/{total} requests blocked")
    if blocked > 25:
        print("    [+] Strong bot protection detected")
    else:
        print("    [!] Bot protection appears weak")


# ====================== TEST 3: Authorization Bypass Attempts ======================
def test_auth_bypass():
    print("[*] Testing multiple authorization bypass techniques...")

    tests = [
        ("No auth", {}),
        ("Invalid Bearer", {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.token"}),
        ("Fake JWT", {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"}),
        ("Basic Auth fake", {"Authorization": "Basic YWRtaW46YWRtaW4="}),
    ]

    for name, extra_headers in tests:
        fingerprint = get_random_fingerprint()
        headers = {**fingerprint, **extra_headers}

        try:
            resp = requests.get(PROTECTED_URL, headers=headers, timeout=5)
            print(f"    {name:25} → Status: {resp.status_code}")
            
            if resp.status_code in [401, 403]:
                print("        [+] Access correctly denied")
            else:
                print("        [!] WARNING: Access granted!")
        except Exception as e:
            print(f"        [!] Request error: {e}")


def main():
    print("\n" + "="*80)
    print("          ADVANCED GUARDFLOW SECURITY AUDITOR")
    print("          Real Attacker Simulation with Fingerprint Rotation")
    print("="*80)

    # Better connection check with retries
    print(f"\n[*] Checking connection to {BASE_URL}...")
    for attempt in range(3):
        try:
            resp = requests.get(BASE_URL, timeout=5)
            print(f"[✓] Server is running (Status: {resp.status_code})")
            break
        except requests.exceptions.ConnectionError:
            if attempt < 2:
                print(f"[!] Connection attempt {attempt + 1} failed, retrying...")
                time.sleep(1)
            else:
                print(f"❌ Cannot connect to {BASE_URL}. Make sure your FastAPI server is running!")
                print(f"   Start it with: cd test_app && uvicorn main:app --reload")
                return
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return

    run_test("BRUTE FORCE WITH FINGERPRINT ROTATION", test_brute_force)
    time.sleep(1.5)
    
    run_test("AGGRESSIVE SCRAPING WITH DNA CHANGES", test_scraping)
    time.sleep(1.5)
    
    run_test("AUTHENTICATION BYPASS ATTEMPTS", test_auth_bypass)

    print("\n" + "="*80)
    print("Audit completed. Check your GuardFlow logs for detection patterns.")
    print("="*80)


if __name__ == "__main__":
    main()