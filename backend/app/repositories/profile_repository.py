import uuid
from typing import Optional
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile_model import Profile
from app.schemas.profile_schema import ProfileCreate


class ProfileRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Profile]:
        """Fetches a profile by user_id."""
        result = await self.db.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        return result.scalars().first()

    async def create_profile(self, user_id: uuid.UUID, profile_data: ProfileCreate) -> Profile:
        """Creates a new skin profile for the user."""
        profile_dict = profile_data.model_dump()
        new_profile = Profile(
            user_id=user_id,
            **profile_dict
        )
        self.db.add(new_profile)
        await self.db.commit()
        await self.db.refresh(new_profile)
        return new_profile

    async def update_profile(self, user_id: uuid.UUID, profile_data: ProfileCreate) -> Profile:
        """Updates an existing skin profile for the user."""
        profile = await self.get_by_user_id(user_id)
        if not profile:
            raise ValueError("Profile not found")

        profile_dict = profile_data.model_dump()
        for key, value in profile_dict.items():
            setattr(profile, key, value)

        await self.db.commit()
        await self.db.refresh(profile)
        return profile