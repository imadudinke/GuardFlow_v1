from typing import Optional
from app.schemas.base import BaseSchema, BaseDBSchema


class ProjectBase(BaseSchema):
    name: str


class ProjectCreate(ProjectBase):
    user_id: int


class ProjectUpdate(BaseSchema):
    name: Optional[str] = None


class Project(BaseDBSchema, ProjectBase):
    api_key: str
    user_id: int
