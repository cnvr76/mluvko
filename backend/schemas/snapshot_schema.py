from pydantic import BaseModel, model_validator
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from models import VersionStatus
from schemas.activity_schema import ActivityResponse


class DraftInitResponse(BaseModel):
    game_id: UUID
    snapshot_id: UUID


class SnapshotBriefResponse(BaseModel):
    id: UUID
    version: int
    name: str
    status: VersionStatus
    game_type: str
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
    
    
class SnapshotTestingResponse(BaseModel):
    id: UUID
    name: str
    preview_image_url: Optional[str] = None
    game_type: str
    age_group: str
    activities: list[ActivityResponse] = []
    status: str
    is_favorite: bool = False
    author_id: UUID
    author_name: str
    description: Optional[str] = None
    config_data: dict

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def flatten_snapshot_data(cls, data: Any) -> Any:
        # data здесь — это объект модели Snapshot
        # Мы имитируем структуру GameBriefResponse, как в оригинальном файле
        if hasattr(data, "game") and data.game:
            return {
                "id": data.game.id,
                "author_id": data.game.author_id,
                "author_name": data.game.author.username if data.game.author else None,
                "activities": data.game.activities if hasattr(data.game, "activities") else [],
                "is_favorite": False, # В режиме теста избранное всегда false
                "name": data.name,
                "preview_image_url": data.preview_image_url,
                "game_type": data.game_type,
                "status": data.status,
                "description": data.description,
                "age_group": data.age_group,
                "config_data": data.config_data
            }
        return data