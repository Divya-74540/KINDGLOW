import httpx
from fastapi import HTTPException, status

OLLAMA_HOST = "http://127.0.0.1:11434"
MODEL_NAME = "gemma3:4b"

class RoutineService:
    @staticmethod
    async def generate_ollama_response(prompt: str) -> str:
        """Sends a prompt to the local Ollama instance running gemma3:4b with an extended 180s timeout and num_predict limit."""
        # Extended timeout to 180 seconds to accommodate local hardware generation times
        async with httpx.AsyncClient(timeout=180.0) as client:
            try:
                response = await client.post(
                    f"{OLLAMA_HOST}/api/generate",
                    json={
                        "model": MODEL_NAME,
                        "prompt": prompt,
                        "stream": False,
                        "options": {
                            "num_predict": 250  # Limits token length slightly so it finishes generating faster without timing out
                        }
                    }
                )
                
                print(f"Ollama Status Code: {response.status_code}")
                
                if response.status_code != 200:
                    return f"[Ollama HTTP Error]: Status {response.status_code} - {response.text}"

                data = response.json()
                return data.get("response", "No response generated from AI.")
                
            except Exception as e:
                import traceback
                traceback.print_exc()
                return f"[Ollama Exception]: {type(e).__name__} - {str(e)}"