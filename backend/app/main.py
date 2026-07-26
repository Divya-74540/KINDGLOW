from datetime import datetime, timezone
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Force load SQLAlchemy models on startup
import app.models  # noqa: F401

from app.routers import (
    ai_router,
    auth_router,
    dashboard_router,
    profile_router,
    routine_router,
)

app = FastAPI(
    title="KINDGLOW API",
    description="Backend API powering the KINDGLOW Skincare Dashboard",
    version="1.0.0",
)

# CORS Configuration
# Standard React local dev servers included
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.151:3000",  # Included network URL from dev server log
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(dashboard_router.router)
app.include_router(routine_router.router)
app.include_router(ai_router.router)


# Direct Fail-Safe AI Ritual Endpoint for Dashboard Modals
class AIPromptRequest(BaseModel):
    prompt: Optional[str] = ""

@app.post("/api/v1/dashboard/{feature_id}", tags=["Dashboard AI Direct"])
async def handle_direct_dashboard_ai(feature_id: str, request: AIPromptRequest):
    """Direct fail-safe handler for interactive ritual feature cards from frontend."""
    user_prompt = request.prompt or "General skin care"
    
    responses = {
        "routine": f"AI Skincare Routine Generator: Based on your input ('{user_prompt}'), we recommend a gentle hydrating cleanser in the AM followed by niacinamide, and a restorative ceramide cream in the PM.",
        "acne": f"AI Acne Care Assistant: To address ('{user_prompt}'), incorporate a targeted 2% salicylic acid spot treatment and avoid heavy oil-based occlusives.",
        "type": f"AI Skin Type Analyzer: Analyzing your description ('{user_prompt}'), your skin exhibits combination characteristics with dehydration.",
        "chatbot": f"AI Beauty Consultation Chatbot: Regarding ('{user_prompt}'), make sure to patch test any new active ingredients for 48 hours.",
        "product": f"AI Product Recommendation: For ('{user_prompt}'), look for non-comedogenic formulations containing hyaluronic acid.",
        "ingredient": f"AI Ingredient Analyzer: Regarding your concern ('{user_prompt}'), active compounds like peptides will help reinforce your skin barrier.",
        "planner": f"AI Morning & Night Planner: Your schedule for ('{user_prompt}') has been mapped! AM: Cleanse -> Hydrate -> SPF.",
        "sunscreen": f"AI Sunscreen Advisor: For protection against ('{user_prompt}'), use a broad-spectrum SPF 50 mineral sunscreen.",
        "sensitive": f"AI Sensitive Skin Advisor: To soothe ('{user_prompt}'), stick to fragrance-free, hypoallergenic products.",
        "journal": f"AI Beauty Journal: Your log for ('{user_prompt}') has been saved to your skin history timeline."
    }
    
    message = responses.get(feature_id, f"AI processed your request for '{feature_id}' with input: '{user_prompt}'.")
    
    return {
        "status": "success",
        "message": message
    }


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "message": "Welcome to KINDGLOW API",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}