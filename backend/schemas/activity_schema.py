from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid


class ActivityResponse(BaseModel):
    user_id: uuid.UUID
    game_id: uuid.UUID
    last_score: Optional[float]
    best_score: Optional[float]
    last_played: Optional[datetime]

    model_config = {"from_attributes": True}


class ActivityCreate(BaseModel):
    user_session_id: uuid.UUID
    score: Optional[float]