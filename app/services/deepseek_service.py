from typing import Dict, Any, Optional, List
import json
import aiohttp
from app.core.config import settings
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename='logs/openmart.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DeepSeekService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.OPENROUTER_MODEL
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        logger.info(f"DeepSeek service initialized with model: {self.model}")
        
        self.system_prompt = """You are a smart shopping assistant that helps understand user shopping requests.
        Extract structured information from the shopping query.
        
        Guidelines:
        1. Price ranges should be exact numbers when specified
        2. Product type should be specific but general enough for categorization
        3. Specifications should include all important details
        4. Consider Nigerian market context and currency (NGN/₦)
        
        Always return a JSON object with the following fields:
        {
            "product_type": "string - Main product category or type",
            "specifications": ["list of key features or requirements"],
            "price_range": {
                "minimum": float or null,
                "maximum": float or null,
                "target": float or null
            },
            "brands": ["list of mentioned brands"],
            "colors": ["list of color preferences"],
            "condition": "string - new/used/any",
            "urgency": "string - delivery timing if mentioned",
            "location": "string - location preferences if mentioned",
            "style": "string - style preferences if mentioned",
            "size": "string - size requirements if mentioned"
        }
        """

    async def _call_api(self, messages: List[Dict[str, str]]) -> Dict:
        """Make an API call to OpenRouter"""
        logger.info(f"Making API call to OpenRouter with model: {self.model}")
        
        async with aiohttp.ClientSession() as session:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "HTTP-Referer": "https://openmart.com",  # Your website URL
                "X-Title": "OpenMart",  # Your app name
                "Content-Type": "application/json"
            }
            data = {
                "model": self.model,
                "messages": messages,
                "temperature": 0.1  # Low temperature for consistent, structured output
            }
            
            try:
                async with session.post(self.api_url, json=data, headers=headers) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"OpenRouter API error: Status {response.status}, Response: {error_text}")
                        raise Exception(f"OpenRouter API error: {error_text}")
                    
                    result = await response.json()
                    logger.info("Successfully received response from OpenRouter")
                    return result
            except Exception as e:
                logger.error(f"Error calling OpenRouter API: {str(e)}")
                raise

    async def process_prompt(self, query: str) -> Dict[str, Any]:
        """Process a natural language shopping query into structured data"""
        logger.info(f"Processing prompt: {query}")
        
        try:
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": query}
            ]
            
            response = await self._call_api(messages)
            
            # Extract the JSON response from the model's output
            try:
                response_text = response['choices'][0]['message']['content']
                logger.info(f"Raw model response: {response_text}")
                
                # Find JSON object between curly braces
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start >= 0 and end > start:
                    json_str = response_text[start:end]
                    structured_data = json.loads(json_str)
                    logger.info(f"Successfully parsed structured data: {structured_data}")
                else:
                    raise ValueError("No JSON found in response")
                
            except (json.JSONDecodeError, KeyError, ValueError) as e:
                logger.error(f"Failed to parse model response: {str(e)}")
                raise Exception("Failed to parse structured data from model response")
            
            # Ensure all required fields are present
            required_fields = [
                "product_type", "specifications", "price_range",
                "brands", "colors", "condition"
            ]
            
            for field in required_fields:
                if field not in structured_data:
                    structured_data[field] = [] if field in ["specifications", "brands", "colors"] else None
                    logger.warning(f"Missing field '{field}' in response, initialized with default value")
                    
            return structured_data
            
        except Exception as e:
            logger.error(f"Error in process_prompt: {str(e)}")
            raise Exception(f"Error processing query: {str(e)}")
