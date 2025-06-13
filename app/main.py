from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
import logging
import os
from app.api.routes import search, products

# Configure logging first, before any other operations
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    filename='logs/openmart.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    force=True  # Ensure we don't have multiple handlers
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="OpenMart API",
    description="AI-powered social commerce platform API",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handling middleware
@app.middleware("http")
async def error_handling(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        logger.error(f"Request to {request.url} failed: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
logger.debug("Registering search router")
app.include_router(search.router, prefix="/api", tags=["search"])

logger.debug("Registering products router")
app.include_router(products.router, prefix="/api/products", tags=["products"])
