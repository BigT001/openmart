from typing import Dict, Optional
import time
from datetime import datetime

class RateLimiter:
    def __init__(self, max_requests: int = 100, time_window: int = 3600):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = []
        
    async def wait_if_needed(self):
        """Wait if rate limit is about to be exceeded"""
        now = time.time()
        
        # Remove old requests from tracking
        self.requests = [req_time for req_time in self.requests 
                        if now - req_time < self.time_window]
        
        # If we're at the limit, wait until oldest request expires
        if len(self.requests) >= self.max_requests:
            wait_time = self.requests[0] + self.time_window - now
            if wait_time > 0:
                await asyncio.sleep(wait_time)
            self.requests = self.requests[1:]
        
        # Add current request
        self.requests.append(now)

class RequestTracker:
    """Track request success/failure for adaptive backoff"""
    def __init__(self):
        self.failures = 0
        self.last_request = None
        self.backoff_time = 1  # Start with 1 second
        
    def record_success(self):
        """Record successful request"""
        self.failures = 0
        self.backoff_time = 1
        self.last_request = time.time()
        
    def record_failure(self):
        """Record failed request and increase backoff"""
        self.failures += 1
        self.backoff_time *= 2  # Exponential backoff
        self.last_request = time.time()
        
    def should_retry(self) -> bool:
        """Determine if we should retry based on failure count"""
        return self.failures < 3  # Max 3 retries

class ScrapingStats:
    """Track scraping statistics"""
    def __init__(self):
        self.start_time = datetime.now()
        self.posts_processed = 0
        self.products_found = 0
        self.errors = []
        
    def record_post(self):
        self.posts_processed += 1
        
    def record_product(self):
        self.products_found += 1
        
    def record_error(self, error: str):
        self.errors.append({
            'time': datetime.now(),
            'error': str(error)
        })
        
    def get_stats(self) -> Dict:
        return {
            'duration': (datetime.now() - self.start_time).total_seconds(),
            'posts_processed': self.posts_processed,
            'products_found': self.products_found,
            'error_count': len(self.errors),
            'last_errors': self.errors[-5:] if self.errors else []
        }
