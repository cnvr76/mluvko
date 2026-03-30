import uuid
from sqlalchemy import Column, Text, Enum as SQLEnum, ForeignKey, Integer, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from config.database_config import Base
from enum import Enum


class AgeGroups(str, Enum):
    JUNIOR = "2-4 roky"
    MIDDLE = "5-6 rokov"


class VersionStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    PUBLISHED = "published"
    REJECTED = "rejected"
    ARCHIVED = "archived"
    
    @property
    def is_unpublished(self) -> bool:
        return self != VersionStatus.PUBLISHED


version_statuses_enum: SQLEnum = SQLEnum(VersionStatus, name="version_statuses", values_callable=lambda items: [enum.value for enum in items])


class Snapshot(Base):
    __tablename__ = "snapshots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id = Column(UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    version = Column(Integer, nullable=False, default=1)
    
    name = Column(Text, nullable=False)
    game_type = Column(Text, nullable=False)
    description = Column(Text)
    preview_image_url = Column(Text)
    age_group = Column(Text, nullable=False)
    config_data = Column(JSONB, nullable=False)
    
    status = Column(version_statuses_enum, nullable=False, default=VersionStatus.DRAFT.value)
    admin_feedback = Column(Text)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    game = relationship("Game", foreign_keys=[game_id], back_populates="versions")