from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user_model import User
from app.repositories.profile_repository import ProfileRepository
from app.services.ai_service import AIService

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class AIResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=AIResponse)
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your skin profile before consulting the AI assistant."
        )

    ai_service = AIService()
    reply = await ai_service.generate_response(request.message, profile)
    return {"reply": reply}

@router.post("/routine/generate", response_model=AIResponse)
async def generate_routine(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your skin profile first."
        )

    prompt = (
        "Generate a detailed Morning (AM) and Evening (PM) skincare routine tailored specifically "
        "to my profile. For each step, list the step type (e.g., Cleanser, Serum), key active ingredients to look for, "
        "and why it helps my skin concerns."
    )

    ai_service = AIService()
    routine = await ai_service.generate_response(prompt, profile)
    return {"reply": routine}