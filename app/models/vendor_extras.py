from sqlalchemy import Column, String, Text, Integer, DECIMAL, ForeignKey, TIMESTAMP, Boolean, JSON, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db import Base
import uuid

class VendorAddress(Base):
    __tablename__ = "vendor_addresses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    label = Column(String(50))
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    phone = Column(String(20))
    is_default = Column(Boolean, default=False)
    added_at = Column(TIMESTAMP, server_default=func.now())

class VendorBankDetail(Base):
    __tablename__ = "vendor_bank_details"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    bank_name = Column(String(255))
    account_number = Column(String(50))
    account_name = Column(String(255))
    added_at = Column(TIMESTAMP, server_default=func.now())

class VendorReview(Base):
    __tablename__ = "vendor_reviews"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

class VendorLikeFollow(Base):
    __tablename__ = "vendor_likes_follows"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

class VendorView(Base):
    __tablename__ = "vendor_views"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    viewed_at = Column(TIMESTAMP, server_default=func.now())

class VendorSettings(Base):
    __tablename__ = "vendor_settings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, unique=True)
    notifications = Column(JSON)
    privacy = Column(JSON)
    dashboard_prefs = Column(JSON)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
