from typing import Dict, List, Optional
import instaloader
import asyncio
import re
from datetime import datetime, timedelta
import logging
from app.core.config import settings
from app.services.utils.scraping_utils import RateLimiter, RequestTracker, ScrapingStats
from app.services.utils.product_cleaner import ProductDataCleaner
from app.core.vector_store import VectorStore

# Configure logging
logging.basicConfig(
    filename='logs/openmart.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ScrapingService:
    def __init__(self):
        logger.info("Initializing ScrapingService...")
        self.ig = instaloader.Instaloader(
            download_pictures=False,
            download_videos=False,
            download_video_thumbnails=False,
            download_geotags=False,
            download_comments=False,
            save_metadata=False
        )
        
        # Initialize utilities
        self.rate_limiter = RateLimiter(max_requests=100, time_window=3600)  # 100 requests per hour
        self.request_tracker = RequestTracker()
        self.stats = ScrapingStats()
        self.cleaner = ProductDataCleaner()
        
        # Initialize VectorStore
        try:
            self.vector_store = VectorStore()
            logger.info("✅ Successfully initialized VectorStore")
        except Exception as e:
            logger.error(f"⚠️ Error initializing VectorStore: {str(e)}")
            raise
        
        # Login if credentials are provided
        if settings.INSTAGRAM_USERNAME and settings.INSTAGRAM_PASSWORD:
            logger.info(f"Attempting Instagram login with username: {settings.INSTAGRAM_USERNAME}")
            try:
                self.ig.login(settings.INSTAGRAM_USERNAME, settings.INSTAGRAM_PASSWORD)
                self.request_tracker.record_success()
                logger.info("✅ Successfully logged into Instagram")
                
                # Verify login by attempting to get profile info
                try:
                    profile = instaloader.Profile.from_username(self.ig.context, settings.INSTAGRAM_USERNAME)
                    logger.info(f"✅ Login verified - Account name: {profile.full_name}, Followers: {profile.followers}")
                except Exception as e:
                    logger.error(f"⚠️ Could not verify login profile: {str(e)}")
                    
            except Exception as e:
                self.request_tracker.record_failure()
                logger.error(f"❌ Instagram login failed: {str(e)}")
                logger.error("Please check your Instagram credentials in .env file")
        else:
            logger.warning("⚠️ No Instagram credentials provided in .env file")
                
        logger.info("ScrapingService initialization completed")

    async def scrape_instagram(self, structured_query: Dict) -> List[Dict]:
        """Scrape Instagram for products matching the query"""
        logger.info(f"Starting Instagram scrape for query: {structured_query}")
        
        try:
            products = []
            search_tags = self._generate_search_tags(structured_query)
            logger.info(f"Generated search tags: {search_tags}")
            
            for tag in search_tags:
                logger.info(f"Processing tag: {tag}")
                await self.rate_limiter.wait_if_needed()
                
                try:
                    logger.info(f"Fetching posts for tag: {tag}")
                    posts = self.ig.get_hashtag_posts(tag)
                    self.request_tracker.record_success()
                    
                    count = 0
                    for post in posts:
                        # Limit number of posts per tag
                        if count >= 10:
                            logger.info(f"Reached post limit (10) for tag: {tag}")
                            break
                            
                        # Record post processing
                        self.stats.record_post()
                        logger.info(f"Processing post {post.shortcode}")
                            
                        # Only get recent posts (last 7 days)
                        if post.date > (datetime.now() - timedelta(days=7)):
                            try:
                                # Extract product information
                                product_info = self._extract_product_info(post, structured_query)
                                
                                if product_info:
                                    # Clean and validate product data
                                    cleaned_product = self.cleaner.clean_product_data(product_info)
                                    
                                    if cleaned_product:
                                        # Check if product meets query criteria
                                        if self._meets_criteria(cleaned_product, structured_query):
                                            products.append(cleaned_product)
                                            count += 1
                                            self.stats.record_product()
                                            logger.info(f"Added product from post {post.shortcode}")
                                        else:
                                            logger.info(f"Post {post.shortcode} didn't meet criteria")
                                    else:
                                        logger.warning(f"Product cleaning failed for post {post.shortcode}")
                                else:
                                    logger.info(f"No product info extracted from post {post.shortcode}")
                                    
                            except Exception as e:
                                self.stats.record_error(f"Error processing post {post.shortcode}: {str(e)}")
                                logger.error(f"Error processing post {post.shortcode}: {str(e)}")
                                continue
                        else:
                            logger.info(f"Skipped old post {post.shortcode}")
                                
                except Exception as e:
                    self.request_tracker.record_failure()
                    error_msg = f"Error fetching tag {tag}: {str(e)}"
                    self.stats.record_error(error_msg)
                    logger.error(error_msg)
                    
                    # If we should retry, wait and continue
                    if self.request_tracker.should_retry():
                        retry_time = self.request_tracker.backoff_time
                        logger.info(f"Will retry tag {tag} after {retry_time} seconds")
                        await asyncio.sleep(retry_time)
                        continue
                    else:
                        logger.warning(f"Max retries reached for tag {tag}, skipping")
                        break
            
            # Log final statistics
            stats = self.stats.get_stats()
            logger.info(f"Scraping completed. Statistics: {stats}")
            logger.info(f"Found {len(products)} matching products")
            return products
            
        except Exception as e:
            error_msg = f"Error scraping Instagram: {str(e)}"
            self.stats.record_error(error_msg)
            logger.error(error_msg)
            raise Exception(error_msg)

    def _meets_criteria(self, product: Dict, query: Dict) -> bool:
        """Check if product meets the search criteria"""
        try:
            logger.info(f"Checking criteria for product against query: {query}")
            
            # Check price range if specified
            if 'price_range' in query:
                price = float(product.get('price', 0))
                min_price = query['price_range'].get('minimum', 0)
                max_price = query['price_range'].get('maximum', float('inf'))
                
                if price < min_price or price > max_price:
                    logger.info(f"Product price {price} outside range [{min_price}, {max_price}]")
                    return False
            
            # Check brands if specified
            if 'brands' in query and query['brands']:
                product_brand = product.get('brand', '').lower()
                if not any(brand.lower() in product_brand for brand in query['brands']):
                    logger.info(f"Product brand {product_brand} not in requested brands {query['brands']}")
                    return False
            
            logger.info("Product meets all criteria")
            return True
            
        except Exception as e:
            logger.error(f"Error checking criteria: {str(e)}")
            return False

    def _generate_search_tags(self, query: Dict) -> List[str]:
        """Generate relevant hashtags for Instagram search"""
        logger.info(f"Generating search tags for query: {query}")
        tags = []
        
        # Add product type tags
        if 'product_type' in query:
            tags.append(query['product_type'].lower().replace(' ', ''))
            
        # Add brand tags
        if 'brands' in query and query['brands']:
            for brand in query['brands']:
                tags.append(brand.lower().replace(' ', ''))
                
        # Add generic market tags
        tags.extend(['forsale', 'marketplace', 'shopping'])
        
        logger.info(f"Generated tags: {tags}")
        return tags

    def _extract_product_info(self, post: instaloader.Post, query: Dict) -> Optional[Dict]:
        """Extract product information from an Instagram post"""
        try:
            logger.info(f"Extracting product info from post {post.shortcode}")
            
            # Use regex to find price in caption
            price_match = re.search(r'(?:₦|NGN)\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', post.caption)
            if not price_match:
                logger.info(f"No price found in post {post.shortcode}")
                return None
                
            price = float(price_match.group(1).replace(',', ''))
            logger.info(f"Found price: {price}")
            
            # Check if price is within specified range
            if 'price_range' in query:
                if price > query['price_range'].get('maximum', float('inf')):
                    logger.info(f"Price {price} above maximum {query['price_range'].get('maximum')}")
                    return None
                if price < query['price_range'].get('minimum', 0):
                    logger.info(f"Price {price} below minimum {query['price_range'].get('minimum')}")
                    return None
            
            product_data = {
                'title': self._extract_title(post.caption),
                'price': price,
                'image': post.url,
                'seller': f"@{post.owner_username}",
                'source': 'Instagram',
                'post_url': f"https://instagram.com/p/{post.shortcode}",
                'add_to_cart': True
            }
            
            logger.info(f"Successfully extracted product info: {product_data}")
            return product_data
            
        except Exception as e:
            logger.error(f"Error extracting product info from post {post.shortcode}: {str(e)}")
            return None

    def _extract_title(self, caption: str) -> str:
        """Extract product title from post caption"""
        # Take first line or first 100 characters
        title = caption.split('\n')[0][:100]
        # Clean up hashtags and mentions
        title = re.sub(r'#\w+|@\w+', '', title).strip()
        logger.info(f"Extracted title: {title}")
        return title
