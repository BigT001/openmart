from sqlalchemy.orm import Session
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Upsert user by google_id or email

def upsert_user(db: Session, *, email: str, full_name: str, avatar_url: str = None, google_id: str = None):
    user = db.query(User).filter((User.google_id == google_id) | (User.email == email)).first()
    now = datetime.utcnow()
    if user:
        user.full_name = full_name
        user.avatar_url = avatar_url
        user.last_login = now
        db.commit()
        db.refresh(user)
        return user
    else:
        user = User(
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            google_id=google_id,
            last_login=now
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
            return user
        except IntegrityError:
            db.rollback()
            return db.query(User).filter(User.email == email).first()
