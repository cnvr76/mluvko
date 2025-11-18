from fastapi import APIRouter, Depends, HTTPException
from schemas.game_schema import GameResponse, GameCreate, GameBriefResponse
from schemas.activity_schema import ActivityResponse, ActivityCreate
from models.activity_model import Activity
from models.game_model import AgeGroups, Game
from typing import List, Optional
from services.game_service import game_service
from sqlalchemy.orm import Session
from uuid import UUID
from config.database_config import get_db


router = APIRouter()


@router.get("/", response_model=List[GameBriefResponse])
async def get_all_games(user_session_id: UUID, db: Session = Depends(get_db)):
    try:
        return game_service.get_all_games(user_session_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/new", response_model=GameResponse)
async def create_new_game(config_data: GameCreate, db: Session = Depends(get_db)):
    try:
        new_game: Game = game_service.create_game(config_data, db)
        db.commit()
        return new_game
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{game_id}/delete", status_code=200)
async def delete_game(game_id: UUID, db: Session = Depends(get_db)):
    try:
        deleted_count: int = game_service.delete_game(game_id, db)
        db.commit()
        return {
            "success": deleted_count > 0,
            "deleted_count": deleted_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{game_id}", response_model=GameResponse)
async def get_game_by_id(game_id: UUID, user_session_id: UUID, db: Session = Depends(get_db)):
    try:
        return game_service.get_game(game_id, user_session_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/group/{age_group}", response_model=List[GameBriefResponse])
async def get_games_for_age_group(user_session_id: UUID, age_group: AgeGroups, db: Session = Depends(get_db)):
    try:
        return game_service.get_games_for(user_session_id, age_group, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{game_id}/update-stats", response_model=ActivityResponse)
async def update_game_stats(game_id: UUID, activity_data: ActivityCreate, db: Session = Depends(get_db)):
    try:
        updated_stats: Activity = game_service.update_game_stats(
            game_id,
            activity_data.user_session_id,
            activity_data.score,
            db
        )
        db.commit()
        return updated_stats
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))