from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class UserResponse(BaseModel):
    id: uuid.UUID
    user_session_id: uuid.UUID
    username: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: Optional[str]
    user_session_id: uuid.UUID