from typing import Optional, List, Dict
import chromadb
from chromadb.config import Settings
import os
import aiohttp
import numpy as np
import logging
from app.core.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DeepSeekEmbedding:
    """Custom embedding function for DeepSeek API"""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.deepseek.com/v1/embeddings"
        
    async def __call__(self, texts: list[str]) -> list[list[float]]:
        """Get embeddings for a list of texts"""
        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.api_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "input": texts,
                    "model": "deepseek-embed-base"
                }
            ) as response:
                if response.status != 200:
                    raise Exception(f"DeepSeek API error: {await response.text()}")
                    
                data = await response.json()
                return [embedding["embedding"] for embedding in data["data"]]

class VectorStore:
    _instance: Optional['VectorStore'] = None
    _collection = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorStore, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize ChromaDB client and collection"""
        try:
            # Create persistent directory if it doesn't exist
            os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
            
            # Initialize ChromaDB with persistence
            self.client = chromadb.PersistentClient(
                path=settings.CHROMA_PERSIST_DIRECTORY,
                settings=Settings(
                    allow_reset=True,
                    anonymized_telemetry=False
                )
            )
            
            # Get or create collection
            try:
                self._collection = self.client.get_collection(settings.CHROMA_COLLECTION_NAME)
                logger.info(f"Retrieved existing collection: {settings.CHROMA_COLLECTION_NAME}")
            except Exception as e:
                logger.info(f"Creating new collection: {settings.CHROMA_COLLECTION_NAME}")
                self._collection = self.client.create_collection(
                    name=settings.CHROMA_COLLECTION_NAME,
                    metadata={"description": "OpenMart products collection"}
                )
            
            logger.info("VectorStore initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing VectorStore: {str(e)}")
            raise
    
    @property
    def collection(self):
        """Get the ChromaDB collection, initializing if necessary"""
        if self._collection is None:
            self._initialize()
        return self._collection
    
    async def add_products(self, products: List[Dict]):
        """Add products to the vector store"""
        try:
            # Prepare documents, metadatas, and IDs
            documents = []
            metadatas = []
            ids = []
            
            for i, product in enumerate(products):
                # Create searchable text
                text = f"{product.get('title', '')} {product.get('description', '')}"
                
                # Remove None values from metadata
                metadata = {k: v for k, v in product.items() if v is not None}
                
                documents.append(text)
                metadatas.append(metadata)
                ids.append(f"product_{len(documents)}")
            
            # Add to collection
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            
        except Exception as e:
            logger.error(f"Error adding products to vector store: {str(e)}")
            raise

    async def search_products(self, query: str, n_results: int = 20) -> List[Dict]:
        """Search for products in the vector store"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                include=["metadatas", "distances"]
            )
            
            # Convert results to list of products
            products = []
            for i in range(len(results['metadatas'][0])):
                product = results['metadatas'][0][i]
                product['score'] = 1 - (results['distances'][0][i] if results['distances'] else 0)
                products.append(product)
                
            return products
            
        except Exception as e:
            logger.error(f"Error searching vector store: {str(e)}")
            raise
