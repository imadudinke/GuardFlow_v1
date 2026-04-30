# GuardFlow SDK Troubleshooting Guide

## Issue: Not seeing threats in Studio dashboard

### Step 1: Verify Prerequisites

**Check Redis is running:**
```bash
# Test Redis connection
redis-cli ping
# Should return: PONG

# If Redis is not running, start it:
docker-compose up -d redis
```

**Check Studio backend is accessible:**
```bash
# Test Studio API health
curl https://guardflow-v1.onrender.com/health

# Should return: {"status":"healthy"}
```

### Step 2: Verify API Key

Your API key must match a project in the Studio database.

**Check your API key:**
```python
# In your test_app/main.py
api_key="gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM"
```

**Verify in Studio:**
1. Log into Studio: https://guardflow-v1.onrender.com
2. Go to Projects page
3. Check if a project exists with this API key
4. If not, create a new project and use that API key

### Step 3: Run Diagnostic Tests

```bash
# Run the test script
cd test_app
python test_guardflow.py
```

This will check:
- ✅ SDK imports correctly
- ✅ Redis connection works
- ✅ Studio API is reachable
- ✅ Threat reporting works

### Step 4: Test Your FastAPI App

**Start your app:**
```bash
# Option 1: Basic app
uvicorn test_app.main:app --reload

# Option 2: Enhanced app with more test endpoints
python test_app/main_enhanced.py
```

**Make test requests:**
```bash
# Normal request (should be logged)
curl http://localhost:8000/

# Multiple rapid requests (should trigger rate limiting)
for i in {1..20}; do curl http://localhost:8000/; done

# Honeypot trap (should trigger high-risk threat)
curl http://localhost:8000/admin
curl http://localhost:8000/.env
```

### Step 5: Check Logs

**Check FastAPI app logs:**
Look for GuardFlow middleware output:
```
INFO:     GuardFlow: Fingerprint generated: abc123...
INFO:     GuardFlow: Threat detected - Risk: 75
INFO:     GuardFlow: Reporting threat to Studio...
```

**Check Studio backend logs:**
If using Render, check logs in Render dashboard for incoming telemetry requests.

### Step 6: Verify Database

**Check if threats are being stored:**
```bash
# Connect to Studio backend
docker-compose exec backend bash

# Or if deployed on Render, use Render shell

# Check database
python -c "
from app.core.db import SessionLocal
from app.models.threat_log import ThreatLog

db = SessionLocal()
threats = db.query(ThreatLog).all()
print(f'Total threats in DB: {len(threats)}')
for threat in threats[-5:]:
    print(f'  - {threat.ip_address} | {threat.path} | Risk: {threat.risk_score}')
"
```

## Common Issues and Solutions

### Issue 1: "Connection refused" to Redis

**Problem:** Redis is not running or not accessible

**Solution:**
```bash
# Start Redis
docker-compose up -d redis

# Or install Redis locally
# Ubuntu/Debian:
sudo apt install redis-server
sudo systemctl start redis

# macOS:
brew install redis
brew services start redis
```

### Issue 2: "Connection timeout" to Studio API

**Problem:** Studio backend is not accessible or URL is wrong

**Solution:**
1. Verify Studio URL: `https://guardflow-v1.onrender.com`
2. Check if backend is running on Render
3. Test manually: `curl https://guardflow-v1.onrender.com/health`

### Issue 3: "Invalid API key" or "Project not found"

**Problem:** API key doesn't match any project in Studio

**Solution:**
1. Log into Studio dashboard
2. Create a new project or copy existing API key
3. Update `api_key` in your `test_app/main.py`
4. Restart your FastAPI app

### Issue 4: Threats not appearing in Studio UI

**Problem:** Threats are being sent but not showing in dashboard

**Possible causes:**
1. **Wrong project selected:** Check project dropdown in Studio
2. **Database not updated:** Check backend logs for errors
3. **Frontend not polling:** Refresh the page or check browser console

**Solution:**
```bash
# Check backend logs
# If on Render: Check logs in Render dashboard
# If local: docker-compose logs -f backend

# Check database directly
docker-compose exec postgres psql -U guardflow -d guardflow_db
SELECT COUNT(*) FROM threat_logs;
SELECT * FROM threat_logs ORDER BY created_at DESC LIMIT 5;
```

### Issue 5: Rate limiting not working

**Problem:** Making many requests but not triggering rate limit

**Solution:**
1. Check `rate_limit` and `rate_window` in middleware config
2. Ensure Redis is working (rate limiting uses Redis)
3. Make requests faster:
```bash
# Rapid fire requests
for i in {1..50}; do curl http://localhost:8000/ & done
```

## Debug Mode

Enable debug logging in your FastAPI app:

```python
import logging

# Add at the top of test_app/main.py
logging.basicConfig(level=logging.DEBUG)

# GuardFlow will output detailed logs
```

## Manual Threat Test

Test threat reporting directly:

```python
import asyncio
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'SDK')))

from guardflow.reporter import ThreatReporter

async def test():
    reporter = ThreatReporter(
        api_key="gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM",
        studio_url="https://guardflow-v1.onrender.com"
    )
    
    threat = {
        "ip_address": "192.168.1.100",
        "fingerprint": "test_12345",
        "path": "/test",
        "method": "GET",
        "risk_score": 100,
        "risk_factors": ["manual_test"],
        "metadata": {"test": True}
    }
    
    await reporter.report_threat(threat)
    print("✅ Threat sent! Check Studio dashboard.")

asyncio.run(test())
```

## Still Not Working?

1. **Check all services are running:**
   - Redis: `redis-cli ping`
   - Studio backend: `curl https://guardflow-v1.onrender.com/health`
   - Your FastAPI app: `curl http://localhost:8000/`

2. **Verify configuration:**
   - API key is correct
   - Studio URL is correct
   - Redis URL is correct

3. **Check logs:**
   - FastAPI app logs
   - Studio backend logs
   - Browser console (for frontend issues)

4. **Test each component separately:**
   - Run `test_guardflow.py` to test each component
   - Test threat reporting manually
   - Check database directly

## Need Help?

If you're still having issues:
1. Run `python test_app/test_guardflow.py` and share the output
2. Check Studio backend logs on Render
3. Verify your API key matches a project in Studio
4. Make sure Redis is running locally
