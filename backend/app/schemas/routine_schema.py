from pydantic import BaseModel, Field
from typing import List, Optional

class RoutineStep(BaseModel):
    step_number: int
    category: str
    product_suggestion: str
    instructions: str

class RoutineResponse(BaseModel):
    status: str
    regimen: List[RoutineStep]
    pro_tips: List[str]

class RoutineAnalyzeRequest(BaseModel):
    skin_notes: Optional[str] = Field(default="", description="User skin notes or calibration details")
    photo_url: Optional[str] = Field(default=None, description="Optional uploaded photo path/URL")

class RoutineCompleteResponse(BaseModel):
    status: str
    completed_at: str
    progress_counter: int
    message: str