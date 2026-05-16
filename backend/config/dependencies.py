from typing import Any, Callable, Optional
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import Depends
from sqlalchemy.orm import Session
from services import auth_service
from models import Role, User
from config.database_config import get_db
from config.exeptions import NotEnoughRights, CredentialsValidationError


bearer_scheme = HTTPBearer()
bearer_scheme_optional = HTTPBearer(auto_error=False)

def require_login(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)) -> User:
    token: str = credentials.credentials
    return auth_service.get_current_user(token, db)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme_optional), db: Session = Depends(get_db)) -> Optional[User]:
    if not credentials:
        return None
    
    try:
        return auth_service.get_current_user(credentials.credentials, db)
    except CredentialsValidationError:
        return None


class RoleCheсker:
    def __init__(self, allowed_roles: list[Role]) -> None:
        self.allowed_roles = allowed_roles
        
    def __call__(self, current_user: User = Depends(require_login)) -> Any:
        if current_user.role not in self.allowed_roles:
            raise NotEnoughRights()
        return current_user

require_admin: Callable[[], User] = RoleCheсker([Role.ADMIN.value])
require_therapist_or_admin: Callable[[], User] = RoleCheсker([Role.ADMIN.value, Role.THERAPIST.value])