from uuid import UUID
from schemas import SuccessfulResponse, AdminFeedbackRequest, AdminDashboardGameResponse
from config.dependencies import require_therapist_or_admin, require_admin
from config.database_config import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from services import snapshot_service


router = APIRouter()


@router.get("/dashboard/snapshots", dependencies=[Depends(require_admin)], response_model=list[AdminDashboardGameResponse])
def get_dashboard_snapshots_for_admin(db: Session = Depends(get_db)):
    return snapshot_service.get_dashboard_snapshots_for_admin(db)


@router.post("/{game_id}/approve/{snapshot_id}", dependencies=[Depends(require_admin)], response_model=SuccessfulResponse, status_code=200)
def approve_snapshot(game_id: UUID, snapshot_id: UUID, db: Session = Depends(get_db)):
    snapshot_service.approve_snapshot(game_id, snapshot_id, db)
    db.commit()
    return SuccessfulResponse(detail="Version published")


@router.post("/{game_id}/revoke", dependencies=[Depends(require_admin)], response_model=SuccessfulResponse, status_code=200)
def revoke_game(game_id: UUID, feedback: AdminFeedbackRequest, db: Session = Depends(get_db)):
    snapshot_service.revoke_game(game_id, feedback.reason, db)
    db.commit()
    return SuccessfulResponse(detail="Game revoked and marked as rejected")
    

@router.post("/{game_id}/rollback/{target_snapshot_id}", dependencies=[Depends(require_admin)], response_model=SuccessfulResponse, status_code=200)
def rollback_to_version(game_id: UUID, target_snapshot_id: UUID, feedback: AdminFeedbackRequest, db: Session = Depends(get_db)):
    snapshot_service.rollback_to_version(game_id, target_snapshot_id, feedback.reason, db)
    db.commit()
    return SuccessfulResponse(detail=f"Successfully rolled back to version {target_snapshot_id}")