from fastapi import HTTPException, APIRouter, Depends, Form, UploadFile, File, Request
import logging, os, sys
import dotenv
from services.speech_service import speech_service
import uuid
import shutil
from scripts.utils import hash_string
from schemas.speech_scheema import AnalysedSpeechResponse

dotenv.load_dotenv()


router = APIRouter()


logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.FileHandler("./logs/speech_route.log", encoding="utf-8")
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


@router.post("/stt", response_model=AnalysedSpeechResponse)
async def convert_speech_to_text(audio_file: UploadFile = File(...), reference_text: str = Form(...)):
    try:
        analysis_result = await speech_service.analyze_speech(audio_file, reference_text)
        return analysis_result
    except Exception as e:
        logger.error(f"Error in convert_text_to_speech: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/tts")
async def create_speech_from_text(request: Request, speech_text: str):
    try:
        audio_filepath: str = speech_service.create_speech(speech_text)
        return f"{request.base_url}{audio_filepath}"
    except Exception as e:
        logger.error(f"Error in create_speech_from_text: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/tts/combined")
async def create_combined_speech_from_text(request: Request, speech_text: str = Form(...), sfx_audio_file: UploadFile = File(...)):
    file_extension: str = sfx_audio_file.filename.split(".")[-1]
    if file_extension.lower() != "mp3":
        raise HTTPException("Only MP3s are allowed at the moment")
    
    sfx_filepath: str = f"static/sfx/{hash_string(sfx_audio_file.filename)}.mp3"

    try:
        if not os.path.exists(sfx_filepath):
            with open(sfx_filepath, "wb") as buffer:
                shutil.copyfileobj(sfx_audio_file.file, buffer)

        combined_audio_filepath: str = speech_service.create_combined_speech(speech_text, sfx_filepath)
        return f"{request.base_url}{combined_audio_filepath}"
    
    except FileNotFoundError as fnfe:
        logger.error(f"File by {sfx_filepath} was not found: {str(fnfe)}")
        raise HTTPException(status_code=404, detail=str(fnfe))
    except Exception as e:
        logger.error(f"Error in create_speech_from_text: {e}")
        raise HTTPException(status_code=500, detail=str(e))