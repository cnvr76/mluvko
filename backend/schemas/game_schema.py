from pydantic import BaseModel, model_validator
from typing import Optional, Any
import uuid
from models import AgeGroups, VersionStatus
from schemas import ActivityResponse
from datetime import datetime
from schemas.snapshot_schema import SnapshotBriefResponse


class GameBriefResponse(BaseModel):
    id: uuid.UUID
    name: str
    preview_image_url: Optional[str] = None
    game_type: str
    age_group: AgeGroups
    activities: list[ActivityResponse] = []
    status: VersionStatus

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def flatten_snapshot(cls, data: Any) -> Any:
        if hasattr(data, "published_version") and data.published_version:
            return {
                "id": data.id,
                "author_id": data.author_id,
                "activities": data.activities if hasattr(data, "activities") else [],
                # users (if author exists)
                "author_name": data.author.username if hasattr(data, "author") and data.author else None,
                # from snapshot
                "name": data.published_version.name,
                "preview_image_url": data.published_version.preview_image_url,
                "game_type": data.published_version.game_type,
                "status": data.published_version.status,
                "description": data.published_version.description,
                "age_group": data.published_version.age_group,
                "config_data": data.published_version.config_data
            }
        return data


class GameResponse(GameBriefResponse):
    author_id: Optional[uuid.UUID] = None
    author_name: Optional[str] = None
    description: Optional[str] = None
    age_group: AgeGroups
    config_data: dict[str, Any]

    model_config = {"from_attributes": True}


class GameUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    preview_image_url: Optional[str] = None
    age_group: Optional[AgeGroups] = None
    game_type: Optional[str] = None
    config_data: Optional[dict[str, Any]] = None
    
    
class AuthorGameResponse(BaseModel):
    id: uuid.UUID
    published_version_id: Optional[uuid.UUID] = None
    created_at: datetime
    versions: list[SnapshotBriefResponse] = []
    
    model_config = {"from_attributes": True}