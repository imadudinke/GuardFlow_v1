# Render Keep-Alive Fix Applied ✅

## Problem Solved

Your Render backend was sleeping after 15 minutes of inactivity, causing:
- ❌ SDK timeout errors
- ❌ Slow first requests (30-60s cold starts)
- ❌ "Telemetry Transport Error" messages

## Solution Implemented

Added a **background keep-alive task** that pings the backend every 10 minutes to keep it awake.

## What Changed

### 1. Updated `studio/backend/app/main.py`
- ✅ Added `keep_alive_task()` function
- ✅ Pings `/health` endpoint every 10 minutes
- ✅ Only runs in production (not in development)
- ✅ Starts automatically with the app

### 2. Updated `render.yaml`
- ✅ Added `RENDER_EXTERNAL_URL` environment variable
- ✅ Set to `https://guardflow-v1.onrender.com`

### 3. Updated `.env.example`
- ✅ Added `RENDER_EXTERNAL_URL` documentation

## How to Deploy

### Option 1: Push to GitHub (Automatic)

```bash
git add .
git commit -m "Add keep-alive task to prevent Render sleep"
git push origin main
```

Render will automatically detect the changes and redeploy.

### Option 2: Manual Redeploy

1. Go to Render dashboard
2. Select your backend service
3. Click "Manual Deploy" → "Deploy latest commit"

## Verification

After deployment, check Render logs:

```
🚀 GuardFlow Studio API started
🔄 Keep-alive task started for https://guardflow-v1.onrender.com
✅ Keep-alive ping successful
```

You should see a ping every 10 minutes.

## Benefits

✅ **Backend stays active 24/7**  
✅ **No more cold starts**  
✅ **SDK works reliably** (no timeout errors)  
✅ **Fast API responses** (no 30s delays)  
✅ **Free** (uses minimal resources)  

## Cost

**$0** - Uses ~144 requests/day, well within Render free tier limits.

## Next Steps

1. **Deploy the changes** (push to GitHub or manual deploy)
2. **Wait 2-3 minutes** for deployment to complete
3. **Check logs** to verify keep-alive is running
4. **Test your SDK** - should work without timeout errors now!

## Testing

After deployment, test the SDK:

```bash
# Run your test app
uvicorn test_app.main:app --reload

# Make requests
curl http://localhost:8000/

# Should see threats in Studio without errors!
```

## Documentation

See `studio/backend/KEEP_ALIVE.md` for full documentation.

---

**Your Render backend will now stay active and your SDK will work reliably!** 🎉
