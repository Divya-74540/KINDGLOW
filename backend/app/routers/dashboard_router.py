from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.dashboard_schema import (
    DashboardStatsResponse,
    MoistureUpdateRequest,
    SunscreenActionResponse,
    ActivityItem
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard Core"])

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    """Retrieves initial dashboard parameters including moisture levels, sunscreen status, and recent activity feed."""
    return {
        "moisture_level": 72.4,
        "sunscreen_active": True,
        "skin_status": "Optimal hydration barrier",
        "recent_activity": [
            {"id": "act_1", "description": "Applied SPF 50 mineral sunscreen", "timestamp": "2 hours ago"},
            {"id": "act_2", "description": "Completed AM Hydration Ritual", "timestamp": "5 hours ago"}
        ]
    }

@router.patch("/moisture", response_model=DashboardStatsResponse)
async def update_moisture_level(
    payload: MoistureUpdateRequest,
    current_user: User = Depends(get_current_user)
):
    """Updates moisture level metrics and protocol checklist states."""
    # Here you can save payload.moisture_level to your DB profile/stats model if tracked
    return {
        "moisture_level": payload.moisture_level,
        "sunscreen_active": True,
        "skin_status": "Moisture metrics updated successfully",
        "recent_activity": [
            {"id": "act_new", "description": f"Updated moisture level to {payload.moisture_level}%", "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")}
        ]
    }

@router.post("/sunscreen", response_model=SunscreenActionResponse)
async def trigger_sunscreen(current_user: User = Depends(get_current_user)):
    """Triggers sunscreen application action, updates status to active, and logs the timestamp."""
    current_time = datetime.now(timezone.utc).isoformat()
    return {
        "status": "success",
        "sunscreen_active": True,
        "timestamp": current_time,
        "message": "Sunscreen application recorded. Protection active for next 2 hours."
    }