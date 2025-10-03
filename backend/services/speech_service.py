import whisper
from gtts import gTTS
from typing import List, Optional, Dict, Any
import logging, os
import io
from fastapi import UploadFile
import librosa
import hashlib
from pydub import AudioSegment
import tempfile
from scripts.utils import hash_string


logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.FileHandler("./logs/speech_service.log", encoding="utf-8")
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


class SpeechService:
    def __init__(self, model_name: str, lang: str = "sk") -> None:
        self.lang = lang
        try:
            self.model = whisper.load_model(model_name)
            logger.info(f"Whisper {model_name} model was initialized")
        except Exception as e:
            logger.error(f"Failed to load whisper {model_name} model: {e}")
            self.model = None

    async def analyze_speech(self, audio_file: UploadFile, reference_text: str) -> Dict[str, Any]:
        if not self.model:
            raise RuntimeError("Whisper model is not initialized")

        audio_bytes = await audio_file.read()
        audio_stream = io.BytesIO(audio_bytes)
        audio_stream.name = audio_file.filename

        audio_waveform, _ = librosa.load(audio_stream, sr=16000)

        transcription_result = self.model.transcribe(audio_waveform, language=self.lang)
        recognized_text = transcription_result.get("text")

        return {
            "recognized_text": recognized_text,
            "reference_text": reference_text
        }
    
    def create_speech(self, text: str) -> str:
        filename: str = hash_string(text) + ".mp3"
        filepath: str = f"static/audio/{filename}"

        if not os.path.exists(filepath):
            logger.info(f"Cache miss for {text=}, generating {filename=}...")
            try:
                tts = gTTS(text, lang=self.lang)
                tts.save(filepath)
            except Exception as e:
                logger.error(f"Failed to generate speech for {text=}: {str(e)}")
                raise RuntimeError(f"gTTS failed: {str(e)}")
        else:
            logger.info(f"Cache for {text=} exists, returning existing file...")

        return filepath.replace("\\", "/")
    
    def create_combined_speech(self, text: str, sfx_filepath: str) -> str:
        name_for_hash: str = text + sfx_filepath
        filename: str = hash_string(name_for_hash) + ".mp3"
        filepath: str = f"static/combined/{filename}"

        if os.path.exists(filepath):
            logger.info(f"Cache for {name_for_hash} exists, returning existing file...")
            return filepath
        
        logger.info(f"Cache miss for {text=} & {sfx_filepath=}, generating {filename=}...")
        
        combined_audio: AudioSegment = AudioSegment.empty()

        ntf = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        temp_tts_path = ntf.name
        ntf.close()

        try:
            tts = gTTS(text, lang=self.lang)
            tts.save(temp_tts_path)

            tts_segment = AudioSegment.from_mp3(temp_tts_path)
            combined_audio += tts_segment
            
            if not os.path.exists(sfx_filepath):
                raise FileNotFoundError(f"Sound effect file not found: {sfx_filepath=}")
            
            sfx_segment = AudioSegment.from_mp3(sfx_filepath)
            combined_audio += sfx_segment

            combined_audio.export(filepath, format="mp3")
        finally:
            if os.path.exists(temp_tts_path):
                os.remove(temp_tts_path)

        return filepath.replace("\\", "/")


speech_service: SpeechService = SpeechService("base")