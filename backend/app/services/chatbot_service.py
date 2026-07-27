from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.ollama_client import generate_chat_response
# Import your SQLAlchemy models or repositories here

async def process_chat_message(db: AsyncSession, user_id: str, message: str) -> str:
    # Optional: Save user message to PostgreSQL chatbot_messages table
    
    # Generate response from local Gemma model via Ollama
    ai_response = await generate_chat_response(prompt=message, model="gemma3:4b")
    
    # Optional: Save assistant response to PostgreSQL chatbot_messages table
    
    return ai_response