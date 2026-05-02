from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Query, Cookie
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from fastapi.responses import RedirectResponse
import os
import base64
import hashlib
import secrets
from urllib.parse import urlencode
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.db import get_db
from app.core.security import create_access_token, verify_token
from app.schemas.user import UserCreate, User, UserUpdate
from app.services import user as user_service
from app.core.auth import get_current_user

router = APIRouter()
GOOGLE_OAUTH_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
OAUTH_STATE_COOKIE = "oauth_google_state"
OAUTH_PKCE_COOKIE = "oauth_google_pkce"
OAUTH_NEXT_COOKIE = "oauth_google_next"


def _cookie_options() -> dict:
    """
    Build cookie flags for auth in both local and deployed environments.
    Cross-site frontend/backend deployments need SameSite=None + Secure=True.
    """
    environment = os.getenv("ENVIRONMENT", "development").lower()
    configured_samesite = os.getenv("COOKIE_SAMESITE", "").strip().lower()
    cookie_domain = os.getenv("COOKIE_DOMAIN", "").strip() or None

    # Default to cross-site safe behavior in production-like environments.
    if configured_samesite not in {"lax", "strict", "none"}:
        configured_samesite = "none" if environment == "production" else "lax"

    secure = os.getenv("COOKIE_SECURE", "").strip().lower()
    if secure in {"1", "true", "yes"}:
        secure_cookie = True
    elif secure in {"0", "false", "no"}:
        secure_cookie = False
    else:
        secure_cookie = configured_samesite == "none" or environment == "production"

    # Browsers require Secure when SameSite=None.
    if configured_samesite == "none":
        secure_cookie = True

    return {
        "httponly": True,
        "secure": secure_cookie,
        "samesite": configured_samesite,
        "path": "/",
        "domain": cookie_domain,
        "max_age": 60 * 60 * 24 * 7,  # 7 days
    }


def _oauth_cookie_options() -> dict:
    options = _cookie_options().copy()
    options["max_age"] = 60 * 10
    return options


def _frontend_origin() -> str:
    return os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")


def _safe_next_path(next_path: str | None) -> str:
    if not next_path:
        return "/dashboard"
    if not next_path.startswith("/") or next_path.startswith("//"):
        return "/dashboard"
    return next_path


def _frontend_redirect(next_path: str, error: str | None = None) -> str:
    destination = f"{_frontend_origin()}{_safe_next_path(next_path)}"
    if error:
        return f"{destination}?{urlencode({'error': error})}"
    return destination


def _google_client_config() -> tuple[str, str, str]:
    client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "").strip()
    if not client_id or not client_secret or not redirect_uri:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth is not configured",
        )
    return client_id, client_secret, redirect_uri


def _set_auth_cookie(response: Response, user_id: str) -> None:
    access_token = create_access_token(data={"sub": user_id})
    response.set_cookie(key="access_token", value=access_token, **_cookie_options())


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: User
    message: str


class ProfileUpdateRequest(BaseModel):
    email: EmailStr
    full_name: str | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.get("/google/login")
def google_login(next: str = Query("/dashboard")):
    client_id, _, redirect_uri = _google_client_config()
    state = secrets.token_urlsafe(32)
    code_verifier = secrets.token_urlsafe(64)
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode("utf-8")).digest()
    ).decode("utf-8").rstrip("=")
    next_path = _safe_next_path(next)

    response = RedirectResponse(
        url=(
            f"{GOOGLE_OAUTH_AUTHORIZE_URL}?"
            f"{urlencode({'client_id': client_id, 'redirect_uri': redirect_uri, 'response_type': 'code', 'scope': 'openid email profile', 'state': state, 'code_challenge': code_challenge, 'code_challenge_method': 'S256', 'prompt': 'select_account'})}"
        ),
        status_code=status.HTTP_302_FOUND,
    )
    oauth_cookie_options = _oauth_cookie_options()
    response.set_cookie(OAUTH_STATE_COOKIE, state, **oauth_cookie_options)
    response.set_cookie(OAUTH_PKCE_COOKIE, code_verifier, **oauth_cookie_options)
    response.set_cookie(OAUTH_NEXT_COOKIE, next_path, **oauth_cookie_options)
    return response


