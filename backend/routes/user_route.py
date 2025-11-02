from fastapi import APIRouter, Depends, HTTPException
from services.user_service import user_service
from sqlalchemy.orm import Session
from uuid import UUID
from config.database_config import get_db


router = APIRouter()


@router.delete("/delete", status_code=200)
async def delete_user(user_session_id: UUID, db: Session = Depends(get_db)):
    try:
        deleted_count: int = user_service.delete_user(user_session_id, db)
        db.commit()
        return {
            "success": deleted_count > 0,
            "deleted_count": deleted_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))