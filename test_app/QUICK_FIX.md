# Quick Fix: Why Threats Aren't Showing in Studio

## Problem Found ✅

The diagnostic test revealed:
1. ✅ SDK imports correctly
2. ✅ Redis is running
3. ✅ Studio API is reachable
4. ❌ **Telemetry rejected with 422 error**

## Root Cause

The Studio API is rejecting telemetry because the **API key doesn't match any project** in your database.

## Solution

### Option 1: Create a Project in Studio (Recommended)

1. **Log into Studio:**
   ```bash
   # Open in browser
   https://guardflow-v1.onrender.com
   ```

2. **Create a new project:**
   - Go to "Projects" page
   - Click "Create Project"
   - Copy the generated API key

3. **Update your test app:**
   ```python
   # In test_app/main.py, replace the api_key with your new one:
   app.add_middleware(
       GuardFlowMiddleware,
       api_key="YOUR_NEW_API_KEY_HERE",  # ← Update this
       redis_url="redis://localhost:6379",
       studio_url="https://guardflow-v1.onrender.com"
   )
   ```

### Option 2: Add API Key to Database Manually

If you have database access:

```python
# Connect to your Studio backend
from app.core.db import SessionLocal
from app.models.project import Project
from app.models.user import User
import uuid

db = SessionLocal()

# Get your user (or create one)
user = db.query(User).first()

# Create a project with your API key
project = Project(
    id=str(uuid.uuid4()),
    name="Test Project",
    api_key="gf_live_s380vLEX3YBl7PH97TEKWN4NFew8TPhdCbUHWBxYaYM",
    user_id=user.id,
    rate_limit=100,
    rate_window=60
)
db.add(project)
db.commit()
print(f"✅ Project created with API key: {project.api_key}")
```

## Test Your Fix

After updating the API key:

1. **Start your FastAPI app:**
   ```bash
   source .venv/bin/activate
   uvicorn test_app.main:app --reload
   ```

2. **Make test requests:**
   ```bash
   # Single request
   curl http://localhost:8000/

   # Multiple rapid requests (trigger rate limiting)
   for i in {1..20}; do curl http://localhost:8000/; done
   ```

3. **Check Studio dashboard:**
   - Go to https://guardflow-v1.onrender.com
   - Select your project
   - Go to "Threats" page
   - You should see threat logs appearing!

## Expected Behavior

When working correctly, you should see:
- ✅ Requests logged in FastAPI console
- ✅ GuardFlow middleware processing requests
- ✅ Threats appearing in Studio dashboard
- ✅ Rate limiting triggered after many requests
- ✅ Honeypot traps detected (if you hit /admin, /.env, etc.)

## Still Not Working?

Run the diagnostic again:
```bash
source .venv/bin/activate
python test_guardflow.py
```

Check for:
- Redis is running (Test 2)
- Studio API is reachable (Test 3)
- Telemetry is accepted (Test 4 should not show 422 error)

## Next Steps

Once threats are showing:
1. Test different endpoints
2. Trigger rate limiting
3. Test honeypot traps
4. Check analytics in Studio
5. Test global blacklist feature
