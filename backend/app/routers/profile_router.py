from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user_model import User
from app.schemas.profile_schema import ProfileCreateOrUpdate, ProfileResponse
from app.repositories.profile_repository import ProfileRepository

router = APIRouter()

@router.get("/me", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = ProfileRepository(db)
    profile = await repo.get_by_user_id(current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Profile not found. Please create your skin profile."
        )
    return profile

@router.post("/me", response_model=ProfileResponse)
async def create_or_update_profile(
    dto: ProfileCreateOrUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    repo = ProfileRepository(db)
    return await repo.upsert(user_id=current_user.id, dto=dto)