import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.routine_model import Routine


class RoutineRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[Routine]:
        stmt = select(Routine).where(Routine.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create_routine(self, user_id: uuid.UUID, am_routine: list, pm_routine: list) -> Routine:
        new_routine = Routine(
            user_id=user_id,
            am_routine=am_routine,
            pm_routine=pm_routine
        )
        self.db.add(new_routine)
        await self.db.commit()
        await self.db.refresh(new_routine)
        return new_routine

    async def update_routine(self, routine_id: uuid.UUID, am_routine: list, pm_routine: list) -> Routine:
        stmt = select(Routine).where(Routine.id == routine_id)
        result = await self.db.execute(stmt)
        routine = result.scalars().one()
        
        routine.am_routine = am_routine
        routine.pm_routine = pm_routine
        
        await self.db.commit()
        await self.db.refresh(routine)
        return routine