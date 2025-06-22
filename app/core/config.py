from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional, List

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "OpenMart"
    LOG_LEVEL: str = "INFO"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520  # 8 days
    
    # AI Services - OpenRouter Configuration
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "deepseek-r1-distill-qwen-32b:free"
    
    # Vector Database
    CHROMA_PERSIST_DIRECTORY: str = "data/chromadb"
    CHROMA_COLLECTION_NAME: str = "products"
    
    # SQL Database
    DATABASE_URL: str = "sqlite:///./openmart.db"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "openmart"
    POSTGRES_PORT: str = "5432"
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    # Instagram Credentials
    INSTAGRAM_USERNAME: Optional[str] = None
    INSTAGRAM_PASSWORD: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]  # Allow all origins for dev
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"  # Allow extra fields from .env file

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Construct database URI if PostgreSQL credentials are provided
        if self.POSTGRES_USER and self.POSTGRES_PASSWORD:
            self.SQLALCHEMY_DATABASE_URI = (
                f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )
        else:
            self.SQLALCHEMY_DATABASE_URI = self.DATABASE_URL

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
