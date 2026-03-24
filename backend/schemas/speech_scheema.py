from pydantic import BaseModel
from typing import Optional


class AnalysedSpeechResponse(BaseModel):
    recognized_text: str
    reference_text: str
    score: float
    errors: Optional[list[dict]]
    phonemes_reference: str
    phonemes_recognized: str

    model_config = {"from_attributes": True}
