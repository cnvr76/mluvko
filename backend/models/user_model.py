import uuid
from sqlalchemy import Column, Text, DateTime, func, Enum as SQLEnum, Table, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from config.database_config import Base
from enum import Enum


class Roles(str, Enum):
    PARENT = "parent"
    THERAPIST = "therapist"
    ADMIN = "admin"
    

roles_eum: SQLEnum = SQLEnum(Roles, name="roles", values_callable=lambda items: [enum.value for enum in items])


favorites_table = Table(
    "favorites",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("game_id", UUID(as_uuid=True), ForeignKey("games.id", ondelete="CASCADE"), primary_key=True)
)


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True)
    password_hash = Column(Text, nullable=False)
    role = Column(roles_eum, nullable=False, default=Roles.PARENT.value)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    
    activities = relationship("Activity", back_populates="user")
    games = relationship("Game", back_populates="user")
    favorites = relationship("Game", secondary=favorites_table)