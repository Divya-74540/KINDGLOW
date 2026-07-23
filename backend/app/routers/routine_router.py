from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.jwt_handler import get_current_user

from app.models.user_model import User
from app.repositories.profile_repository import ProfileRepository
from app.repositories.routine_repository import RoutineRepository
from app.services.ai_service import AIService
from app.schemas.routine_schema import RoutineResponse

# Prefix /api/v1/routine is set here
router = APIRouter(prefix="/api/v1/routine", tags=["Routine Generator"])


@router.post("/generate", response_model=RoutineResponse, status_code=status.HTTP_201_CREATED)
async def generate_and_save_routine(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generates a personalized skincare routine using local AI and saves/updates it in PostgreSQL."""
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skin profile not found. Please complete your skin profile first."
        )

    ai_service = AIService()
    routine_data = await ai_service.generate_structured_routine(profile)

    if not routine_data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate routine structure from AI service."
        )

    routine_repo = RoutineRepository(db)
    existing_routine = await routine_repo.get_by_user_id(current_user.id)

    am_data = routine_data.get("am_routine", [])
    pm_data = routine_data.get("pm_routine", [])

    if existing_routine:
        return await routine_repo.update_routine(
            routine_id=existing_routine.id,
            am_routine=am_data,
            pm_routine=pm_data
        )
    else:
        return await routine_repo.create_routine(
            user_id=current_user.id,
            am_routine=am_data,
            pm_routine=pm_data
        )