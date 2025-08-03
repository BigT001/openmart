from sqlalchemy import Column, String, Text, Integer, DECIMAL, ForeignKey, TIMESTAMP, Boolean, JSON, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db import Base
import uuid

class UserAddress(Base):
    __tablename__ = "user_addresses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
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

class UserPayment(Base):
    __tablename__ = "user_payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    payment_method = Column(String(50))
    provider = Column(String(50))
    account_number = Column(String(50))
    expiry = Column(String(10))
    added_at = Column(TIMESTAMP, server_default=func.now())

class UserLikeShare(Base):
    __tablename__ = "user_likes_shares"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50))
    target_id = Column(String(255))
    action = Column(String(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    notifications = Column(JSON)
    privacy = Column(JSON)
    dashboard_prefs = Column(JSON)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
