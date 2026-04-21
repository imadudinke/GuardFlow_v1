from pydantic import BaseModel as PydanticBaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class BaseSchema(PydanticBaseModel):
    """Base schema with common configuration"""
    model_config = ConfigDict(from_attributes=True)


class BaseDBSchema(BaseSchema):
    """Base schema for database models with common fields"""
    id: int
    created_at: datetime
    updated_at: datetime


class TimestampMixin(BaseSchema):
    """Mixin for timestamp fields"""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
