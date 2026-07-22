import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.profile_model import Profile
from app.schemas.profile_schema import ProfileCreateOrUpdate

class ProfileRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> Profile | None:
        result = await self.db.execute(select(Profile).where(Profile.user_id == user_id))
        return result.scalars().first()

    async def upsert(self, user_id: uuid.UUID, dto: ProfileCreateOrUpdate) -> Profile:
        profile = await self.get_by_user_id(user_id)
        
        if profile:
            profile.skin_type = dto.skin_type
            profile.skin_concerns = dto.skin_concerns
            profile.climate = dto.climate
            profile.age_group = dto.age_group
            profile.known_allergies = dto.known_allergies
        else:
            profile = Profile(
                user_id=user_id,
                skin_type=dto.skin_type,
                skin_concerns=dto.skin_concerns,
                climate=dto.climate,
                age_group=dto.age_group,
                known_allergies=dto.known_allergies,
            )
            self.db.add(profile)

        await self.db.commit()
        await self.db.refresh(profile)
        return profile