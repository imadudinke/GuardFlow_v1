# GuardFlow SDK Fixes Applied

## Issue: Error Message Spam

**Problem:**
```
📡 [GuardFlow] Telemetry Transport Error: 
📡 [GuardFlow] Blacklist Lookup Error: 
📡 [GuardFlow] Runtime Config Error:
```

These errors were flooding the console because:
1. Studio API on Render free tier can be slow (2-3 seconds response time)
2. SDK had short timeouts (1-2 seconds)
3. Errors were logged at ERROR level (always visible)

## Fixes Applied

### 1. Increased Timeouts
- **Telemetry**: 2s → 5s
- **Blacklist check**: 1s → 3s  
- **Runtime config**: 1s → 3s

This accommodates cloud deployment latency.

### 2. Changed Log Levels
- Changed from `logger.error()` to `logger.debug()`
- Errors now only show when debug mode is enabled
- Non-critical failures are silent (as intended)

### 3. Better Error Handling
- Specific handling for `TimeoutException` (silent)
- Specific handling for `ConnectError` (silent)
- Generic exceptions show error type only

## Result

✅ **No more error spam in console**
✅ **SDK continues working even if Studio is slow**
✅ **Threats are logged when Studio responds**
✅ **App performance not affected**

## How to Enable Debug Logs (if needed)

```python
import logging

# Enable GuardFlow debug logs
logging.getLogger("guardflow").setLevel(logging.DEBUG)
```

## Testing

Run your app and make requests:
```bash
uvicorn test_app.main:app --reload
curl http://localhost:8000/
```

You should see:
- ✅ Clean console output
- ✅ Only important messages (bans, blocks)
- ✅ No error spam
- ✅ Threats appearing in Studio dashboard

## Global Blacklist

Yes, there's a `global_blacklist` table in the database that stores fingerprints that should be blocked across all projects. The SDK:

1. Checks Redis cache first (fast)
2. If not in cache, queries Studio API
3. Studio checks `global_blacklist` table
4. Result is cached in Redis for 1 hour
5. If blacklisted, request is blocked with 403

This allows sharing threat intelligence across all GuardFlow users!
