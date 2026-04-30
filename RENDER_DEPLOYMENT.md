# GuardFlow Studio - Render Deployment Guide

Complete guide for deploying GuardFlow Studio to Render.com

## 🚀 Quick Deploy to Render

### Option 1: Using Blueprint (Recommended)

1. **Fork/Push Repository to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/guardflow.git
   git push -u origin main
   ```

2. **Deploy via Render Dashboard**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository
   - Render will automatically detect `render.yaml`
   - Click "Apply"

3. **Configure Environment Variables**
   - Go to Backend service settings
   - Add `CORS_ORIGINS` with your frontend URL
   - Example: `https://guardflow-frontend.onrender.com`

4. **Wait for Deployment**
   - Render will automatically:
     - Create PostgreSQL database
     - Create Redis instance
     - Deploy backend service
     - Deploy frontend service
     - Run database migrations

### Option 2: Manual Setup

#### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `guardflow-db`
   - **Database**: `guardflow_db`
   - **User**: `guardflow`
   - **Region**: Choose closest to you
   - **Plan**: Starter ($7/month) or Free
4. Click "Create Database"
5. Copy the **Internal Database URL** (starts with `postgresql://`)

#### Step 2: Create Redis Instance

1. Click "New" → "Redis"
2. Configure:
   - **Name**: `guardflow-redis`
   - **Region**: Same as database
   - **Plan**: Starter ($10/month) or Free
3. Click "Create Redis"
4. Copy the **Internal Redis URL** (starts with `redis://`)

#### Step 3: Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `guardflow-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `studio/backend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Starter ($7/month) or Free

4. **Environment Variables**:
   ```
   DATABASE_URL=<paste Internal Database URL>
   REDIS_URL=<paste Internal Redis URL>
   SECRET_KEY=<generate with: openssl rand -hex 32>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   CORS_ORIGINS=https://guardflow-frontend.onrender.com
   ENVIRONMENT=production
   ```

5. **Advanced Settings**:
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: Yes

6. Click "Create Web Service"

#### Step 4: Deploy Frontend

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `guardflow-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `studio/frontend`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Starter ($7/month) or Free

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://guardflow-backend.onrender.com
   ```

5. Click "Create Web Service"

---

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `REDIS_URL` | Redis connection string | `redis://host:6379` |
| `SECRET_KEY` | JWT secret key (32+ chars) | Generate with `openssl rand -hex 32` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration | `30` |
| `CORS_ORIGINS` | Allowed frontend URLs | `https://your-frontend.onrender.com` |
| `ENVIRONMENT` | Deployment environment | `production` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://your-backend.onrender.com` |

---

## 📝 Post-Deployment Steps

### 1. Verify Services

Check that all services are running:
- ✅ Database: "Available"
- ✅ Redis: "Available"
- ✅ Backend: "Live"
- ✅ Frontend: "Live"

### 2. Test Backend Health

```bash
curl https://guardflow-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "production"
}
```

### 3. Test Frontend

Visit your frontend URL:
```
https://guardflow-frontend.onrender.com
```

### 4. Create First User

1. Go to your frontend URL
2. Click "Register"
3. Create your admin account
4. Login to dashboard

### 5. Update CORS Origins

After frontend is deployed:
1. Go to Backend service settings
2. Update `CORS_ORIGINS` environment variable
3. Add your actual frontend URL
4. Save and redeploy

---

