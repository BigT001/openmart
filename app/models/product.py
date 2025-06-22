from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    category = Column(String(100), nullable=False)
    status = Column(String(32), nullable=False, default="active")
    images = Column(JSON, nullable=False, default=list)  # List of image URLs/paths
    sku = Column(String(100), nullable=True)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey('vendors.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vendor = relationship("Vendor", back_populates="products")

# In vendor.py, add:
# products = relationship("Product", back_populates="vendor", cascade="all, delete-orphan")
