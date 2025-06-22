from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.crud.user import upsert_user
from app.models.user import User

router = APIRouter()

class GoogleLoginRequest(BaseModel):
    email: str
    full_name: str
    avatar_url: str = None
    google_id: str = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/google-login")
def google_login(
    payload: GoogleLoginRequest,
    db: Session = Depends(get_db)
):
    user = upsert_user(db, email=payload.email, full_name=payload.full_name, avatar_url=payload.avatar_url, google_id=payload.google_id)
    if not user:
        raise HTTPException(status_code=400, detail="User could not be created or updated")
    return {"id": str(user.id), "email": user.email, "full_name": user.full_name, "avatar_url": user.avatar_url, "google_id": user.google_id}

# Admin route to list all users (for admin dashboard)
@router.get("/admin/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "google_id": user.google_id,
            "created_at": user.created_at,
            "last_login": user.last_login,
        }
        for user in users
    ]
