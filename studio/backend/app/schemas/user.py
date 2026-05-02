from pydantic import EmailStr, field_validator
from typing import Optional
from app.schemas.base import BaseSchema, BaseDBSchema


class UserBase(BaseSchema):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    password: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if len(v) > 128:
            raise ValueError('Password must be less than 128 characters')
        return v


class UserUpdate(BaseSchema):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(BaseDBSchema, UserBase):
    hashed_password: str


class User(BaseDBSchema, UserBase):
    plan_tier: str
    google_sub: Optional[str] = None
    email_verified: bool = False
