import requests
import time
import concurrent.futures

# Configuration - Adjust these to match your FastAPI routes
BASE_URL = "http://127.0.0.1:8000"
LOGIN_URL = f"{BASE_URL}/login"
DATA_URL = f"{BASE_URL}/items"  # A route that might contain sensitive data
PROTECTED_URL = f"{BASE_URL}/admin"

def run_test(name, func):
    print(f"\n--- Starting Test: {name} ---")
    try:
        func()
    except Exception as e:
        print(f"Test Error: {e}")

def test_brute_force():
    """Simulates a dictionary attack on the login endpoint."""
    print(f"[*] Sending 15 rapid login attempts to {LOGIN_URL}...")
    for i in range(1, 16):
        data = {"username": "admin", "password": f"pass{i}"}
        response = requests.post(LOGIN_URL, data=data)
        print(f"Attempt {i}: Status {response.status_code}")
        if response.status_code == 429:
            print("[+] GuardFlow SUCCESS: Brute force blocked (Rate Limit).")
            return
    print("[-] GuardFlow NOTIFY: No rate limiting detected.")

def test_scraping():
    """Simulates a bot crawling for sensitive data."""
    print(f"[*] Simulating high-frequency data scraping on {DATA_URL}...")
    def fetch():
        return requests.get(DATA_URL, headers={"User-Agent": "ScraperBot/1.0"})

    # Using a thread pool to simulate concurrent requests
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        futures = [executor.submit(fetch) for _ in range(30)]
        
        blocked = False
        for f in concurrent.futures.as_completed(futures):
            res = f.result()
            if res.status_code in [403, 429]:
                blocked = True
        
        if blocked:
            print("[+] GuardFlow SUCCESS: Scraping pattern detected and blocked.")
        else:
            print("[-] GuardFlow NOTIFY: Bot allowed to complete all requests.")

def test_auth_bypass():
    """Probes protected routes without credentials."""
    print(f"[*] Probing {PROTECTED_URL} without authentication...")
    
    # 1. No Header
    res1 = requests.get(PROTECTED_URL)
    # 2. Malformed Header
    res2 = requests.get(PROTECTED_URL, headers={"Authorization": "Bearer invalid_token"})
    
    print(f"No Token: {res1.status_code} | Invalid Token: {res2.status_code}")
    
    if res1.status_code in [401, 403] and res2.status_code in [401, 403]:
        print("[+] GuardFlow SUCCESS: Authentication enforcement verified.")
    else:
        print("[!] GuardFlow WARNING: Protected route is accessible!")

def main():
    print("====================================================")
    print("   GuardFlow_V1 SDK - Automated Security Auditor    ")
    print("====================================================")
    
    # Check if server is up
    try:
        requests.get(BASE_URL)
    except requests.exceptions.ConnectionError:
        print(f"ERROR: Could not connect to {BASE_URL}. Make sure your Uvicorn server is running!")
        return

    run_test("BRUTE FORCE PROTECTION", test_brute_force)
    run_test("SCRAPING DETECTION", test_scraping)
    run_test("AUTH ENFORCEMENT", test_auth_bypass)

    print("\n====================================================")
    print("Audit Complete. Check your Uvicorn logs for SDK triggers.")

if __name__ == "__main__":
    main()