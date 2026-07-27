from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.chatbot_service import process_chat_message
from pydantic import BaseModel

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str
    user_id: str

@router.post("/")
async def chat_endpoint(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    response = await process_chat_message(db, payload.user_id, payload.message)
    return {"response": response, "model_used": "gemma3:4b"}