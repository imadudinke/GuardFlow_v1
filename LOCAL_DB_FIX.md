# Local Database Connection Fix

## Problem
The backend was trying to connect to `studio_db` hostname, but the Docker Compose service is named `postgres`.

## Solution Applied
Updated `.env` file to use the correct database configuration for local Docker setup.

## Changes Made

### Updated `.env` file:
```env
DATABASE_URL=postgresql://guardflow:changeme@postgres:5432/guardflow_db
```

**Key Points:**
- Hostname: `postgres` (matches docker-compose.yml service name)
- User: `guardflow` (matches POSTGRES_USER in docker-compose.yml)
- Password: `changeme` (matches POSTGRES_PASSWORD in docker-compose.yml)
- Database: `guardflow_db` (matches POSTGRES_DB in docker-compose.yml)

## How to Restart Services

### Option 1: Restart All Services
```bash
docker compose down
docker compose up -d
```

### Option 2: Restart Only Backend
```bash
docker compose restart backend
```

### Option 3: View Logs
```bash
# View all logs
docker compose logs -f

# View only backend logs
docker compose logs -f backend

# View only database logs
docker compose logs -f postgres
```

## Verify Database Connection

After restarting, check if the backend connects successfully:

```bash
docker compose logs backend | grep -i "database\|connection\|error"
```

You should see successful database connection messages and no more "could not translate host name" errors.

## Database Access

If you need to access the database directly:

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U guardflow -d guardflow_db

# List all tables
\dt

# Check if migrations ran
SELECT * FROM alembic_version;

# Exit
\q
```

## Troubleshooting

### If backend still can't connect:
1. Make sure all containers are running:
   ```bash
   docker compose ps
   ```

2. Check if postgres is healthy:
   ```bash
   docker compose ps postgres
   ```

3. Recreate containers with fresh database:
   ```bash
   docker compose down -v  # WARNING: This deletes all data!
   docker compose up -d
   ```

### If you want to use a different database:
- **Render PostgreSQL**: Update DATABASE_URL to your Render connection string
- **Local PostgreSQL (not Docker)**: Use `localhost:5432` instead of `postgres:5432`

## Current Configuration

**Docker Services:**
- PostgreSQL: `localhost:5432` (external) / `postgres:5432` (internal)
- Redis: `localhost:6379` (external) / `redis:6379` (internal)
- Backend: `localhost:8001`
- Frontend: `localhost:3000`

**Database Credentials:**
- User: `guardflow`
- Password: `changeme`
- Database: `guardflow_db`
