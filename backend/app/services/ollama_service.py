import ollama
from typing import Optional

OLLAMA_MODEL = "gemma3:4b"

def generate_ollama_response(prompt: str, system_prompt: Optional[str] = None) -> str:
    """Sends a request to local Ollama gemma3:4b model and returns the response."""
    messages = []
    
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    
    messages.append({"role": "user", "content": prompt})

    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=messages
        )
        return response['message']['content']
    except Exception as e:
        return f"[Ollama Error]: Ensure local Ollama is running and model '{OLLAMA_MODEL}' is pulled. Details: {str(e)}"