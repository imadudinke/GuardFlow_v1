from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    plan_tier = Column(String, nullable=False, default="Free", server_default="Free")
    hashed_password = Column(String, nullable=True)
    google_sub = Column(String, unique=True, index=True, nullable=True)
    email_verified = Column(Boolean, nullable=False, default=False, server_default="false")
    is_active = Column(Boolean, default=True)
