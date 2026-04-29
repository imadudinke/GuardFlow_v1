from typing import Optional
from uuid import UUID
from app.schemas.base import BaseSchema, BaseDBSchema


class ProjectBase(BaseSchema):
    name: str


class ProjectCreate(ProjectBase):
    user_id: UUID


class ProjectUpdate(BaseSchema):
    name: Optional[str] = None
    hard_ban_enabled: Optional[bool] = None


class Project(BaseDBSchema, ProjectBase):
    api_key: str
    hard_ban_enabled: bool
    blocked_today: int = 0
    user_id: UUID
