from pydantic import BaseModel
from typing import Optional, Any
import uuid
from models import AgeGroups, GameStatus
from schemas import ActivityResponse


class GameBriefResponse(BaseModel):
    id: uuid.UUID
    name: str
    preview_image_url: Optional[str]
    game_type: str
    activities: list[ActivityResponse]
    status: GameStatus

    model_config = {"from_attributes": True}


class GameResponse(GameBriefResponse):
    author_id: uuid.UUID
    description: Optional[str]
    age_group: AgeGroups
    config_data: dict[str, Any]

    model_config = {"from_attributes": True}


class GameCreate(BaseModel):
    name: str
    description: Optional[str]
    preview_image_url: Optional[str]
    age_group: AgeGroups
    game_type: str
    config_data: dict[str, Any]