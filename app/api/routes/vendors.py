from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.user import User
from app.models import vendor as vendor_model
import logging

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class VendorOnboardRequest(BaseModel):
    email: str  # Added email field
    business_name: str
    business_description: str
    business_phone: str
    business_address: str
    category: str

logger = logging.getLogger("openmart.vendors")
logger.info("VENDORS ROUTER LOADED: /vendors/onboard endpoint should be active.")

@router.post("/vendors/onboard")
def onboard_vendor(payload: VendorOnboardRequest, db: Session = Depends(get_db)):
    logger.info("[ONBOARD_VENDOR] Endpoint called. Payload: %s", payload.dict())
    try:
        user = db.query(User).filter(User.email == payload.email).first()
        logger.info("[ONBOARD_VENDOR] User lookup for email %s: %s", payload.email, "FOUND" if user else "NOT FOUND")
        if not user:
            logger.warning("[ONBOARD_VENDOR] User not found for email: %s", payload.email)
            raise HTTPException(status_code=404, detail="User not found")
        vendor = vendor_model.Vendor(
            user_id=user.id,
            business_name=payload.business_name,
            business_description=payload.business_description,
            business_phone=payload.business_phone,
            business_address=payload.business_address,
            category=payload.category,
        )
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        logger.info("[ONBOARD_VENDOR] Vendor created with id: %s", vendor.id)
        return {"vendor_id": str(vendor.id), "message": "Vendor onboarded successfully"}
    except Exception as e:
        logger.error("[ONBOARD_VENDOR] Error: %s", str(e), exc_info=True)
        raise

@router.get("/vendors/by-user")
def get_vendor_by_user(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"vendor": None}
    vendor = db.query(vendor_model.Vendor).filter(vendor_model.Vendor.user_id == user.id).first()
    return {"vendor": vendor.id if vendor else None}