@router.get("/google/callback")
async def google_callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
    oauth_state: str | None = Cookie(None, alias=OAUTH_STATE_COOKIE),
    oauth_pkce: str | None = Cookie(None, alias=OAUTH_PKCE_COOKIE),
    oauth_next: str | None = Cookie(None, alias=OAUTH_NEXT_COOKIE),
):
    next_path = _safe_next_path(oauth_next)
    response = RedirectResponse(url=_frontend_redirect(next_path), status_code=status.HTTP_302_FOUND)
    oauth_cookie_options = _oauth_cookie_options()
    response.delete_cookie(OAUTH_STATE_COOKIE, path=oauth_cookie_options["path"], domain=oauth_cookie_options["domain"])
    response.delete_cookie(OAUTH_PKCE_COOKIE, path=oauth_cookie_options["path"], domain=oauth_cookie_options["domain"])
    response.delete_cookie(OAUTH_NEXT_COOKIE, path=oauth_cookie_options["path"], domain=oauth_cookie_options["domain"])

    if error or not code or not state:
        response.headers["Location"] = _frontend_redirect(next_path, "google_auth_failed")
        return response
    if not oauth_state or state != oauth_state or not oauth_pkce:
        response.headers["Location"] = _frontend_redirect(next_path, "invalid_oauth_state")
        return response

    client_id, client_secret, redirect_uri = _google_client_config()
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            token_response = await client.post(
                GOOGLE_OAUTH_TOKEN_URL,
                data={
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri,
                    "code_verifier": oauth_pkce,
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
        token_response.raise_for_status()
        token_payload = token_response.json()
        raw_id_token = token_payload.get("id_token")
        if not raw_id_token:
            response.headers["Location"] = _frontend_redirect(next_path, "missing_id_token")
            return response

        id_info = id_token.verify_oauth2_token(raw_id_token, google_requests.Request(), client_id)
        if id_info.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
            response.headers["Location"] = _frontend_redirect(next_path, "invalid_issuer")
            return response

        email = id_info.get("email")
        if not email or not id_info.get("email_verified"):
            response.headers["Location"] = _frontend_redirect(next_path, "email_not_verified")
            return response

        google_sub = id_info.get("sub")
        if not google_sub:
            response.headers["Location"] = _frontend_redirect(next_path, "invalid_google_subject")
            return response

        full_name = id_info.get("name")
        user = user_service.get_user_by_google_sub(db, google_sub=google_sub)
        if user is None:
            user = user_service.get_user_by_email(db, email=email)
            if user is None:
                user = user_service.create_google_user(
                    db,
                    email=email,
                    full_name=full_name,
                    google_sub=google_sub,
                    email_verified=True,
                )
            else:
                user = user_service.link_google_account(
                    db,
                    user=user,
                    google_sub=google_sub,
                    email_verified=True,
                    full_name=full_name,
                )

        if not user.is_active:
            response.headers["Location"] = _frontend_redirect(next_path, "inactive_user")
            return response

        _set_auth_cookie(response, str(user.id))
        return response
    except Exception:
        response.headers["Location"] = _frontend_redirect(next_path, "google_auth_failed")
        return response


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = user_service.get_user_by_email(db, email=user_data.email)
    if db_user:
        if db_user.google_sub and not db_user.hashed_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account already exists with Google. Use Google sign in.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = user_service.create_user(db=db, user=user_data)
    _set_auth_cookie(response, str(new_user.id))
    return AuthResponse(user=new_user, message="Registration successful")


@router.post("/login", response_model=AuthResponse)
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = user_service.get_user_by_email(db, email=login_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google sign in",
        )

    if not user_service.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    _set_auth_cookie(response, str(user.id))
    return AuthResponse(user=user, message="Login successful")


@router.post("/logout")
def logout(response: Response):
    options = _cookie_options()
    response.delete_cookie(
        key="access_token",
        path=options["path"],
        domain=options["domain"],
        secure=options["secure"],
        httponly=options["httponly"],
        samesite=options["samesite"],
    )
    return {"message": "Logout successful"}


@router.get("/me", response_model=User)
def get_me(current_user = Depends(get_current_user)):
    return current_user


@router.get("/debug-cookie")
def debug_cookie(request: Request):
    """
    Debug helper for cross-site auth cookie behavior.
    Enable temporarily with AUTH_DEBUG_COOKIE=true.
    """
    if os.getenv("AUTH_DEBUG_COOKIE", "false").strip().lower() != "true":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    access_token = request.cookies.get("access_token")
    token_valid = False
    token_sub = None

    if access_token:
        try:
            payload = verify_token(access_token)
            token_valid = True
            token_sub = payload.get("sub")
        except HTTPException:
            token_valid = False

    return {
        "has_access_token_cookie": bool(access_token),
        "token_valid": token_valid,
        "token_sub": token_sub,
        "cookie_settings": _cookie_options(),
        "request_origin": request.headers.get("origin"),
        "request_host": request.headers.get("host"),
        "user_agent": request.headers.get("user-agent"),
    }


@router.patch("/me", response_model=User)
def update_me(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Update the current user's basic profile"""
    existing_user = user_service.get_user_by_email(db, email=payload.email)
    if existing_user and existing_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    updated_user = user_service.update_user(
        db,
        user_id=current_user.id,
        user=UserUpdate(email=payload.email, full_name=payload.full_name),
    )
    if updated_user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return updated_user


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password login is not enabled for this account",
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long",
        )

    if not user_service.verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    user_service.update_user(
        db,
        user_id=current_user.id,
        user=UserUpdate(password=payload.new_password),
    )
    return {"message": "Password updated successfully"}
