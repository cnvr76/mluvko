from fastapi import APIRouter, Depends
from services import user_service
from schemas import UserUpdate, UserResponse
from sqlalchemy.orm import Session
from models import User
from typing import Optional
from uuid import UUID
from config.database_config import get_db
from config.dependencies import get_current_user, require_admin
from config.exeptions import UserDoesntExist


router = APIRouter()


@router.delete("/me", status_code=200)
def delete_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted_count: int = user_service.delete_user(current_user.id, db)
    db.commit()
    return {
        "success": deleted_count > 0,
        "deleted_count": deleted_count
    }
    

@router.get("/all", dependencies=[Depends(require_admin)], response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", dependencies=[Depends(require_admin)], response_model=Optional[UserResponse])
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(user_id, db)


@router.patch("/me", response_model=UserResponse)
def update_user(update_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return user_service.update_user(current_user, update_data, db)


@router.patch("/{user_id}", dependencies=[Depends(require_admin)], response_model=UserResponse)
def update_someone(update_data: UserUpdate, user_id: UUID, db: Session = Depends(get_db)):
    user: Optional[User] = user_service.get_user_by_id(user_id, db)
    if not user:
        raise UserDoesntExist()
    return user_service.update_user(user, update_data, db)