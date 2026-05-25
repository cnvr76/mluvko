from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from models import Role, RoleRequestStatus


class RoleRequestResponse(BaseModel):
    id: UUID
    requested_role: Role
    status: RoleRequestStatus
    admin_feedback: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class AdminRoleRequestResponse(BaseModel):
    id: UUID
    user_id: UUID
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    current_role: Optional[Role] = None
    requested_role: Role
    status: RoleRequestStatus
    admin_feedback: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @model_validator(mode='before')
    @classmethod
    def flatten_user(cls, data: Any) -> Any:
        if hasattr(data, "user"):
            return {
                "id": data.id,
                "user_id": data.user_id,
                "username": data.user.username if data.user else None,
                "email": data.user.email if data.user else None,
                "current_role": data.user.role if data.user else None,
                "requested_role": data.requested_role,
                "status": data.status,
                "admin_feedback": data.admin_feedback,
                "created_at": data.created_at,
                "resolved_at": data.resolved_at,
            }
        return data
