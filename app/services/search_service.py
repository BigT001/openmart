from typing import Dict, List, Optional
import time
from app.core.config import settings
from app.core.vector_store import VectorStore
from app.services.scraping_service import ScrapingService
from app.services.deepseek_service import DeepSeekService

class SearchService:
    def __init__(self):
        self.deepseek = DeepSeekService()
        self.scraping_service = ScrapingService()
        self.vector_store = VectorStore()

    async def process_prompt(self, prompt: str) -> Dict:
        """Process natural language prompt into structured query"""
        try:
            # Use DeepSeek service to process the prompt
            structured_query = await self.deepseek.process_prompt(prompt)
            
            # Log the query for analysis
            await self._log_query(prompt, structured_query)
            
            return structured_query
        except Exception as e:
            raise Exception(f"Error processing prompt: {str(e)}")
            
    async def _log_query(self, prompt: str, structured_query: Dict):
        """Log the query and its structured form for analysis"""
        # TODO: Implement query logging to database
        pass

        """Search for products in the vector database"""
        try:
            # Convert structured query to search text
            search_text = self._build_query_text(structured_query)
            
            # Search vector database
            results = await self.vector_store.search_products(
                query=search_text,
                n_results=20
            )
            
            # Filter results based on structured query criteria
            filtered_results = []
            for product in results:
                if self._meets_criteria(product, structured_query):
                    filtered_results.append(product)
            
            return filtered_results
            
        except Exception as e:
            raise Exception(f"Error searching vector database: {str(e)}")

    async def search_vector_db(self, structured_query: Dict) -> List[Dict]:
        """Search through the product database for products that match the user's input ONLY (not all products)."""
        from app.db import get_db
        from app.models.product import Product
        from sqlalchemy.orm import Session
        from sqlalchemy import or_, and_
        import re
        db_gen = get_db()
        db: Session = next(db_gen)
        try:
            # Build filters from structured_query
            filters = []
            # Only add filters if the value is present and not empty
            if 'product_type' in structured_query and structured_query['product_type']:
                filters.append(Product.category.ilike(f"%{structured_query['product_type']}%"))
            if 'brands' in structured_query and structured_query['brands']:
                brand_filters = [Product.name.ilike(f"%{brand}%") for brand in structured_query['brands'] if brand]
                if brand_filters:
                    filters.append(or_(*brand_filters))
            if 'colors' in structured_query and structured_query['colors']:
                color_filters = [Product.name.ilike(f"%{color}%") for color in structured_query['colors'] if color]
                if color_filters:
                    filters.append(or_(*color_filters))
            if 'specifications' in structured_query and structured_query['specifications']:
                spec_filters = [Product.description.ilike(f"%{spec}%") for spec in structured_query['specifications'] if spec]
                if spec_filters:
                    filters.append(or_(*spec_filters))
            if 'price_range' in structured_query and structured_query['price_range']:
                min_price = structured_query['price_range'].get('minimum', 0)
                max_price = structured_query['price_range'].get('maximum', float('inf'))
                filters.append(Product.price >= min_price)
                if max_price and max_price != float('inf'):
                    filters.append(Product.price <= max_price)
            # Add more filters as needed (location, etc.)

            # If no filters, return empty (do not return all products)
            if not filters:
                return []

            # Main search: only products matching ALL filters
            query = db.query(Product).filter(and_(*filters))
            products = query.order_by(Product.created_at.desc()).limit(50).all()

            # Format results for frontend
            results = []
            for product in products:
                results.append({
                    "title": product.name,
                    "image": product.images[0] if product.images and isinstance(product.images, list) and len(product.images) > 0 else "",
                    "seller": str(product.vendor_id) if product.vendor_id else "",
                    "source": "OpenMart",
                    "post_url": f"/products/{product.id}",
                    "price": product.price,
                    "add_to_cart": True
                })
            return results
        except Exception as e:
            raise Exception(f"Error searching product database: {str(e)}")
        finally:
            db.close()
    def _build_query_text(self, structured_query: Dict) -> str:
        """Build a search query text from structured query, skipping None values"""
        query_parts = []
        # Add product type
        if 'product_type' in structured_query and structured_query['product_type']:
            query_parts.append(str(structured_query['product_type']))
        # Add specifications
        if 'specifications' in structured_query and structured_query['specifications']:
            query_parts.extend([str(s) for s in structured_query['specifications'] if s is not None])
        # Add brands
        if 'brands' in structured_query and structured_query['brands']:
            query_parts.extend([str(b) for b in structured_query['brands'] if b is not None])
        # Add colors
        if 'colors' in structured_query and structured_query['colors']:
            query_parts.extend([str(c) for c in structured_query['colors'] if c is not None])
        # Add style
        if 'style' in structured_query and structured_query['style']:
            query_parts.append(str(structured_query['style']))
        # Remove any empty or None values
        query_parts = [part for part in query_parts if part and part != 'None']
        return ' '.join(query_parts)

    def _meets_criteria(self, product: Dict, structured_query: Dict) -> bool:
        """Check if product meets the structured query criteria"""
        try:
            # Check price range
            if 'price_range' in structured_query:
                price = float(product.get('price', 0))
                min_price = structured_query['price_range'].get('minimum', 0)
                max_price = structured_query['price_range'].get('maximum', float('inf'))
                
                if price < min_price or price > max_price:
                    return False

            # Check brands
            if 'brands' in structured_query and structured_query['brands']:
                product_brand = product.get('brand', '').lower()
                if not any(brand.lower() in product_brand for brand in structured_query['brands']):
                    return False

            # Check colors
            if 'colors' in structured_query and structured_query['colors']:
                product_color = product.get('color', '').lower()
                if not any(color.lower() in product_color for color in structured_query['colors']):
                    return False

            return True
        except Exception:
            return False

    async def scrape_social_media(self, structured_query: Dict) -> List[Dict]:
        """Trigger social media scraping for fresh results"""
        try:
            # Use scraping service to get fresh results
            products = await self.scraping_service.scrape_instagram(structured_query)
            
            # Store new products in ChromaDB
            if products:
                await self.store_in_vector_db(products)
            
            return products
        except Exception as e:
            raise Exception(f"Error scraping social media: {str(e)}")

    async def store_in_vector_db(self, products: List[Dict]):
        """Store new products in the vector database"""
        try:
            await self.vector_store.add_products(products)
        except Exception as e:
            raise Exception(f"Error storing products in vector database: {str(e)}")

    async def scrape_and_store_products(self, structured_query: Dict):
        """Background task to scrape and store new products"""
        try:
            # Scrape new products
            scraped_products = await self.scrape_social_media(structured_query)
            
            if not scraped_products:
                return
                
            # Store new products in vector database
            await self.store_in_vector_db(scraped_products)
            
        except Exception as e:
            # Log error but don't raise since this is a background task
            print(f"Error in background scraping: {str(e)}")
            # TODO: Add proper error logging
