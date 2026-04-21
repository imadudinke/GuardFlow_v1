from typing import Optional
from uuid import UUID
from app.schemas.base import BaseSchema, BaseDBSchema


class ProjectBase(BaseSchema):
    name: str


class ProjectCreate(ProjectBase):
    user_id: UUID


class ProjectUpdate(BaseSchema):
    name: Optional[str] = None


class Project(BaseDBSchema, ProjectBase):
    api_key: str
    user_id: UUID
