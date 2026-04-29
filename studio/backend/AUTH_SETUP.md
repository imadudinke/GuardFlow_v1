# Authentication Setup Guide

## Overview
This authentication system uses JWT tokens stored in HTTP-only cookies for secure session management.

## Backend Setup

### 1. Install Dependencies
```bash
cd studio/backend
pip install -r requirements.txt
```

### 2. Environment Variables
Add to your `.env` file:
```
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
```

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Run Migrations
```bash
alembic upgrade head
```

### 4. Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd studio/frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Request/Response Examples

#### Register
```bash
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}' \
  -c cookies.txt
```

#### Login
```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}' \
  -c cookies.txt
```

#### Get Current User
```bash
curl http://localhost:8001/api/v1/auth/me -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:8001/api/v1/auth/logout -b cookies.txt
```

## Security Features

1. **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies prevent XSS attacks
2. **Password Hashing**: Bcrypt with salt for secure password storage
3. **JWT Tokens**: Signed tokens with expiration (7 days default)
4. **CORS Configuration**: Credentials enabled for cross-origin requests
5. **Secure Flag**: Enable in production with HTTPS

## Frontend Routes

- `/login` - Login page
- `/register` - Registration page
- `/` - Protected dashboard (requires authentication)

## Authentication Flow

1. User submits credentials to `/auth/login` or `/auth/register`
2. Backend validates credentials and creates JWT token
3. Token stored in HTTP-only cookie with 7-day expiration
4. Frontend automatically includes cookie in subsequent requests
5. Backend validates token on protected routes
6. User can logout to clear the cookie

## Protected Routes

To protect a route, use the `get_current_user` dependency:

```python
from app.core.auth import get_current_user
from app.models.user import User

@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}"}
```

## Production Considerations

1. Set `secure=True` in cookie settings (requires HTTPS)
2. Use a strong SECRET_KEY (32+ characters)
3. Configure proper CORS origins (not "*")
4. Enable rate limiting on auth endpoints
5. Add refresh token mechanism for long-lived sessions
6. Implement account lockout after failed attempts
7. Add email verification
8. Enable 2FA for enhanced security
