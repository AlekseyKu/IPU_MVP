# backend/app/db.py
import os
from dotenv import load_dotenv
import ssl
from pathlib import Path
import asyncpg
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
CA_CERT_PATH = BASE_DIR / "supabase-ca.crt"

ssl_context = ssl.create_default_context(cafile=str(CA_CERT_PATH))

DATABASE_URL = os.getenv("DATABASE_URL")

# Модульная переменная для пула
pool = None

async def init_pool():
    global pool
    try:
        pool = await asyncpg.create_pool(
            dsn=DATABASE_URL,
            ssl=ssl_context,
            statement_cache_size=0,
            min_size=5,
            max_size=15,
            timeout=30
        )
        logger.info("Database pool created successfully")
    except Exception as e:
        logger.error(f"Failed to create database pool: {str(e)}")
        raise

async def close_pool():
    global pool
    if pool is not None:
        await pool.close()
        logger.info("Database pool closed")

async def get_db():
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    try:
        async with pool.acquire() as connection:
            yield connection
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise