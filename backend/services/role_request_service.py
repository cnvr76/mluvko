from uuid import UUID
from datetime import datetime, UTC
from typing import Optional
from sqlalchemy.orm import Session, joinedload
from models import RoleRequest, RoleRequestStatus, User, Role
from config.logger import Logger
from config.exeptions import RoleRequestDoesntExist, RoleRequestNotEligible, RoleRequestAlreadyPending


logger = Logger(__name__).configure()


class RoleRequestService:
    def __get_request(self, request_id: UUID, db: Session) -> RoleRequest:
        request: Optional[RoleRequest] = db.query(RoleRequest).options(
            joinedload(RoleRequest.user)
        ).filter(RoleRequest.id == request_id).first()

        if not request:
            raise RoleRequestDoesntExist()

        return request


    def get_my_request(self, user_id: UUID, db: Session) -> Optional[RoleRequest]:
        return db.query(RoleRequest).filter(
            RoleRequest.user_id == user_id
        ).order_by(RoleRequest.created_at.desc()).first()


    def create_request(self, user: User, db: Session) -> RoleRequest:
        if user.role != Role.PARENT.value:
            raise RoleRequestNotEligible()

        existing_pending: Optional[RoleRequest] = db.query(RoleRequest).filter(
            RoleRequest.user_id == user.id,
            RoleRequest.status == RoleRequestStatus.PENDING.value
        ).first()

        if existing_pending:
            raise RoleRequestAlreadyPending()

        request = RoleRequest(
            user_id=user.id,
            requested_role=Role.THERAPIST.value,
            status=RoleRequestStatus.PENDING.value
        )
        db.add(request)
        db.flush()
        db.refresh(request)
        return request


    def get_all_requests(self, db: Session) -> list[RoleRequest]:
        return db.query(RoleRequest).options(
            joinedload(RoleRequest.user)
        ).order_by(RoleRequest.created_at.desc()).all()


    def approve_request(self, request_id: UUID, db: Session) -> RoleRequest:
        request: RoleRequest = self.__get_request(request_id, db)

        request.user.role = request.requested_role
        request.status = RoleRequestStatus.APPROVED.value
        request.admin_feedback = None
        request.resolved_at = datetime.now(UTC)
        return request


    def reject_request(self, request_id: UUID, reason: str, db: Session) -> RoleRequest:
        request: RoleRequest = self.__get_request(request_id, db)

        request.status = RoleRequestStatus.REJECTED.value
        request.admin_feedback = reason
        request.resolved_at = datetime.now(UTC)
        return request


role_request_service: RoleRequestService = RoleRequestService()
