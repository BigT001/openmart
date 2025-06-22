from sqlalchemy import Column, String, Text, Integer, DECIMAL, ForeignKey, TIMESTAMP, func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base
import uuid

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_name = Column(String(255), nullable=False)
    business_description = Column(Text)
    logo_url = Column(String(255))
    cover_image_url = Column(String(255))
    business_email = Column(String(255))
    business_phone = Column(String(20))
    business_address = Column(Text)
    registration_number = Column(String(100))
    verification_status = Column(String(20), server_default='pending')
    rating = Column(DECIMAL(3,2), server_default='0')
    total_reviews = Column(Integer, server_default='0')
    bank_name = Column(String(255))
    bank_account_number = Column(String(50))
    bank_account_name = Column(String(255))
    category = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
