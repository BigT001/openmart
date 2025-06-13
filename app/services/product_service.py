from typing import Dict, List
from datetime import datetime
import re

class ProductService:
    def __init__(self):
        self.relevance_weights = {
            'title_match': 0.4,
            'price_match': 0.3,
            'recency': 0.2,
            'seller_rating': 0.1
        }

    async def filter_products(
        self,
        products: List[Dict],
        query: Dict
    ) -> List[Dict]:
        """Filter and rank products based on the structured query"""
        try:
            filtered_products = []
            
            for product in products:
                if self._meets_criteria(product, query):
                    # Calculate relevance score
                    score = self._calculate_relevance(product, query)
                    product['relevance_score'] = score
                    filtered_products.append(product)
            
            # Sort by relevance score
            filtered_products.sort(
                key=lambda x: x.get('relevance_score', 0),
                reverse=True
            )
            
            # Remove relevance score before returning
            for product in filtered_products:
                product.pop('relevance_score', None)
            
            return filtered_products
            
        except Exception as e:
            raise Exception(f"Error filtering products: {str(e)}")

    def _meets_criteria(self, product: Dict, query: Dict) -> bool:
        """Check if product meets the search criteria"""
        try:
            # Check price range
            if 'price_range' in query:
                price = float(product['price'])
                if price > query['price_range'].get('maximum', float('inf')):
                    return False
                if price < query['price_range'].get('minimum', 0):
                    return False
            
            # Check product type/category
            if 'product_type' in query:
                if not self._text_similarity(
                    query['product_type'],
                    product['title']
                ):
                    return False
            
            # Check specifications
            if 'specifications' in query:
                if not all(
                    self._text_similarity(spec, product['title'])
                    for spec in query['specifications']
                ):
                    return False
            
            return True
            
        except Exception:
            return False

    def _calculate_relevance(self, product: Dict, query: Dict) -> float:
        """Calculate relevance score for a product"""
        score = 0.0
        
        # Title match score
        if 'product_type' in query:
            title_similarity = self._text_similarity(
                query['product_type'],
                product['title']
            )
            score += title_similarity * self.relevance_weights['title_match']
        
        # Price match score (closer to target = higher score)
        if 'price_range' in query and 'target_price' in query['price_range']:
            target = query['price_range']['target_price']
            actual = float(product['price'])
            price_diff_ratio = 1 - min(abs(target - actual) / target, 1)
            score += price_diff_ratio * self.relevance_weights['price_match']
        
        # Recency score
        if 'post_date' in product:
            days_old = (datetime.now() - product['post_date']).days
            recency_score = 1 - min(days_old / 30, 1)  # Older than 30 days = 0
            score += recency_score * self.relevance_weights['recency']
        
        # Seller rating score
        if 'seller_rating' in product:
            score += (product['seller_rating'] / 5) * self.relevance_weights['seller_rating']
        
        return score

    def _text_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate simple text similarity
        Could be enhanced with more sophisticated NLP in the future
        """
        text1 = text1.lower()
        text2 = text2.lower()
        
        # Check for exact matches first
        if text1 in text2 or text2 in text1:
            return 1.0
            
        # Calculate word overlap
        words1 = set(re.findall(r'\w+', text1))
        words2 = set(re.findall(r'\w+', text2))
        
        if not words1 or not words2:
            return 0.0
            
        overlap = len(words1.intersection(words2))
        total = len(words1.union(words2))
        
        return overlap / total
