from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.ollama_service import generate_ollama_response

router = APIRouter(prefix="/ai", tags=["AI Skincare Tools & Dashboard"])

class AIRequest(BaseModel):
    prompt: Optional[str] = "Provide skin analysis and recommendations"
    skin_type: Optional[str] = "balanced"

@router.post("/chat/consultant")
async def beauty_consultant_chat(payload: AIRequest):
    system_msg = "You are KINDGLOW's expert AI beauty consultant. Provide kind, professional, and practical skincare tips."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "response": reply}

@router.post("/acne/analyze")
async def acne_care_assistant(payload: AIRequest):
    system_msg = "You are an expert dermatologist specializing in acne care protocols, active ingredients, and barrier repair."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "analysis": reply}

@router.post("/skintype/analyze")
async def skin_type_analyzer(payload: AIRequest):
    system_msg = "You are a skin analysis AI. Evaluate user descriptions to diagnose skin type and recommend customized care."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "skin_type_result": reply}

@router.post("/products/recommend")
async def product_recommendation(payload: AIRequest):
    system_msg = "You are a cosmetic product advisor. Recommend ideal safe skincare ingredients and product categories based on user queries."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "recommendations": reply}

@router.post("/routine/planner")
async def morning_night_planner(payload: AIRequest):
    system_msg = "You are an esthetician building structured morning and night skincare routines."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "routine": reply}

@router.post("/sensitive/advisor")
async def sensitive_skin_advisor(payload: AIRequest):
    system_msg = "You are a sensitive skin specialist focused on soothing irritations, hypoallergenic product selection, and barrier restoration."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "advice": reply}

@router.post("/journal/log")
async def beauty_journal_analyzer(payload: AIRequest):
    system_msg = "You are a skin progress journal analyzer. Provide helpful feedback and trends based on daily skin logs."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "journal_analysis": reply}

# Added to fix the 404 error from frontend api.js (matches `${API_BASE_URL}/api/v1/dashboard/routine`)
@router.post("/v1/dashboard/routine")
async def dashboard_routine_generator(payload: AIRequest):
    system_msg = "You are an esthetician building structured daily skincare routines for the user dashboard."
    reply = generate_ollama_response(payload.prompt, system_msg)
    return {"status": "success", "model": "gemma3:4b", "routine": reply}