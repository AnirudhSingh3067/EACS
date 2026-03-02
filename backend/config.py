import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BACKEND_URL: str = "http://localhost:8000"
    FRONTEND_URL: str = "http://localhost:9002"
    XAI_API_KEY: str = os.getenv("XAI_API_KEY", "")
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: str = ""

    model_config = {
        "env_file": "../.env.local",
        "extra": "ignore"
    }

settings = Settings()
