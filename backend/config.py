import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:9002"

    GROQ_API_KEY: str
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: str = ""

    model_config = {
        "extra": "ignore"
    }

settings = Settings()