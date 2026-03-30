import uuid
from sqlalchemy import Column, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from config.database_config import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    published_version_id = Column(UUID(as_uuid=True), ForeignKey("snapshots.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())

    author = relationship("User", back_populates="games")
    activities = relationship("Activity", back_populates="game")
    
    versions = relationship(
        "Snapshot", 
        foreign_keys="[Snapshot.game_id]", 
        back_populates="game", 
        cascade="all, delete-orphan"
    )
    
    published_version = relationship(
        "Snapshot", 
        foreign_keys=[published_version_id], 
        post_update=True
    )