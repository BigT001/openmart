from sqlalchemy import Column, String, Text, Integer, DECIMAL, ForeignKey, TIMESTAMP, Boolean, JSON, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db import Base
import uuid

class Admin(Base):
    __tablename__ = "admins"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(255))
    role = Column(String(50), nullable=False)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    last_login = Column(TIMESTAMP, server_default=func.now())

    activity_logs = relationship("AdminActivityLog", back_populates="admin", cascade="all, delete-orphan")
    permissions = relationship("AdminPermission", back_populates="admin", cascade="all, delete-orphan")
    notifications = relationship("AdminNotification", back_populates="admin", cascade="all, delete-orphan")
    settings = relationship("AdminSettings", back_populates="admin", uselist=False, cascade="all, delete-orphan")

class AdminActivityLog(Base):
    __tablename__ = "admin_activity_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id", ondelete="CASCADE"), nullable=False)
    action = Column(String(255), nullable=False)
    target_type = Column(String(50), nullable=False)
    target_id = Column(String(255), nullable=False)
    details = Column(JSON)
    created_at = Column(TIMESTAMP, server_default=func.now())

    admin = relationship("Admin", back_populates="activity_logs")

class AdminPermission(Base):
    __tablename__ = "admin_permissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id", ondelete="CASCADE"), nullable=False)
    permission = Column(String(100), nullable=False)
    granted_at = Column(TIMESTAMP, server_default=func.now())

    admin = relationship("Admin", back_populates="permissions")

class AdminNotification(Base):
    __tablename__ = "admin_notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    admin = relationship("Admin", back_populates="notifications")

class AdminSettings(Base):
    __tablename__ = "admin_settings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id", ondelete="CASCADE"), nullable=False, unique=True)
    dashboard_prefs = Column(JSON)
    notifications = Column(JSON)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    admin = relationship("Admin", back_populates="settings")
