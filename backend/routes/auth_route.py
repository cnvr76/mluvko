from fastapi import APIRouter, Depends, Response, Cookie
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas import UserCreate, UserLogin, UserLoginResponse, UserResponse
from models import User
from services import auth_service
from sqlalchemy.orm import Session
from config.database_config import get_db
from config.logger import Logger


router = APIRouter()
logger = Logger(__name__).configure()
bearer_scheme = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)):
    token: str = credentials.credentials
    return auth_service.get_current_user(token, db)


@router.post("/signup", response_model=UserResponse)
async def signup(signup_data: UserCreate, db: Session = Depends(get_db)):
    new_user: User = auth_service.signup(signup_data, db)
    db.commit()
    return new_user


@router.post("/login", response_model=UserLoginResponse)
async def login(response: Response, login_data: UserLogin, db: Session = Depends(get_db)):
    refresh_token, user_response = auth_service.login(login_data, db)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="strict",
        # secure=True - on deploy via https
    )
    
    return user_response


@router.post("/refresh", response_model=UserLoginResponse)
async def refresh(refresh_token: str = Cookie(None), db: Session = Depends(get_db)):
    user, tokens = auth_service.refresh(refresh_token, db)
    return UserLoginResponse(
        user=user,
        tokens=tokens
    )
    