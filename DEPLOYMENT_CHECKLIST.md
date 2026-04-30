# GuardFlow Studio - Deployment Checklist

Complete checklist for deploying GuardFlow Studio to production.

## ✅ Pre-Deployment Checklist

### Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Generate secure `SECRET_KEY` (32+ characters)
- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Set strong `REDIS_PASSWORD` (for production)
- [ ] Configure `DATABASE_URL` with production database
- [ ] Configure `REDIS_URL` with production Redis
- [ ] Set `CORS_ORIGINS` to your frontend domain
- [ ] Set `NEXT_PUBLIC_API_URL` to your backend domain
- [ ] Set `ENVIRONMENT=production`

### Security
- [ ] All default passwords changed
- [ ] SECRET_KEY is unique and secure
- [ ] Database credentials are strong
- [ ] Redis password is set (production)
- [ ] CORS origins are restricted
- [ ] API docs disabled in production (automatic)
- [ ] HTTPS/SSL certificates obtained
- [ ] Firewall configured (ports 80, 443, 22 only)

### Infrastructure
- [ ] Domain name registered
- [ ] DNS records configured
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Reverse proxy configured (Nginx)
- [ ] Server meets minimum requirements (2GB RAM, 2 CPU)
- [ ] Docker and Docker Compose installed
- [ ] Sufficient disk space (20GB+)

### Database
- [ ] PostgreSQL 14+ available
- [ ] Database created
- [ ] Backup strategy configured
- [ ] Connection pooling configured (optional)

### Monitoring
- [ ] Log aggregation configured (optional)
- [ ] Monitoring/alerting set up (optional)
- [ ] Health check endpoints tested
- [ ] Backup automation configured

---

## 🚀 Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 2. Clone Repository
```bash
git clone https://github.com/guardflow/guardflow.git
cd guardflow
```

### 3. Configure Environment
```bash
# Copy and edit .env
cp .env.example .env
nano .env

# Generate SECRET_KEY
openssl rand -hex 32
```

### 4. Deploy Services
```bash
# Production deployment
./deploy.sh production

# Or manually
docker-compose -f docker-compose.prod.yml up -d --build
```

### 5. Verify Deployment
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test health endpoints
curl http://localhost:8001/health
curl http://localhost:3000
```

### 6. Configure Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Copy configuration
sudo nano /etc/nginx/sites-available/guardflow

# Enable site
sudo ln -s /etc/nginx/sites-available/guardflow /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Obtain SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d studio.yourdomain.com -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 8. Create Admin User
```bash
# Access backend container
docker-compose -f docker-compose.prod.yml exec backend bash

# Create admin user
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

## 🔍 Post-Deployment Verification

### Functional Tests
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] User registration works
- [ ] User login works
- [ ] Project creation works
- [ ] API key generation works
- [ ] Threat logging works
- [ ] Dashboard displays data
- [ ] WebSocket connections work

### Security Tests
- [ ] HTTPS redirects work
- [ ] CORS is properly configured
- [ ] API authentication required
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] Rate limiting works
- [ ] Sensitive data redacted in logs

### Performance Tests
- [ ] Page load times acceptable
- [ ] API response times < 200ms
- [ ] Database queries optimized
- [ ] Redis caching works
- [ ] WebSocket latency acceptable

---

## 📊 Monitoring Setup

### Health Checks
```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend health
curl https://studio.yourdomain.com

# Database connection
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Redis connection
docker-compose -f docker-compose.prod.yml exec redis redis-cli ping
```

### Log Monitoring
```bash
# View all logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service
docker-compose -f docker-compose.prod.yml logs -f backend

# Search logs
docker-compose -f docker-compose.prod.yml logs backend | grep ERROR
```

### Resource Monitoring
```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Check service health
- [ ] Review error logs
- [ ] Monitor disk space

### Weekly
- [ ] Review security logs
- [ ] Check for updates
- [ ] Verify backups

### Monthly
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Rotate logs
- [ ] Test backup restoration

---

## 🆘 Rollback Plan

### If Deployment Fails
```bash
# Stop new deployment
docker-compose -f docker-compose.prod.yml down

# Restore from backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U guardflow guardflow_db < backup_YYYYMMDD.sql

# Start previous version
git checkout <previous-commit>
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📞 Support Contacts

- **Technical Issues**: support@guardflow.dev
- **Security Issues**: security@guardflow.dev
- **Documentation**: https://docs.guardflow.dev
- **Discord**: https://discord.gg/guardflow

---

## 📝 Deployment Log

| Date | Version | Deployed By | Status | Notes |
|------|---------|-------------|--------|-------|
| YYYY-MM-DD | v1.0.0 | Name | ✅ Success | Initial deployment |
| | | | | |

---

**Remember**: Always test in staging before deploying to production!
