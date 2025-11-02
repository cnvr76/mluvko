from uuid import UUID
from models.user_model import User
from sqlalchemy.orm import Session
from typing import Optional


class UserService:
    def get_user_by_session_id(self, user_session_id: UUID, db: Session) -> Optional[User]:
        return db.query(User).filter(User.user_session_id == user_session_id).first()

    def _create_user(self, user_session_id: UUID, db: Session) -> User:
        user = User(
            username=None,
            user_session_id=user_session_id
        )
        db.add(user)
        db.flush()
        db.refresh(user)

        return user

    def get_or_create_user(self, user_session_id: UUID, db: Session) -> User:
        current_user = self.get_user_by_session_id(user_session_id, db)
        if not current_user:
            return self._create_user(user_session_id, db)
        return current_user
    
    def delete_user(self, user_session_id: UUID, db: Session) -> int:
        return db.query(User).filter(User.user_session_id == user_session_id).delete()

    def update_username(self, new_username: str, db: Session) -> User:
        pass
            

user_service: UserService = UserService()
    