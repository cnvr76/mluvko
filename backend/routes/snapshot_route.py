from uuid import UUID
from models import User
from schemas import GameUpdate, DraftInitResponse, SuccessfulResponse, SnapshotBriefResponse, SnapshotFullResponse
from config.dependencies import require_therapist_or_admin
from config.database_config import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import snapshot_service


router: APIRouter = APIRouter()


@router.post("/init/draft", response_model=DraftInitResponse, status_code=201)
def init_draft(current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    draft: dict[str, UUID] = snapshot_service.init_draft(current_user.id, db)
    db.commit()
    return draft


@router.patch("/{game_id}/draft", response_model=SuccessfulResponse, status_code=200)
def save_draft(game_id: UUID, config: GameUpdate, current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    snapshot_service.update_draft(game_id, current_user.id, config, db)
    db.commit()
    return SuccessfulResponse(detail="Draft updated successfully")


@router.post("/{game_id}/submit", response_model=SuccessfulResponse, status_code=200, description="Submits the first found draft of the game")
def submit_game_for_review(game_id: UUID, current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    snapshot_service.submit_for_review(game_id, current_user.id, db)
    db.commit()
    return SuccessfulResponse(detail="Version of the game submitted successfully")


@router.get("/my/issues", response_model=list[SnapshotBriefResponse], status_code=200)
def get_my_problematic_games(current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    return snapshot_service.get_my_problematic_snapshots(current_user.id, db)


@router.get("/{snapshot_id}/game/{game_id}", response_model=SnapshotFullResponse, status_code=200)
def get_snapshot(game_id: UUID, snapshot_id: UUID, current_user: User = Depends(require_therapist_or_admin), db: Session = Depends(get_db)):
    return snapshot_service.get_snapshot_for_testing(game_id, snapshot_id, current_user, db)