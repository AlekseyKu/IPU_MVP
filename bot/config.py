# bot\config.py
import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "prod")

if ENV == "dev":
    FRONTEND_URL = os.getenv("FRONTEND_DEV_URL")
else:
    FRONTEND_URL = os.getenv("FRONTEND_PROD_URL")

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("API_URL", "http://localhost:8000")