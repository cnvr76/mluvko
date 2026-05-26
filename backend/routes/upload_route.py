from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from config.dependencies import require_therapist_or_admin
from config.logger import Logger
from services import upload_service


router = APIRouter()
logger = Logger(__name__).configure()


@router.post("/audio", dependencies=[Depends(require_therapist_or_admin)], status_code=201)
async def upload_audio(audio_file: UploadFile = File(...)):
    """Nahranie vlastného audio súboru (mp3/wav/ogg/webm/m4a, max 5 MB)."""
    audio_filepath: str = await upload_service.save_audio(audio_file)
    return audio_filepath


@router.post("/image", dependencies=[Depends(require_therapist_or_admin)], status_code=201)
async def upload_image(image_file: UploadFile = File(...)):
    """Nahranie vlastného obrázka (jpg/jpeg/png/gif/webp, max 3 MB)."""
    image_filepath: str = await upload_service.save_image(image_file)
    return image_filepath


@router.delete("/file", dependencies=[Depends(require_therapist_or_admin)], status_code=200)
def delete_uploaded_file(path: str):
    """Mazanie nahraného súboru (iba `static/uploads/...`)."""
    try:
        deleted: bool = upload_service.delete_file(path)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    return {"success": deleted}
