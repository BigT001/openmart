from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core import logging  # Ensure logging is configured before anything else
import logging as pylogging
from fastapi.staticfiles import StaticFiles

logger = pylogging.getLogger("openmart")

from app.api.routes import search, products, users
from app.api.routes import vendors

# Create FastAPI application
app = FastAPI(
    title="OpenMart API",
    description="AI-powered social commerce platform API",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files configuration
app.mount("/static", StaticFiles(directory="static"), name="static")

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

logger.debug("Registering users router")
app.include_router(users.router, prefix="/api")

logger.debug("Registering vendors router")
app.include_router(vendors.router, prefix="/api")
