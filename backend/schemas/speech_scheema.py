from pydantic import BaseModel
from typing import Optional, List, Dict


class AnalysedSpeechResponse(BaseModel):
    recognized_text: str
    reference_text: str
    score: float
    errors: Optional[List[Dict]]
    phonemes_reference: str
    phonemes_recognized: str

    model_config = {"from_attributes": True}
