import ollama
from typing import Optional

DEFAULT_MODEL = "gemma3:4b"

async def generate_chat_response(prompt: str, system_prompt: Optional[str] = None, model: str = DEFAULT_MODEL) -> str:
    """Sends a chat prompt to local Ollama model asynchronously and returns the response."""
    messages = []
    
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    
    messages.append({"role": "user", "content": prompt})

    try:
        # If ollama library supports async or sync execution
        response = ollama.chat(
            model=model,
            messages=messages
        )
        return response['message']['content']
    except Exception as e:
        return f"[Ollama Error]: Ensure local Ollama is running and model '{model}' is pulled. Details: {str(e)}"