from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid


class ActivityResponse(BaseModel):
    user_id: uuid.UUID
    game_id: uuid.UUID
    last_score: Optional[float] = None
    best_score: Optional[float] = None
    last_played: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ActivityCreate(BaseModel):
    score: Optional[float] = None