## 🔄 Continuous Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render will automatically:
# 1. Detect the push
# 2. Build new Docker images
# 3. Run migrations
# 4. Deploy new version
# 5. Health check
```

---

## 💰 Pricing

### Free Tier
- **Backend**: Free (750 hours/month, spins down after 15 min inactivity)
- **Frontend**: Free (750 hours/month, spins down after 15 min inactivity)
- **Database**: Free (90 days, then $7/month)
- **Redis**: Not available on free tier

**Total Free**: $0/month (first 90 days)

### Starter Tier (Recommended)
- **Backend**: $7/month (always on)
- **Frontend**: $7/month (always on)
- **Database**: $7/month (1GB storage)
- **Redis**: $10/month (25MB)

**Total Starter**: $31/month

### Production Tier
- **Backend**: $25/month (2GB RAM, 2 CPU)
- **Frontend**: $25/month (2GB RAM, 2 CPU)
- **Database**: $20/month (10GB storage)
- **Redis**: $30/month (256MB)

**Total Production**: $100/month

---

## 🐛 Troubleshooting

### Backend Won't Start

**Check Logs**:
1. Go to Backend service
2. Click "Logs" tab
3. Look for errors

**Common Issues**:

1. **Database connection failed**
   - Verify `DATABASE_URL` is correct
   - Use **Internal Database URL** (not External)
   - Check database is "Available"

2. **Redis connection failed**
   - Verify `REDIS_URL` is correct
   - Use **Internal Redis URL**
   - Check Redis is "Available"

3. **Migration failed**
   - Check database is accessible
   - Manually run migrations:
     ```bash
     # In Render Shell
     alembic upgrade head
     ```

### Frontend Can't Connect to Backend

1. **Check `NEXT_PUBLIC_API_URL`**
   - Must be the **External URL** of backend
   - Example: `https://guardflow-backend.onrender.com`
   - No trailing slash

2. **Check CORS**
   - Backend `CORS_ORIGINS` must include frontend URL
   - Example: `https://guardflow-frontend.onrender.com`

3. **Check Backend Health**
   ```bash
   curl https://your-backend.onrender.com/health
   ```

### Service Keeps Restarting

1. **Check Health Check**
   - Backend health check path: `/health`
   - Must return 200 status code

2. **Check Resource Usage**
   - Upgrade to larger plan if needed
   - Check logs for memory errors

3. **Check Environment Variables**
   - All required variables set
   - No typos in variable names

### Slow Cold Starts (Free Tier)

Free tier services spin down after 15 minutes of inactivity:
- First request after spin down takes 30-60 seconds
- Upgrade to Starter tier for always-on services

---

## 🔒 Security Best Practices

### 1. Use Internal URLs

- Database: Use **Internal Database URL**
- Redis: Use **Internal Redis URL**
- These are only accessible within Render network

### 2. Secure Environment Variables

- Never commit `.env` files
- Use Render's environment variable management
- Rotate `SECRET_KEY` regularly

### 3. Enable HTTPS

- Render provides free SSL certificates
- All services use HTTPS by default
- No configuration needed

### 4. Restrict CORS

```bash
# Don't use wildcard in production
CORS_ORIGINS=https://your-frontend.onrender.com

# Multiple origins (comma-separated)
CORS_ORIGINS=https://app1.com,https://app2.com
```

### 5. Monitor Logs

- Check logs regularly for errors
- Set up log alerts in Render dashboard
- Monitor for suspicious activity

---

## 📊 Monitoring

### Built-in Metrics

Render provides:
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

### Custom Monitoring

Add to your backend:

```python
# app/main.py
from fastapi import FastAPI
import time

@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

---

## 🔄 Backup & Recovery

### Database Backups

Render automatically backs up PostgreSQL:
- **Starter Plan**: Daily backups (7 days retention)
- **Pro Plan**: Daily backups (30 days retention)

### Manual Backup

```bash
# Download backup from Render dashboard
# Or use pg_dump
pg_dump $DATABASE_URL > backup.sql
```

### Restore from Backup

1. Go to Database service
2. Click "Backups" tab
3. Select backup
4. Click "Restore"

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **GuardFlow Support**: support@guardflow.dev
- **Discord**: https://discord.gg/guardflow

---

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Redis instance created
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Environment variables configured
- [ ] CORS origins updated
- [ ] Health checks passing
- [ ] First user created
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Backups configured

---

**Your GuardFlow Studio is now live on Render! 🎉**
