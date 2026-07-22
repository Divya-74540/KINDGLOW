import uuid
from typing import List, Optional
from pydantic import BaseModel

class ProfileCreateOrUpdate(BaseModel):
    skin_type: str
    skin_concerns: List[str]
    climate: Optional[str] = None
    age_group: Optional[str] = None
    known_allergies: Optional[List[str]] = []

class ProfileResponse(ProfileCreateOrUpdate):
    id: uuid.UUID
    user_id: uuid.UUID

    class Config:
        from_attributes = True