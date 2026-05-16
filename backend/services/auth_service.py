import os, dotenv
from schemas import UserCreate, UserLogin, UserLoginResponse
from models import User
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from config.exeptions import UserAlreadyExists, InvalidCredentials, RefreshTokenExpired, CredentialsValidationError
from datetime import datetime, UTC, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from config.logger import Logger
from typing import Any


dotenv.load_dotenv()
logger = Logger(__name__).configure()


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))


class AuthService:
    def signup(self, signup_data: UserCreate, db: Session) -> User:
        hashed_password: str = generate_password_hash(signup_data.password)
        user_dict = signup_data.model_dump()
        user_dict.pop("password")
        try:
            new_user = User(
                **user_dict,
                password_hash=hashed_password
            )

            db.add(new_user)
            db.flush()
            db.refresh(new_user)

            return new_user
        except IntegrityError:
            raise UserAlreadyExists()
        except Exception as e:
            logger.error(f"Error while registering new user {signup_data.email}: {e}")
            raise e
    

    def login(self, login_data: UserLogin, db: Session) -> tuple[str, UserLoginResponse]:
        user = db.query(User).filter(User.email == login_data.email).first()

        if not user or not check_password_hash(user.password_hash, login_data.password):
            raise InvalidCredentials()
        
        token_data = {"sub": user.email}
        access_token: str = auth_service._create_access_token(token_data)
        refresh_token: str = auth_service._create_refresh_token(token_data)

        return (
            refresh_token,
            UserLoginResponse(
                user=user,
                tokens={"access_token": access_token, "token_type": "bearer"}
            ),
        )
    

    def refresh(self, refresh_token: str, db: Session) -> tuple[User, dict]:
        if not refresh_token:
            raise RefreshTokenExpired()

        payload = self._validate_token(refresh_token)
        email: str = payload.get("sub")
        if email is None:
            raise CredentialsValidationError()
        
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise CredentialsValidationError()
        
        new_token_data = {"sub": user.email}
        new_access_token: str = auth_service._create_access_token(new_token_data)

        return user, {"access_token": new_access_token, "token_type": "bearer"}
    

    def get_current_user(self, token: str, db: Session) -> User:
        try:
            payload = self._validate_token(token)
            email: str = payload.get("sub")
            if email is None:
                raise CredentialsValidationError()
        except JWTError:
            raise CredentialsValidationError()
        
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise CredentialsValidationError()
        
        return user
    

    def _create_access_token(self, data: dict) -> str:
        to_encode: dict = data.copy()
        expire: datetime = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    
    def _create_refresh_token(self, data: dict) -> str:
        to_encode: dict = data.copy()
        expire = datetime.now(UTC) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        encoded_jwt: str = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    

    def _validate_token(self, token: str) -> dict[str, Any]:
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            raise CredentialsValidationError()


auth_service: AuthService = AuthService()
