from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
from app.services.search_service import SearchService

router = APIRouter()

class SearchQuery(BaseModel):
    prompt: str

class ProductResponse(BaseModel):
    title: str
    image: str
    seller: str
    source: str
    post_url: str
    price: float
    add_to_cart: bool = True

@router.post("/search", response_model=List[ProductResponse])
async def search_products(query: SearchQuery, background_tasks: BackgroundTasks):
    try:
        # Initialize services
        search_service = SearchService()
        
        # 1. Process natural language query
        structured_query = await search_service.process_prompt(query.prompt)
        
        # 2. Search vector database
        products = await search_service.search_vector_db(structured_query)
        
        # 3. Trigger background scraping if needed
        if len(products) < 10:
            background_tasks.add_task(
                search_service.scrape_and_store_products,
                structured_query
            )
            
        # 4. Return results
        return products[:20]  # Return top 20 results
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing search request: {str(e)}"
        )
