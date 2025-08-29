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

# Функции для работы с балансом пользователей
async def get_user_balance(telegram_id: int) -> int:
    """Получить баланс пользователя по telegram_id"""
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    
    try:
        async with pool.acquire() as connection:
            row = await connection.fetchrow(
                "SELECT balance FROM users WHERE telegram_id = $1",
                telegram_id
            )
            if row:
                return row['balance']
            else:
                logger.warning(f"User with telegram_id {telegram_id} not found")
                return 0
    except Exception as e:
        logger.error(f"Error getting user balance: {e}")
        raise

async def update_user_balance(telegram_id: int, amount: int) -> bool:
    """Обновить баланс пользователя (добавить amount к текущему балансу)"""
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    
    try:
        async with pool.acquire() as connection:
            result = await connection.execute(
                """
                UPDATE users 
                SET balance = balance + $2, updated_at = NOW()
                WHERE telegram_id = $1
                """,
                telegram_id, amount
            )
            
            if result == "UPDATE 1":
                logger.info(f"Successfully updated balance for user {telegram_id}: +{amount}")
                return True
            else:
                logger.warning(f"User with telegram_id {telegram_id} not found for balance update")
                return False
    except Exception as e:
        logger.error(f"Error updating user balance: {e}")
        raise

async def create_user_if_not_exists(telegram_id: int, username: str = None, first_name: str = None, last_name: str = None) -> bool:
    """Создать пользователя, если он не существует"""
    if pool is None:
        raise RuntimeError("Database pool is not initialized")
    
    try:
        async with pool.acquire() as connection:
            result = await connection.execute(
                """
                INSERT INTO users (telegram_id, username, first_name, last_name, balance)
                VALUES ($1, $2, $3, $4, 0)
                ON CONFLICT (telegram_id) DO NOTHING
                """,
                telegram_id, username, first_name, last_name
            )
            
            if result == "INSERT 0 1":
                logger.info(f"Created new user with telegram_id {telegram_id}")
                return True
            else:
                logger.info(f"User with telegram_id {telegram_id} already exists")
                return False
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise