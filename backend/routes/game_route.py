from fastapi import APIRouter, Depends
from schemas import GameResponse, GameBriefResponse, ActivityResponse, ActivityCreate, AuthorGameResponse
from models import AgeGroups, Activity, User
from services import game_service, snapshot_service
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional
from config.database_config import get_db
from config.dependencies import require_login, require_therapist_or_admin, get_current_user


router = APIRouter()


@router.get("/", response_model=list[GameBriefResponse])
def get_all_games(current_user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    return game_service.get_all_published_games(current_user, db)


@router.get("/favorite", response_model=list[GameBriefResponse])
def get_all_favorites(current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    return game_service.get_favorite_games(current_user, db)


@router.get("/my", response_model=list[AuthorGameResponse])
def get_my_created_games(current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    return snapshot_service.get_all_my_games(current_user.id, db)


@router.delete("/{game_id}", status_code=200)
def delete_game(game_id: UUID, current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    deleted_count: int = game_service.delete_game(game_id, current_user, db)
    db.commit()
    return {
        "success": deleted_count > 0,
        "deleted_count": deleted_count
    }


@router.get("/{game_id}", response_model=GameResponse)
def get_game_by_id(game_id: UUID, current_user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    return game_service.get_game(game_id, current_user, db)


@router.get("/group/{age_group}", response_model=list[GameBriefResponse])
def get_games_for_age_group(age_group: AgeGroups, current_user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    return game_service.get_games_for(age_group, current_user, db)


@router.post("/{game_id}/update-stats", response_model=ActivityResponse)
def update_game_stats(game_id: UUID, activity_data: ActivityCreate, current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    updated_stats: Activity = game_service.update_game_stats(
            game_id,
            current_user.id,
            activity_data.score,
            db
        )
    db.commit()
    return updated_stats


@router.post("/{game_id}/favorite", status_code=200)
def mark_as_favorite(game_id: UUID, current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    added: bool = game_service.mark_as_favorite(game_id, current_user.id, db)
    db.commit()
    return {
        "success": added,
    }
    
    
@router.delete("/{game_id}/favorite", status_code=200)
def remove_from_favorites(game_id: UUID, current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    removed: bool = game_service.remove_from_favorites(game_id, current_user.id, db)
    db.commit()
    return {
        "success": removed,
    }