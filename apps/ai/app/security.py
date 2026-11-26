import os
from fastapi import Header, HTTPException

SECRET = os.getenv("AI_SERVICE_SECRET", "change-me-ai-service-secret")


def require_secret(x_ai_secret: str = Header(default="")) -> None:
    if x_ai_secret != SECRET:
        raise HTTPException(status_code=401, detail="Invalid AI service secret")
