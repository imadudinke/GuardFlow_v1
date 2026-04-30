# GuardFlow Studio - Deployment Guide

Complete guide for deploying GuardFlow Studio to production.

## 📋 Prerequisites

- Docker & Docker Compose installed
- Domain name (optional, for production)
- SSL certificate (recommended for production)
- Minimum 2GB RAM, 2 CPU cores
- 20GB disk space

---

## 🚀 Quick Start (Development)

### 1. Clone Repository
```bash
git clone https://github.com/guardflow/guardflow.git
cd guardflow
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 4. Access Studio
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

---

## 🏭 Production Deployment

### 1. Environment Configuration

Create `.env` file with production values:

```bash
# Database
DATABASE_URL=postgresql://guardflow:STRONG_PASSWORD@postgres:5432/guardflow_db
POSTGRES_USER=guardflow
POSTGRES_PASSWORD=STRONG_PASSWORD
POSTGRES_DB=guardflow_db

# Redis
REDIS_URL=redis://:REDIS_PASSWORD@redis:6379
REDIS_PASSWORD=STRONG_REDIS_PASSWORD

# Backend Security
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (your frontend domain)
CORS_ORIGINS=https://studio.yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Environment
ENVIRONMENT=production

# Ports
BACKEND_PORT=8001
FRONTEND_PORT=3000
POSTGRES_PORT=5432
REDIS_PORT=6379
```

### 2. Deploy with Production Compose

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check health
docker-compose -f docker-compose.prod.yml ps
```

### 3. Run Database Migrations

```bash
# Migrations run automatically on backend startup
# Or run manually:
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### 4. Create Admin User

```bash
# Access backend container
docker-compose -f docker-compose.prod.yml exec backend bash

# Create admin user (inside container)
python -c "
from app.core.db import SessionLocal
from app.services.user import create_user
from app.schemas.user import UserCreate

db = SessionLocal()
user = create_user(
    db,
    UserCreate(
        email='admin@yourdomain.com',
        password='STRONG_PASSWORD',
        full_name='Admin User'
    )
)
print(f'Admin user created: {user.email}')
"
```

---

## 🌐 Reverse Proxy Setup (Nginx)

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/guardflow

# Frontend
server {
    listen 80;
    server_name studio.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name studio.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://studio.yourdomain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### Enable Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/guardflow /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d studio.yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## ☁️ Cloud Deployment Options

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t guardflow-backend -f studio/backend/Dockerfile.prod studio/backend
docker tag guardflow-backend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/guardflow-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/guardflow-backend:latest

# Build and push frontend
docker build -t guardflow-frontend -f studio/frontend/Dockerfile.prod studio/frontend
docker tag guardflow-frontend:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/guardflow-frontend:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/guardflow-frontend:latest
```

2. **Create RDS PostgreSQL instance**
3. **Create ElastiCache Redis cluster**
4. **Deploy ECS services with task definitions**

### DigitalOcean Deployment

1. **Create Droplet** (2GB RAM minimum)
2. **Install Docker**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Clone and deploy**
```bash
git clone https://github.com/guardflow/guardflow.git
cd guardflow
cp .env.example .env
# Edit .env
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel (Frontend Only)

```bash
cd studio/frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Database Backup

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U guardflow guardflow_db > backup_$(date +%Y%m%d).sql

# Restore
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U guardflow guardflow_db < backup_20260430.sql
```

### Update Deployment

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head
```

### Health Checks

```bash
# Backend health
curl http://localhost:8001/health

# Frontend health
curl http://localhost:3000

# Database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U guardflow

# Redis connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

---

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs backend

# Common issues:
# 1. Database not ready - wait for postgres healthcheck
# 2. Migration failed - check DATABASE_URL
# 3. Port conflict - change BACKEND_PORT in .env
```

### Frontend won't connect to backend

```bash
# Check NEXT_PUBLIC_API_URL in .env
# Ensure CORS_ORIGINS includes frontend URL
# Check backend is accessible from frontend container
docker-compose -f docker-compose.prod.yml exec frontend curl http://backend:8001/health
```

### Database connection issues

```bash
# Check DATABASE_URL format
# postgresql://user:password@host:port/database

# Test connection
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.core.db import engine
try:
    engine.connect()
    print('✅ Database connected')
except Exception as e:
    print(f'❌ Database error: {e}')
"
```

### Redis connection issues

```bash
# Check REDIS_URL format
# redis://:password@host:port

# Test connection
docker-compose -f docker-compose.prod.yml exec backend python -c "
import redis
r = redis.from_url('redis://redis:6379')
print(r.ping())
"
```

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Set CORS_ORIGINS to specific domains
- [ ] Disable API docs in production (automatic)
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables for secrets
- [ ] Restrict database/redis to localhost
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerting

---

## 📞 Support

- Documentation: https://docs.guardflow.dev
- Issues: https://github.com/guardflow/guardflow/issues
- Discord: https://discord.gg/guardflow
- Email: support@guardflow.dev

---

**Built with ❤️ by the GuardFlow Team**
