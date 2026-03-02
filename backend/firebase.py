import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings

security = HTTPBearer()

def initialize_firebase():
    """Initializes Firebase Admin SDK."""
    if not firebase_admin._apps:
        # Load from credentials if available, otherwise trust default environment (useful for deploying)
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback for environments where credentials are set via env vars or default service account
            try:
                firebase_admin.initialize_app(options={'projectId': settings.NEXT_PUBLIC_FIREBASE_PROJECT_ID})
            except Exception as e:
                print(f"Warning: Firebase Admin initialization failed without explicit cert: {e}")

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verifies Firebase ID token and returns the decoded token."""
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
