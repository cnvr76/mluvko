from pydantic import BaseModel, Field, model_validator
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from models import VersionStatus


class DraftInitResponse(BaseModel):
    game_id: UUID
    snapshot_id: UUID


class SnapshotBriefResponse(BaseModel):
    id: UUID
    version: int
    name: str
    status: VersionStatus
    admin_feedback: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}
    
    
class SnapshotFullResponse(BaseModel):
    game_id: UUID
    author_id: Optional[UUID] = None
    author_name: Optional[str] = None
    
    snapshot_id: UUID
    published_version_id: Optional[UUID] = None
    version: int
    name: str
    description: Optional[str] = None
    preview_image_url: Optional[str] = None
    age_group: str
    game_type: str
    config_data: dict[str, Any]
    status: VersionStatus
    admin_feedback: Optional[str] = None
    created_at: datetime

    versions: list[SnapshotBriefResponse] = []

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def flatten_data(cls, data: Any) -> Any:
        if hasattr(data, "game") and data.game:
            return {
                "game_id": data.game.id,
                "author_id": data.game.author_id,
                "author_name": data.game.author.username if data.game.author else None,
                
                "snapshot_id": data.id,
                "published_version_id": data.game.published_version_id,
                "version": data.version,
                "name": data.name,
                "description": data.description,
                "preview_image_url": data.preview_image_url,
                "age_group": data.age_group,
                "game_type": data.game_type,
                "config_data": data.config_data,
                "status": data.status,
                "admin_feedback": data.admin_feedback,
                "created_at": data.created_at,
                
                "versions": data.game.versions if hasattr(data.game, "versions") else []
            }
        return data