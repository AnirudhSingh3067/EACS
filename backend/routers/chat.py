from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import AsyncGroq
from config import settings
import traceback

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

# Removed the Firebase Auth lock here so you can test it easily!
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    
    # Initialize Groq INSIDE the endpoint to fix the Async connection crash
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    
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
        response = await client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a calm and supportive mental health assistant."},
                {"role": "user", "content": message}
            ],
        )
        
        reply_content = response.choices[0].message.content or "No response received."
        return ChatResponse(reply=reply_content)
        
    except Exception as e:
        print("========== GROQ ERROR ==========")
        traceback.print_exc()
        print("ERROR MESSAGE:", str(e))
        print("================================")
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")