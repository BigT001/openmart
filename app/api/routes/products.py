from fastapi import APIRouter, HTTPException, status
from app.services.scraping_service import ScrapingService
from typing import List, Optional
from pydantic import BaseModel
import logging

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

# Configure router
router = APIRouter()

# Get logger
logger = logging.getLogger(__name__)

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
