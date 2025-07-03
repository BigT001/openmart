from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.product import Product as ProductModel
from app.models.vendor import Vendor
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid
import logging
import os
import json
from uuid import UUID

# Define response models
class Product(BaseModel):
    title: str
    price: float
    image: str
    seller: str
    source: str = "Instagram"
    post_url: str

class ErrorResponse(BaseModel):
    detail: str

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    category: str
    status: Optional[str] = "active"
    images: List[str] = Field(default_factory=list)
    sku: Optional[str] = None
    vendor_id: Optional[str] = None

class ProductOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    stock: int
    category: str
    status: str
    images: List[str]
    sku: Optional[str]
    vendor_id: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

# Configure router
router = APIRouter()

# Get logger
logger = logging.getLogger(__name__)

# Always resolve uploads to the project root static/uploads
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UPLOAD_DIR = os.path.join(PROJECT_ROOT, "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get(
    "/featured",
    response_model=List[Product],
    responses={
        200: {"model": List[Product], "description": "Successfully retrieved featured products"},
        404: {"model": ErrorResponse, "description": "No products found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def get_featured_products():
    """Get featured products from Instagram"""
    try:
        logger.info("Starting featured products fetch")
        scraping_service = ScrapingService()
        
        # Default query to fetch trending products
        query = {
            "product_type": "trending",
            "specifications": ["featured"],
            "limit": 8  # Limit to 8 featured products
        }
        
        # Fetch products
        products = await scraping_service.search_products(query)
        
        if not products:
            logger.warning("No featured products found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No featured products found"
            )
        
        logger.info(f"Successfully fetched {len(products)} featured products")
        return products
        
    except Exception as e:
        logger.error(f"Error fetching featured products: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching featured products: {str(e)}"
        )

@router.post("/", response_model=ProductOut, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        db_product = ProductModel(
            id=str(uuid.uuid4()),
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            category=product.category,
            status=product.status or "active",
            images=product.images,
            sku=product.sku,
            vendor_id=product.vendor_id,
        )
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        # Ensure vendor_id is a string for the response
        if db_product.vendor_id is not None:
            db_product.vendor_id = str(db_product.vendor_id)
        return db_product
    except Exception as e:
        logging.error(f"Error creating product: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create product.")

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Only allow image files
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        # Save file with a unique name
        ext = os.path.splitext(file.filename)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        # Construct public URL (assuming static is served at /static)
        url = f"/static/uploads/{filename}"
        return {"url": url}
    except Exception as e:
        logger.error(f"Image upload failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Image upload failed.")

@router.get("/", response_model=List[ProductOut])
def get_products(vendor_id: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(ProductModel)
    if vendor_id:
        query = query.filter(ProductModel.vendor_id == vendor_id)
    products = query.order_by(ProductModel.created_at.desc()).all()
    # Ensure vendor_id is a string for all products
    for p in products:
        if p.vendor_id is not None:
            p.vendor_id = str(p.vendor_id)
    return products

@router.get("/{product_id}", tags=["products"])
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    result = {c.name: getattr(product, c.name) for c in product.__table__.columns}
    # If images is a JSON/text column, parse it if needed
    if isinstance(result.get("images"), str):
        try:
            result["images"] = json.loads(result["images"])
        except Exception:
            pass
    return result
