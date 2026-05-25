import uuid
from sqlalchemy import Column, Text, DateTime, func, Enum as SQLEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from config.database_config import Base
from enum import Enum
from models.user_model import roles_enum


class RoleRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


role_request_statuses_enum: SQLEnum = SQLEnum(RoleRequestStatus, name="role_request_statuses", values_callable=lambda items: [enum.value for enum in items])


class RoleRequest(Base):
    __tablename__ = "role_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    requested_role = Column(roles_enum, nullable=False)

    status = Column(role_request_statuses_enum, nullable=False, default=RoleRequestStatus.PENDING.value)
    admin_feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="role_requests")
