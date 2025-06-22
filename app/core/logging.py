import logging
import os

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Set up logging to file with DEBUG level and error tracebacks
logging.basicConfig(
    filename='logs/openmart.log',
    level=logging.DEBUG,  # Capture all logs, including errors
    format='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
    force=True
)

# Add a stream handler for console output (optional, for dev)
console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
console.setFormatter(formatter)
logging.getLogger('').addHandler(console)
