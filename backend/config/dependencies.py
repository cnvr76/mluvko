from typing import Any, Callable
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends
from sqlalchemy.orm import Session
from services import auth_service
from models import Role, User
from config.database_config import get_db
from config.exeptions import NotEnoughRights


bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)):
    token: str = credentials.credentials
    return auth_service.get_current_user(token, db)


class RoleCheсker:
    def __init__(self, allowed_roles: list[Role]) -> None:
        self.allowed_roles = allowed_roles
        
    def __call__(self, current_user: User = Depends(get_current_user)) -> Any:
        if current_user.role not in self.allowed_roles:
            raise NotEnoughRights()
        return current_user

require_admin: Callable[[], User] = RoleCheсker([Role.ADMIN.value])
require_therapist_or_admin: Callable[[], User] = RoleCheсker([Role.ADMIN.value, Role.THERAPIST.value])