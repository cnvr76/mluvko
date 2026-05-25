from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from schemas import RoleRequestResponse, AdminRoleRequestResponse, SuccessfulResponse, AdminFeedbackRequest
from services import role_request_service
from config.database_config import get_db
from config.dependencies import require_login, require_admin


router = APIRouter()


@router.get("/me", response_model=Optional[RoleRequestResponse])
def get_my_role_request(current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    return role_request_service.get_my_request(current_user.id, db)


@router.post("/", response_model=RoleRequestResponse, status_code=201)
def create_role_request(current_user: User = Depends(require_login), db: Session = Depends(get_db)):
    request = role_request_service.create_request(current_user, db)
    db.commit()
    return request


@router.get("/", dependencies=[Depends(require_admin)], response_model=list[AdminRoleRequestResponse])
def get_all_role_requests(db: Session = Depends(get_db)):
    return role_request_service.get_all_requests(db)


@router.post("/{request_id}/approve", dependencies=[Depends(require_admin)], response_model=SuccessfulResponse, status_code=200)
def approve_role_request(request_id: UUID, db: Session = Depends(get_db)):
    role_request_service.approve_request(request_id, db)
    db.commit()
    return SuccessfulResponse(detail="Role request approved")


@router.post("/{request_id}/reject", dependencies=[Depends(require_admin)], response_model=SuccessfulResponse, status_code=200)
def reject_role_request(request_id: UUID, feedback: AdminFeedbackRequest, db: Session = Depends(get_db)):
    role_request_service.reject_request(request_id, feedback.reason, db)
    db.commit()
    return SuccessfulResponse(detail="Role request rejected")
