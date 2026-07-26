from pydantic import BaseModel, Field
from typing import List, Optional

# Existing
class IngredientAnalyzeRequest(BaseModel):
    ingredients_list: str

class IngredientAnalyzeResponse(BaseModel):
    status: str
    ingredients_analyzed: str
    gemma_ai_response: str

# New Feature Schemas
class ChatbotRequest(BaseModel):
    message: str = Field(..., description="User message for the beauty consultant chatbot")
    chat_history: Optional[List[dict]] = Field(default=[], description="Past conversation history if any")

class ChatbotResponse(BaseModel):
    status: str
    reply: str

class AcneCareRequest(BaseModel):
    acne_severity: str = Field(..., description="e.g., Mild, Moderate, Severe, Cystic")
    breakout_location: str = Field(..., description="e.g., Cheeks, Forehead, Jawline")

class SkinTypeAnalyzerRequest(BaseModel):
    skin_characteristics: str = Field(..., description="User descriptions of how their skin behaves during the day")

class ProductRecommendationRequest(BaseModel):
    skin_goal: str = Field(..., description="e.g., Hydration, Anti-aging, Brightening")
    budget_range: str = Field(..., description="e.g., Budget, Mid-range, Luxury")

class MorningNightPlannerRequest(BaseModel):
    skin_type: str
    lifestyle_notes: str = Field(..., description="e.g., Works outdoors, 9-5 office job")

class SensitiveSkinRequest(BaseModel):
    trigger_symptoms: str = Field(..., description="e.g., Redness, stinging from fragranced products")

class BeautyJournalRequest(BaseModel):
    entry_text: str = Field(..., description="Daily skin progress or notes written by user")