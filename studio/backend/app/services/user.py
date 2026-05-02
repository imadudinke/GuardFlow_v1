from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
import bcrypt
import hashlib

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_password_hash(password: str) -> str:
    # Bcrypt has a 72-byte limit
    # If password is too long, hash it with SHA256 first
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        # Pre-hash with SHA256 to ensure it fits in 72 bytes
        password_bytes = hashlib.sha256(password_bytes).digest()
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Apply same pre-hashing if password is too long
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = hashlib.sha256(password_bytes).digest()
    
    return bcrypt.checkpw(password_bytes, hashed_password.encode('utf-8'))


def get_user(db: Session, user_id: UUID) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        plan_tier="Free",
        hashed_password=hashed_password,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_google_sub(db: Session, google_sub: str) -> Optional[User]:
    return db.query(User).filter(User.google_sub == google_sub).first()


def create_google_user(
    db: Session,
    *,
    email: str,
    full_name: Optional[str],
    google_sub: str,
    email_verified: bool,
) -> User:
    db_user = User(
        email=email,
        full_name=full_name,
        plan_tier="Free",
        hashed_password=None,
        google_sub=google_sub,
        email_verified=email_verified,
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def link_google_account(
    db: Session,
    *,
    user: User,
    google_sub: str,
    email_verified: bool,
    full_name: Optional[str],
) -> User:
    user.google_sub = google_sub
    if email_verified:
        user.email_verified = True
    if not user.full_name and full_name:
        user.full_name = full_name
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: UUID, user: UserUpdate) -> Optional[User]:
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: UUID) -> bool:
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True
