from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ActivityItem(BaseModel):
    id: str
    description: str
    timestamp: str

class DashboardStatsResponse(BaseModel):
    moisture_level: float = Field(..., description="Current moisture percentage e.g. 68.5")
    sunscreen_active: bool = Field(..., description="Status of sunscreen protection reminder")
    skin_status: str = Field(..., description="Overall summary status")
    recent_activity: List[ActivityItem]

class MoistureUpdateRequest(BaseModel):
    moisture_level: float = Field(..., ge=0.0, le=100.0)
    protocol_notes: Optional[str] = None

class SunscreenActionResponse(BaseModel):
    status: str
    sunscreen_active: bool
    timestamp: str
    message: str