import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class ProfileCreate(BaseModel):
    """Schema for creating or updating a skin profile."""
    skin_type: str
    skin_concerns: List[str]
    climate: Optional[str] = None
    age_group: Optional[str] = None
    known_allergies: Optional[List[str]] = []


# Alias to satisfy profile_repository.py imports
ProfileCreateOrUpdate = ProfileCreate


class ProfileResponse(BaseModel):
    """Schema returned when fetching or updating a profile."""
    id: uuid.UUID
    user_id: uuid.UUID
    skin_type: str
    skin_concerns: List[str]
    climate: Optional[str] = None
    age_group: Optional[str] = None
    known_allergies: Optional[List[str]] = []

    model_config = ConfigDict(from_attributes=True)