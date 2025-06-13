from typing import Dict, Optional, List
import re
from datetime import datetime
from bs4 import BeautifulSoup
from PIL import Image
import io
import requests
from app.core.config import settings

class ProductDataCleaner:
    def __init__(self):
        # Common price patterns in Nigerian context
        self.price_patterns = [
            r'(?:₦|NGN)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
            r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)',
            r'(?:price[:\s]+)(?:₦|NGN)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        ]
        
        # Keywords that indicate product condition
        self.condition_keywords = {
            'new': ['new', 'brand new', 'sealed', 'unopened'],
            'used': ['used', 'fairly used', 'pre-owned', 'preloved'],
            'refurbished': ['refurbished', 'renewed', 'restored']
        }
        
    def clean_product_data(self, raw_data: Dict) -> Optional[Dict]:
        """Clean and structure raw product data"""
        try:
            # Basic required fields
            if not all(k in raw_data for k in ['caption', 'image_url', 'username']):
                return None
                
            # Extract and validate price
            price = self._extract_price(raw_data['caption'])
            if not price:
                return None
                
            # Clean and structure data
            product = {
                'title': self._extract_title(raw_data['caption']),
                'description': self._clean_description(raw_data['caption']),
                'price': price,
                'condition': self._detect_condition(raw_data['caption']),
                'seller': f"@{raw_data['username']}",
                'source': 'Instagram',
                'post_url': raw_data.get('post_url', ''),
                'image_url': raw_data['image_url'],
                'processed_image': self._process_image(raw_data['image_url']),
                'tags': self._extract_tags(raw_data['caption']),
                'metadata': {
                    'processed_at': datetime.now().isoformat(),
                    'confidence_score': self._calculate_confidence(raw_data)
                }
            }
            
            return product if self._validate_product(product) else None
            
        except Exception as e:
            print(f"Error cleaning product data: {str(e)}")
            return None
            
    def _extract_price(self, text: str) -> Optional[float]:
        """Extract price from text using multiple patterns"""
        text = text.lower()
        for pattern in self.price_patterns:
            if match := re.search(pattern, text):
                try:
                    return float(match.group(1).replace(',', ''))
                except ValueError:
                    continue
        return None
        
    def _extract_title(self, caption: str) -> str:
        """Extract and clean product title"""
        # Take first non-empty line
        lines = [l.strip() for l in caption.split('\n') if l.strip()]
        if not lines:
            return "Untitled Product"
        
        title = lines[0]
        # Remove hashtags and mentions
        title = re.sub(r'#\w+|@\w+', '', title)
        # Remove excess whitespace
        title = ' '.join(title.split())
        # Limit length
        return title[:100] if len(title) > 100 else title
        
    def _clean_description(self, caption: str) -> str:
        """Clean and format product description"""
        # Remove hashtags and mentions
        desc = re.sub(r'#\w+|@\w+', '', caption)
        # Remove multiple newlines
        desc = re.sub(r'\n\s*\n', '\n', desc)
        # Remove excess whitespace
        desc = ' '.join(desc.split())
        return desc.strip()
        
    def _detect_condition(self, text: str) -> str:
        """Detect product condition from description"""
        text = text.lower()
        for condition, keywords in self.condition_keywords.items():
            if any(keyword in text for keyword in keywords):
                return condition
        return 'unknown'
        
    def _process_image(self, image_url: str) -> Dict:
        """Process and optimize product image"""
        try:
            response = requests.get(image_url)
            img = Image.open(io.BytesIO(response.content))
            
            # Generate thumbnail
            thumb = img.copy()
            thumb.thumbnail((300, 300))
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Optimize
            return {
                'width': img.width,
                'height': img.height,
                'format': img.format.lower(),
                'has_thumbnail': True,
                'is_optimized': True
            }
        except Exception:
            return {
                'width': None,
                'height': None,
                'format': None,
                'has_thumbnail': False,
                'is_optimized': False
            }
            
    def _extract_tags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        return [tag.strip('#') for tag in re.findall(r'#\w+', text)]
        
    def _calculate_confidence(self, data: Dict) -> float:
        """Calculate confidence score for product data"""
        score = 1.0
        
        # Reduce score based on missing or low-quality data
        if not data.get('caption'):
            score *= 0.5
        if not data.get('image_url'):
            score *= 0.5
        if len(data.get('caption', '')) < 50:
            score *= 0.8
            
        return round(score, 2)
        
    def _validate_product(self, product: Dict) -> bool:
        """Validate processed product data"""
        required_fields = ['title', 'price', 'image_url', 'seller']
        return all(field in product and product[field] for field in required_fields)
