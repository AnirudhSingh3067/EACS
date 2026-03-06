from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, chat
from firebase import initialize_firebase
from config import settings

# Initialize Firebase SDK
initialize_firebase()

app = FastAPI(
    title="MindBridge AI Backend",
    description="Python FastAPI handling secure AI requests and Firebase auth",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include Routers
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, tags=["Chat"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
