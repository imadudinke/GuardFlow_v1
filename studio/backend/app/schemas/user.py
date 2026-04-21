from pydantic import EmailStr
from typing import Optional
from app.schemas.base import BaseSchema, BaseDBSchema


class UserBase(BaseSchema):
    email: EmailStr
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseSchema):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserInDB(BaseDBSchema, UserBase):
    hashed_password: str


class User(BaseDBSchema, UserBase):
    pass
