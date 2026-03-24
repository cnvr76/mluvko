from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid
from models import Role


class UserResponse(BaseModel):
    id: uuid.UUID
    username: Optional[str]
    email: EmailStr
    role: Role
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[Role]