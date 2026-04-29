from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.db import get_db
from app.core.security import create_access_token
from app.schemas.user import UserCreate, User
from app.services import user as user_service
from app.core.auth import get_current_user

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    user: User
    message: str


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, response: Response, db: Session = Depends(get_db)):
    """Register a new user and set access token in cookie"""
    db_user = user_service.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = user_service.create_user(db=db, user=user_data)
    
    # Create access token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    
    # Set cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return AuthResponse(user=new_user, message="Registration successful")


@router.post("/login", response_model=AuthResponse)
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Login user and set access token in cookie"""
    user = user_service.get_user_by_email(db, email=login_data.email)
    
    if not user or not user_service.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # Set cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return AuthResponse(user=user, message="Login successful")


@router.post("/logout")
def logout(response: Response):
    """Logout user by clearing the access token cookie"""
    response.delete_cookie(key="access_token")
    return {"message": "Logout successful"}


@router.get("/me", response_model=User)
def get_me(current_user = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user
