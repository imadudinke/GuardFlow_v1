# Keep-Alive Feature for Render Free Tier

## Problem

Render's free tier puts services to sleep after **15 minutes of inactivity**. This causes:
- ❌ Slow first request (cold start takes 30-60 seconds)
- ❌ SDK timeout errors when Studio is sleeping
- ❌ Poor user experience

## Solution

The backend now includes a **keep-alive background task** that:
- ✅ Pings itself every 10 minutes
- ✅ Prevents Render from putting the service to sleep
- ✅ Only runs in production (not in development)
- ✅ Uses minimal resources (just a health check)

## How It Works

```python
# In app/main.py
async def keep_alive_task():
    # Wait 2 minutes after startup
    await asyncio.sleep(120)
    
    # Ping every 10 minutes
    while True:
        await client.get(f"{service_url}/health")
        await asyncio.sleep(600)  # 10 minutes
```

The task:
1. Starts automatically when the app starts
2. Waits 2 minutes for full initialization
3. Pings `/health` endpoint every 10 minutes
4. Keeps the service active 24/7

## Configuration

### Environment Variable

Set in Render dashboard or `render.yaml`:

```bash
RENDER_EXTERNAL_URL=https://guardflow-v1.onrender.com
```

This tells the keep-alive task what URL to ping.

### Automatic Detection

The task only runs when:
- `ENVIRONMENT=production` (set in Render)
- Not in development/local mode

## Deployment

### Option 1: Automatic (via render.yaml)

Already configured in `render.yaml`:

```yaml
envVars:
  - key: RENDER_EXTERNAL_URL
    value: https://guardflow-v1.onrender.com
  - key: ENVIRONMENT
    value: production
```

Just push to GitHub and Render will deploy with keep-alive enabled.

### Option 2: Manual (Render Dashboard)

1. Go to your service in Render dashboard
2. Click "Environment"
3. Add environment variable:
   - Key: `RENDER_EXTERNAL_URL`
   - Value: `https://guardflow-v1.onrender.com`
4. Save and redeploy

## Verification

Check logs in Render dashboard:

```
🚀 GuardFlow Studio API started
🔄 Keep-alive task started for https://guardflow-v1.onrender.com
✅ Keep-alive ping successful
✅ Keep-alive ping successful
...
```

You should see a ping every 10 minutes.

## Benefits

✅ **No more cold starts** - Service stays warm 24/7  
✅ **Faster SDK responses** - No timeout errors  
✅ **Better user experience** - Instant API responses  
✅ **Minimal overhead** - Just a health check every 10 minutes  

## Cost

**Free!** This uses:
- ~144 requests per day (24 hours × 6 pings/hour)
- Minimal CPU/memory (just HTTP GET requests)
- Well within Render free tier limits

## Alternative Solutions

If you want to disable keep-alive:

### Option 1: Set ENVIRONMENT to development
```bash
ENVIRONMENT=development
```

### Option 2: Use External Service

Use a free service like:
- **UptimeRobot** (https://uptimerobot.com)
- **Cron-job.org** (https://cron-job.org)
- **Pingdom** (https://www.pingdom.com)

Configure them to ping your `/health` endpoint every 10 minutes.

## Monitoring

The keep-alive task logs:
- ✅ Success: `Keep-alive ping successful` (DEBUG level)
- ⚠️ Warning: `Keep-alive ping returned {status}` (WARNING level)
- ❌ Error: `Keep-alive ping failed: {error}` (ERROR level)

Check Render logs to monitor the task.

## Troubleshooting

### Service still sleeping

1. Check `ENVIRONMENT` is set to `production`
2. Check `RENDER_EXTERNAL_URL` is correct
3. Check logs for keep-alive messages
4. Verify health endpoint is accessible: `curl https://guardflow-v1.onrender.com/health`

### Too many logs

The task uses DEBUG level for success messages. To reduce logs:

```python
# In app/main.py, change:
logger.debug(f"✅ Keep-alive ping successful")
# to:
# logger.info(f"✅ Keep-alive ping successful")  # Only log every 10 min
```

## Summary

✅ **Enabled by default** in production  
✅ **Zero configuration** needed (uses render.yaml)  
✅ **Keeps service active** 24/7  
✅ **Prevents cold starts** and timeout errors  
✅ **Free** and within Render limits  

Your GuardFlow Studio backend will now stay active and responsive!
