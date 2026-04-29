# GuardFlow Authentication System

## What's Been Built

A complete authentication system with JWT tokens stored in HTTP-only cookies, featuring modern UI and secure backend practices.

## Features

### Backend (FastAPI)
- ✅ JWT token-based authentication
- ✅ HTTP-only cookie storage (secure against XSS)
- ✅ Bcrypt password hashing
- ✅ Login endpoint (`/api/v1/auth/login`)
- ✅ Register endpoint (`/api/v1/auth/register`)
- ✅ Logout endpoint (`/api/v1/auth/logout`)
- ✅ Get current user endpoint (`/api/v1/auth/me`)
- ✅ Protected route dependencies
- ✅ 7-day token expiration

### Frontend (Next.js + React)
- ✅ Beautiful login page with gradient background
- ✅ Registration page with password confirmation
- ✅ Protected dashboard with auto-redirect
- ✅ Global auth context with React hooks
- ✅ Loading states and error handling
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support
- ✅ Automatic authentication checking

## Quick Start

### 1. Backend Setup
```bash
cd studio/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

### 2. Frontend Setup
```bash
cd studio/frontend
npm install
npm run dev
```

### 3. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## File Structure

### Backend Files Created/Modified
```
studio/backend/
├── app/
│   ├── api/
│   │   ├── __init__.py (modified - added auth router)
│   │   └── auth.py (new - login/register/logout endpoints)
│   └── core/
│       ├── auth.py (new - authentication dependencies)
│       └── security.py (new - JWT token handling)
├── requirements.txt (modified - added python-jose)
└── AUTH_SETUP.md (new - detailed setup guide)
```

### Frontend Files Created/Modified
```
studio/frontend/
├── app/
│   ├── login/
│   │   └── page.tsx (new - login UI)
│   ├── register/
│   │   └── page.tsx (new - registration UI)
│   ├── layout.tsx (modified - added AuthProvider)
│   └── page.tsx (modified - protected dashboard)
└── contexts/
    └── AuthContext.tsx (modified - full auth state management)
```

## Usage Examples

### Register a New User
1. Navigate to http://localhost:3000/register
2. Enter email and password (min 8 characters)
3. Click "Create Account"
4. Automatically redirected to dashboard

### Login
1. Navigate to http://localhost:3000/login
2. Enter credentials
3. Click "Sign In"
4. Redirected to dashboard with session active

### Logout
1. Click "Logout" button in navigation
2. Cookie cleared, redirected to login

## Security Best Practices Implemented

1. **Password Security**
   - Minimum 8 characters
   - Bcrypt hashing with salt
   - SHA256 pre-hash for long passwords

2. **Token Security**
   - HTTP-only cookies (no JavaScript access)
   - 7-day expiration
   - Signed with SECRET_KEY

3. **API Security**
   - CORS configured with credentials
   - Protected route dependencies
   - Proper error handling

4. **Frontend Security**
   - No token storage in localStorage
   - Automatic auth checking
   - Protected routes with redirects

## API Testing

### Using cURL
```bash
# Register
curl -X POST http://localhost:8001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get current user
curl http://localhost:8001/api/v1/auth/me -b cookies.txt

# Logout
curl -X POST http://localhost:8001/api/v1/auth/logout -b cookies.txt
```

### Using the Interactive API Docs
Visit http://localhost:8001/docs for Swagger UI

## Next Steps

1. **Generate a secure SECRET_KEY**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Add to `.env` file

2. **Test the authentication flow**
   - Register a new user
   - Login with credentials
   - Access protected dashboard
   - Logout

3. **Customize the UI**
   - Update colors in Tailwind classes
   - Add your logo
   - Modify form fields

4. **Add more features**
   - Email verification
   - Password reset
   - Remember me option
   - 2FA authentication
   - Social login

## Troubleshooting

### Cookie not being set
- Check CORS configuration in `app/main.py`
- Ensure `credentials: "include"` in fetch calls
- Verify backend is running on correct port

### Authentication not persisting
- Check browser cookie settings
- Verify `httponly` and `samesite` settings
- Check token expiration

### CORS errors
- Ensure backend allows frontend origin
- Check `allow_credentials=True` in CORS middleware
- Verify fetch includes `credentials: "include"`

## Production Checklist

- [ ] Generate strong SECRET_KEY
- [ ] Set `secure=True` for cookies (HTTPS only)
- [ ] Configure specific CORS origins (not "*")
- [ ] Add rate limiting on auth endpoints
- [ ] Enable HTTPS
- [ ] Add refresh token mechanism
- [ ] Implement account lockout
- [ ] Add email verification
- [ ] Set up monitoring and logging
- [ ] Add CSRF protection
