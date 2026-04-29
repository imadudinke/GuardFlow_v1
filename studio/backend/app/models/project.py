from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.core.db import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    api_key = Column(String, unique=True, index=True) # The "gf_live_..." key
    hard_ban_enabled = Column(Boolean, nullable=False, default=True, server_default="true")
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
