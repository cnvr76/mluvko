from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from models.game_model import AgeGroups
from schemas.activity_schema import ActivityResponse


class GameBriefResponse(BaseModel):
    id: uuid.UUID
    name: str
    preview_image_url: Optional[str]
    activity: List[ActivityResponse]

    model_config = {"from_attributes": True}


class GameResponse(GameBriefResponse):
    description: Optional[str]
    age_group: AgeGroups
    game_type: str
    config_data: Dict[str, Any]

    model_config = {"from_attributes": True}


class GameCreate(BaseModel):
    name: str
    preview_image_url: Optional[str]
    age_group: AgeGroups
    game_type: str
    config_data: Dict[str, Any]