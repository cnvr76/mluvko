import uuid
from sqlalchemy import Column, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from config.database_config import Base
from enum import Enum


class AgeGroups(str, Enum):
    JUNIOR = "2-4 roky"
    MIDDLE = "5-6 rokov"


age_groups_enum: SQLEnum = SQLEnum(AgeGroups, name="age_group", values_callable=lambda items: [enum.value for enum in items])


class Game(Base):
    __tablename__ = "games"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    description = Column(Text)
    preview_image_url = Column(Text)
    age_group = Column(age_groups_enum, nullable=False)
    game_type = Column(Text, nullable=False)
    config_data = Column(JSONB, nullable=False)

    activities = relationship("Activity", back_populates="game")