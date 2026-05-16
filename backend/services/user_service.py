from uuid import UUID
from models import User
from schemas import UserUpdate
from sqlalchemy.orm import Session
from typing import Optional, Any
from config.logger import Logger


logger = Logger(__name__).configure()


class UserService:
    def get_user_by_id(self, user_id: UUID, db: Session) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()
    
    
    def update_user(self, user: User, update_data: dict[str, Any], db: Session) -> User:
        for key, value in update_data.items():
            setattr(user, key, value)
            
        db.add(user)
        db.flush()
        db.refresh(user)
        return user
    
    
    def get_all_users(self, db: Session) -> list[User]:
        return db.query(User).all()
    
    
    def delete_user(self, user_id: UUID, db: Session) -> int:
        return db.query(User).filter(User.id == user_id).delete()
            

user_service: UserService = UserService()
    