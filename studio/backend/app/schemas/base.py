from pydantic import BaseModel as PydanticBaseModel, ConfigDict
from uuid import UUID


class BaseSchema(PydanticBaseModel):
    """Base schema with common configuration"""
    model_config = ConfigDict(from_attributes=True)


class BaseDBSchema(BaseSchema):
    """Base schema for database models with common fields"""
    id: UUID
