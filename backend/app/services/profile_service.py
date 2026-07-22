import uuid
from fastapi import HTTPException, status
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile_schema import ProfileCreateOrUpdate, ProfileResponse

class ProfileService:
    def __init__(self, profile_repo: ProfileRepository):
        self.profile_repo = profile_repo

    async def get_user_profile(self, user_id: uuid.UUID) -> ProfileResponse:
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skin profile not found")
        return profile

    async def upsert_user_profile(self, user_id: uuid.UUID, dto: ProfileCreateOrUpdate) -> ProfileResponse:
        valid_skin_types = {'oily', 'dry', 'combination', 'normal', 'sensitive'}
        if dto.skin_type and dto.skin_type.lower() not in valid_skin_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid skin_type. Must be one of {valid_skin_types}"
            )
            
        updated_data = dto.model_dump(exclude_unset=True)
        return await self.profile_repo.create_or_update(user_id, updated_data)