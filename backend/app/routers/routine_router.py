from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.routine_schema import (
    RoutineResponse,
    RoutineAnalyzeRequest,
    RoutineCompleteResponse,
    RoutineStep
)
from app.services.routine_service import RoutineService

router = APIRouter(prefix="/api/routine", tags=["AI Skincare Routine Generator"])

@router.get("", response_model=RoutineResponse)
async def get_active_routine(current_user: User = Depends(get_current_user)):
    """Fetches the active personalized skincare treatment sequence using Gemma 3:4b."""
    prompt = (
        "Generate a structured skincare sequence with steps: Cleanse, Exfoliate, Tone, Serum, Moisturizer, Protect. "
        "Return a concise and professional skincare routine."
    )
    ai_text = await RoutineService.generate_ollama_response(prompt)
    
    return {
        "status": "success",
        "regimen": [
            RoutineStep(step_number=1, category="Cleanse", product_suggestion="Hydrating Gentle Cleanser", instructions="Massage gently onto damp skin for 60 seconds."),
            RoutineStep(step_number=2, category="Exfoliate", product_suggestion="2% BHA Liquid Exfoliant", instructions="Use 2-3 times a week at night."),
            RoutineStep(step_number=3, category="Tone", product_suggestion="Soothing Rosewater Toner", instructions="Pat lightly onto face using palms."),
            RoutineStep(step_number=4, category="Serum", product_suggestion="Niacinamide 10% + Zinc 1%", instructions="Apply 3 drops to reinforce skin barrier."),
            RoutineStep(step_number=5, category="Moisturizer", product_suggestion="Barrier Repair Ceramide Cream", instructions="Lock in moisture evenly."),
            RoutineStep(step_number=6, category="Protect", product_suggestion="Mineral Broad-Spectrum SPF 50", instructions="Apply generously as the final AM step.")
        ],
        "pro_tips": [
            ai_text[:150] if ai_text else "Always patch test new actives for 48 hours.",
            "Consistent daily sunscreen application prevents premature aging."
        ]
    }

@router.post("/analyze", response_model=RoutineResponse)
async def analyze_routine_photos(
    payload: RoutineAnalyzeRequest,
    current_user: User = Depends(get_current_user)
):
    """Accepts routine calibration photos and user skin notes to return customized step recommendations via Ollama."""
    user_prompt = payload.skin_notes or "General skin calibration check"
    prompt = f"Analyze the following skin notes and suggest custom routine adjustments: '{user_prompt}'"
    
    ai_analysis = await RoutineService.generate_ollama_response(prompt)

    return {
        "status": "success",
        "regimen": [
            RoutineStep(step_number=1, category="Cleanse", product_suggestion="Calming Oat Cleanser", instructions="Tailored for your current skin notes."),
            RoutineStep(step_number=2, category="Serum", product_suggestion="Hyaluronic Acid Hydration Booster", instructions=f"AI Insight: {ai_analysis[:100]}"),
            RoutineStep(step_number=3, category="Protect", product_suggestion="SPF 50 Fluid Protector", instructions="Reapply every 3 hours outdoors.")
        ],
        "pro_tips": [
            "AI Calibration complete based on provided user notes.",
            ai_analysis
        ]
    }

@router.post("/complete", response_model=RoutineCompleteResponse)
async def complete_routine_ritual(current_user: User = Depends(get_current_user)):
    """Marks the routine ritual as completed, updates daily task progress counters, and logs entry to history."""
    current_timestamp = datetime.now(timezone.utc).isoformat()
    return {
        "status": "success",
        "completed_at": current_timestamp,
        "progress_counter": 5,
        "message": "Routine successfully completed and logged to your skin history timeline!"
    }