from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.jwt_handler import get_current_user
from app.models.user_model import User
from app.repositories.profile_repository import ProfileRepository
from app.services.ai_service import AIService

# Set the base prefix here ONCE
router = APIRouter(prefix="/api/v1/ai", tags=["AI Consultation"])


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Chat with the KINDGLOW AI assistant using Gemma 3:4B."""
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skin profile not found. Please complete your profile first."
        )

    ai_service = AIService()
    response_text = await ai_service.generate_response(request.message, profile)
    return {"reply": response_text}


@router.post("/routine/generate")
async def generate_routine(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates a structured skincare routine."""
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skin profile not found. Please complete your profile first."
        )

    ai_service = AIService()
    return await ai_service.generate_structured_routine(profile)