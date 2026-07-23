from uuid import UUID
from typing import List, Any, Optional
from pydantic import BaseModel, ConfigDict


class RoutineStep(BaseModel):
    step_number: int
    step_type: str
    instructions: str
    key_ingredients: Optional[List[str]] = []


class RoutineResponse(BaseModel):
    id: UUID
    user_id: UUID
    am_routine: List[RoutineStep]
    pm_routine: List[RoutineStep]

    # Required in Pydantic v2 so FastAPI can convert SQLAlchemy objects seamlessly
    model_config = ConfigDict(from_attributes=True)