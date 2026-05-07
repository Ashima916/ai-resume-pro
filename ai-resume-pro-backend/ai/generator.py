import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "").strip()
if not api_key:
    raise EnvironmentError("GEMINI_API_KEY not set in .env file")

model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite").strip()
client = genai.Client(api_key=api_key)

def generate_text(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
    except Exception as exc:
        message = str(exc)
        if "RESOURCE_EXHAUSTED" in message or "429" in message:
            raise RuntimeError(
                "Gemini API quota is exhausted for this API key/model. "
                "Add billing or use a key/model with available quota, then restart the backend."
            ) from exc
        if "API_KEY_INVALID" in message or "INVALID_ARGUMENT" in message:
            raise RuntimeError(
                "Gemini API key or model is invalid. Check GEMINI_API_KEY and GEMINI_MODEL in .env."
            ) from exc
        raise RuntimeError(f"Gemini request failed: {message}") from exc

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    return response.text
