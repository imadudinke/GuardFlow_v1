# GuardFlow Studio - Quick Start Guide

Get GuardFlow Studio running in under 5 minutes!

## 🚀 Quick Deploy

### 1. Clone Repository
```bash
git clone https://github.com/guardflow/guardflow.git
cd guardflow
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Generate secure secret key
openssl rand -hex 32

# Edit .env and update:
# - SECRET_KEY (use generated key above)
# - POSTGRES_PASSWORD (use a strong password)
# - CORS_ORIGINS (your frontend URL)
nano .env
```

### 3. Deploy
```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy (development)
./deploy.sh development

# Or deploy manually
docker-compose up -d
```

### 4. Access Studio
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

### 5. Create First User
Visit http://localhost:3000/register and create your account!

---

## 📦 What Gets Deployed

The deployment includes:
- ✅ PostgreSQL database (port 5432)
- ✅ Redis cache (port 6379)
- ✅ Backend API (port 8001)
- ✅ Frontend dashboard (port 3000)

---

## 🔧 Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Check status
docker-compose ps

# Access backend shell
docker-compose exec backend bash

# Run migrations
docker-compose exec backend alembic upgrade head
```

---

## 🎯 Next Steps

1. **Create a Project**
   - Login to dashboard
   - Go to Projects page
   - Click "Create Project"
   - Copy your API key

2. **Install SDK**
   ```bash
   pip install guardflow-fastapi
   ```

3. **Protect Your App**
   ```python
   from fastapi import FastAPI
   from guardflow import GuardFlowMiddleware

   app = FastAPI()

   app.add_middleware(
       GuardFlowMiddleware,
       api_key="your_api_key_here",
       studio_url="http://localhost:8001",
       redis_url="redis://localhost:6379"
   )
   ```

4. **Monitor Threats**
   - Visit http://localhost:3000/threats
   - See real-time threat detection
   - Analyze attack patterns

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
BACKEND_PORT=8002
FRONTEND_PORT=3001
POSTGRES_PORT=5433
REDIS_PORT=6380

# Restart
docker-compose down
docker-compose up -d
```

### Database Connection Error
```bash
# Wait for database to be ready
docker-compose logs postgres

# Manually run migrations
docker-compose exec backend alembic upgrade head
```

### Frontend Can't Connect to Backend
```bash
# Check NEXT_PUBLIC_API_URL in .env
# Should be: http://localhost:8001

# Restart frontend
docker-compose restart frontend
```

---

## 📚 Documentation

- **Full Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **SDK Documentation**: [SDK/README.md](SDK/README.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

---

## 💬 Support

- **Issues**: https://github.com/guardflow/guardflow/issues
- **Discord**: https://discord.gg/guardflow
- **Email**: support@guardflow.dev

---

**Ready to protect your applications? Let's go! 🛡️**
