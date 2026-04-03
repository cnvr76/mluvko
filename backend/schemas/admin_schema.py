from pydantic import BaseModel, Field, model_validator
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from schemas.snapshot_schema import SnapshotBriefResponse


class AdminFeedbackRequest(BaseModel):
    reason: str = Field(..., min_length=3, description="Reason for revoking or rollback")
    
    
class AdminDashboardGameResponse(BaseModel):
    id: UUID
    author_name: Optional[str] = None
    published_version_id: Optional[UUID] = None
    created_at: datetime

    versions: list[SnapshotBriefResponse] = []

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def extract_author(cls, data: Any) -> Any:
        if hasattr(data, "author") and data.author:
            data.author_name = data.author.username
        return data