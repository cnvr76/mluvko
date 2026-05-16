from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import uuid
from models import Role


class UserResponse(BaseModel):
    id: uuid.UUID
    username: Optional[str] = None
    email: EmailStr
    role: Role
    created_at: datetime

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password must contain at least 8 symbols")
        if not any(char.isdigit() for char in value):
            raise ValueError('Password must contain number')
        return value
    
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
    
class UserLoginResponse(BaseModel):
    user: UserResponse
    message: str = "Login successful"
    tokens: dict[str, str]
    
    
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, max_length=50)
    role: Optional[Role] = None