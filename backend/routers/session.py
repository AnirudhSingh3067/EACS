from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from firebase import verify_firebase_token
from firebase_admin import firestore
import datetime

router = APIRouter(prefix="/api/session", tags=["Session"])

class BookSessionRequest(BaseModel):
    practitionerId: str
    startTime: str
    patientName: str 

class BookSessionResponse(BaseModel):
    sessionId: str
    message: str

@router.post("/book", response_model=BookSessionResponse)
async def book_session(request: BookSessionRequest, token: dict = Depends(verify_firebase_token)):
    try:
        db = firestore.client()
        patient_id = token["uid"]
        
        start_dt = datetime.datetime.fromisoformat(request.startTime.replace("Z", "+00:00"))
        
        session_ref = db.collection("sessions").document()
        session_data = {
            "patientId": patient_id,
            "practitionerId": request.practitionerId,
            "startTime": start_dt,
            "status": "upcoming",
            "meetingLink": None,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        session_ref.set(session_data)
        
        # Create notification for practitioner
        notif_ref = db.collection("notifications").document()
        dt_str = start_dt.strftime("%B %d at %I:%M %p").replace(" 0", " ")
        notif_data = {
            "userId": request.practitionerId,
            "senderId": patient_id,
            "title": "New Session Booking",
            "message": f"{request.patientName} booked a therapy session with you on {dt_str}.",
            "type": "booking",
            "sessionId": session_ref.id,
            "isRead": False,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        notif_ref.set(notif_data)
        
        return BookSessionResponse(sessionId=session_ref.id, message="Session booked successfully!")
    except Exception as e:
        print("Session Booking Error:", e)
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")

class AddMeetLinkRequest(BaseModel):
    sessionId: str
    meetingLink: str
    patientId: str
    professionalName: str

class AddMeetLinkResponse(BaseModel):
    message: str

@router.patch("/add-meet-link", response_model=AddMeetLinkResponse)
async def add_meet_link(request: AddMeetLinkRequest, token: dict = Depends(verify_firebase_token)):
    try:
        db = firestore.client()
        practitioner_id = token["uid"]
        
        session_ref = db.collection("sessions").document(request.sessionId)
        session_doc = session_ref.get()
        if not session_doc.exists:
            raise HTTPException(status_code=404, detail="Session not found")
            
        session_ref.update({
            "meetingLink": request.meetingLink,
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        
        # Create notification for patient
        notif_ref = db.collection("notifications").document()
        notif_data = {
            "userId": request.patientId,
            "senderId": practitioner_id,
            "title": "Session Link Added",
            "message": "Your therapist added the session meeting link.",
            "type": "meeting_link",
            "sessionId": request.sessionId,
            "isRead": False,
            "createdAt": firestore.SERVER_TIMESTAMP
        }
        notif_ref.set(notif_data)
        
        return AddMeetLinkResponse(message="Meeting link added successfully!")
    except HTTPException as e:
        raise e
    except Exception as e:
        print("Add Meet Link Error:", e)
        raise HTTPException(status_code=500, detail=f"Backend Error: {str(e)}")
