from fastapi import APIRouter, Depends, status
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.ai_schema import (
    IngredientAnalyzeRequest,
    IngredientAnalyzeResponse,
    ChatbotRequest,
    ChatbotResponse,
    AcneCareRequest,
    SkinTypeAnalyzerRequest,
    ProductRecommendationRequest,
    MorningNightPlannerRequest,
    SensitiveSkinRequest,
    BeautyJournalRequest
)
from app.services.routine_service import RoutineService

router = APIRouter(prefix="/ai", tags=["AI Skincare Tools & Dashboard"])

@router.post("/chat/consultant", response_model=ChatbotResponse)
async def beauty_consultant_chat(payload: ChatbotRequest, current_user: User = Depends(get_current_user)):
    """AI Beauty Consultation Chatbot (24/7 Panel)."""
    prompt = (
        "You are KindGlow's expert AI Beauty Consultant. Provide warm, professional, "
        f"and customized skincare advice to the user message: '{payload.message}'."
    )
    response_text = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "reply": response_text}

@router.post("/acne/analyze")
async def acne_care_assistant(payload: AcneCareRequest, current_user: User = Depends(get_current_user)):
    """AI Acne Care Assistant Panel."""
    prompt = f"Provide a targeted treatment and soothing protocol for {payload.acne_severity} acne located on the {payload.breakout_location}."
    advice = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "acne_care_plan": advice}

@router.post("/skintype/analyze")
async def skin_type_analyzer(payload: SkinTypeAnalyzerRequest, current_user: User = Depends(get_current_user)):
    """AI Skin Type Analyzer Panel."""
    prompt = f"Analyze these traits to determine precise skin type and barrier health: {payload.skin_characteristics}"
    analysis = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "skin_type_analysis": analysis}

@router.post("/products/recommend")
async def product_recommendation(payload: ProductRecommendationRequest, current_user: User = Depends(get_current_user)):
    """AI Product Recommendation Panel."""
    prompt = f"Recommend routine product categories and key cosmetic formulas for goal: {payload.skin_goal} within a {payload.budget_range} tier."
    recommendations = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "recommendations": recommendations}

@router.post("/routine/planner")
async def morning_night_planner(payload: MorningNightPlannerRequest, current_user: User = Depends(get_current_user)):
    """AI Morning & Night Planner Panel."""
    prompt = f"Build an AM and PM skincare routine schedule for a person with {payload.skin_type} skin and this lifestyle context: {payload.lifestyle_notes}."
    routine = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "routine_plan": routine}

@router.post("/sensitive/advisor")
async def sensitive_skin_advisor(payload: SensitiveSkinRequest, current_user: User = Depends(get_current_user)):
    """AI Sensitive Skin Advisor Panel."""
    prompt = f"Provide barrier-repair recommendations and ingredient precautions for a user experiencing: {payload.trigger_symptoms}."
    advice = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "sensitive_care_advice": advice}

@router.post("/journal/log")
async def beauty_journal_analyzer(payload: BeautyJournalRequest, current_user: User = Depends(get_current_user)):
    """AI Beauty Journal Panel."""
    prompt = f"Review this user's daily beauty journal entry, give positive encouragement, and actionable adjustment advice: '{payload.entry_text}'."
    feedback = await RoutineService.generate_ollama_response(prompt)
    return {"status": "success", "journal_feedback": feedback}