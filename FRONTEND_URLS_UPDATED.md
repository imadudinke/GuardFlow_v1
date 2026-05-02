# Frontend URLs Updated ✅

## Studio API URL Standardized

Both documentation pages now use the correct Studio API URL:

**Studio API URL**: `https://guardflow-v1.onrender.com`

## Pages Updated

### 1. `/docs` Page ✅
- ✅ Basic example: `studio_url="https://guardflow-v1.onrender.com"`
- ✅ Advanced config: `studio_url="https://guardflow-v1.onrender.com"`
- ✅ Environment variables: `GUARDFLOW_STUDIO_URL=https://guardflow-v1.onrender.com"`
- ✅ Deployment example: `studio_url="https://guardflow-v1.onrender.com"`

### 2. `/sdk-guide` Page ✅
- ✅ Basic example: `studio_url="https://guardflow-v1.onrender.com"`
- ✅ Advanced config: `studio_url="https://guardflow-v1.onrender.com"`

## URL Structure

Your GuardFlow deployment:
- **Frontend (Studio Dashboard)**: https://guard-flow-v1.vercel.app
- **Backend (API)**: https://guardflow-v1.onrender.com
- **Documentation**: https://guard-flow-v1.vercel.app/docs
- **SDK Guide**: https://guard-flow-v1.vercel.app/sdk-guide

## SDK Configuration

Users will configure the SDK like this:

```python
from fastapi import FastAPI
from guardflow.middleware import GuardFlowMiddleware

app = FastAPI()

app.add_middleware(
    GuardFlowMiddleware,
    api_key="gf_live_your_api_key_here",
    redis_url="redis://localhost:6379",
    studio_url="https://guardflow-v1.onrender.com"  # ← Your Render backend
)
```

## How It Works

1. **SDK** sends telemetry to: `https://guardflow-v1.onrender.com/api/v1/telemetry`
2. **Backend** stores data in Render PostgreSQL database
3. **Frontend** fetches data from: `https://guardflow-v1.onrender.com/api/v1/*`
4. **Users** view threats at: `https://guard-flow-v1.vercel.app`

## Deploy Frontend

To make these changes live:

```bash
# Commit changes
git add studio/frontend/app/docs/page.tsx
git add studio/frontend/app/sdk-guide/page.tsx
git commit -m "Update Studio API URL in documentation"
git push origin main
```

Vercel will automatically deploy the updated frontend.

## Verification

After deployment, check:
- [ ] https://guard-flow-v1.vercel.app/docs shows correct URL
- [ ] https://guard-flow-v1.vercel.app/sdk-guide shows correct URL
- [ ] Code examples are copy-paste ready
- [ ] All links work

---

**All documentation now points to your production backend! ✅**
