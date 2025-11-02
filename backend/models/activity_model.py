from sqlalchemy import Column, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, REAL
from sqlalchemy.schema import PrimaryKeyConstraint
from config.database_config import Base


class Activity(Base):
    __tablename__ = "activities"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    game_id = Column(UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    last_score = Column(REAL)
    best_score = Column(REAL)
    last_played = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="activities")
    game = relationship("Game", back_populates="activities")

    __table_args__ = (
        PrimaryKeyConstraint("user_id", "game_id", name="activity_pk"),
    )