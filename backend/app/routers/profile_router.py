from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.jwt_handler import get_current_user
from app.models.user_model import User
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile_schema import ProfileCreate, ProfileResponse

# Prefix is already set here
router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])


@router.get("/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Fetches the current authenticated user's skin profile."""
    profile_repo = ProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found."
        )

    return profile


@router.post("/me", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
async def create_or_update_my_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Creates or updates the skin profile for the current user."""
    profile_repo = ProfileRepository(db)
    existing_profile = await profile_repo.get_by_user_id(current_user.id)

    if existing_profile:
        return await profile_repo.update_profile(
            user_id=current_user.id,
            profile_data=profile_data
        )
    else:
        return await profile_repo.create_profile(
            user_id=current_user.id,
            profile_data=profile_data
        )