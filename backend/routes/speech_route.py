from fastapi import HTTPException, APIRouter, Form, UploadFile, File
import os
import dotenv
from services import speech_service
import shutil
from scripts.utils import hash_string
from schemas import AnalysedSpeechResponse
from config.logger import Logger
from config.exeptions import IncorrectAudioFormat

dotenv.load_dotenv()


router = APIRouter()
logger = Logger(__name__).configure()


@router.post("/stt", response_model=AnalysedSpeechResponse)
async def convert_speech_to_text(audio_file: UploadFile = File(...), reference_text: str = Form(...)):
    analysis_result = await speech_service.analyze_speech(audio_file, reference_text)
    return analysis_result
    

@router.post("/tts")
def create_speech_from_text(speech_text: str):
    audio_filepath: str = speech_service.create_speech(speech_text)
    return audio_filepath
    

@router.post("/tts/combined")
def create_combined_speech_from_text(speech_text: str = Form(...), sfx_audio_file: UploadFile = File(...)):
    file_extension: str = sfx_audio_file.filename.split(".")[-1]
    if file_extension.lower() != "mp3":
        raise IncorrectAudioFormat()
    
    sfx_filepath: str = f"static/sfx/{hash_string(sfx_audio_file.filename)}.mp3"

    try:
        if not os.path.exists(sfx_filepath):
            with open(sfx_filepath, "wb") as buffer:
                shutil.copyfileobj(sfx_audio_file.file, buffer)

        combined_audio_filepath: str = speech_service.create_combined_speech(speech_text, sfx_filepath)
        return combined_audio_filepath
    
    except FileNotFoundError as fnfe:
        logger.error(f"File by {sfx_filepath} was not found: {str(fnfe)}")
        raise HTTPException(status_code=404, detail=str(fnfe))
    except Exception as e:
        logger.error(f"Error in create_speech_from_text: {e}")
        raise HTTPException(status_code=500, detail=str(e))