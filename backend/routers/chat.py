from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from groq import AsyncGroq
from firebase import verify_firebase_token
from config import settings

router = APIRouter()
client = AsyncGroq(
    api_key=settings.GROQ_API_KEY,
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    message = request.message
    
    if not message or not isinstance(message, str):
        raise HTTPException(status_code=400, detail="A valid message is required.")

    # Basic Safety Filter
    lower_message = message.lower()
    if (
        "suicide" in lower_message or
        "kill myself" in lower_message or
        "self harm" in lower_message
    ):
        return ChatResponse(
            reply="If you are in immediate danger or crisis, please call 911 or 988 (USA) immediately. Your safety matters most. Please reach out to emergency services."
        )

    try:
        print("GROQ KEY LOADED:", bool(settings.GROQ_API_KEY))
        
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a calm and supportive mental health assistant."},
                {"role": "user", "content": message}
            ],
        )
        
        reply_content = response.choices[0].message.content or "No response received."
        return ChatResponse(reply=reply_content)
        
    except Exception as e:
        print("Chat API Error:", e)
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")
