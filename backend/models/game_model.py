import uuid
from sqlalchemy import Column, Text, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from config.database_config import Base
from enum import Enum


class GameStatuses(str, Enum):
    PRIVATE = "private"
    PENDING = "pending"
    PUBLISHED = "published"


class AgeGroups(str, Enum):
    JUNIOR = "2-4 roky"
    MIDDLE = "5-6 rokov"


game_statuses_enum: SQLEnum = SQLEnum(GameStatuses, name="statuses", values_callable=lambda items: [enum.value for enum in items])


class Game(Base):
    __tablename__ = "games"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(Text, nullable=False)
    description = Column(Text)
    preview_image_url = Column(Text)
    age_group = Column(Text, nullable=False)
    game_type = Column(Text, nullable=False)
    status = Column(game_statuses_enum, nullable=False, default=GameStatuses.PRIVATE.value)
    config_data = Column(JSONB, nullable=False)

    activities = relationship("Activity", back_populates="game")
    user = relationship("User", back_populates="games")