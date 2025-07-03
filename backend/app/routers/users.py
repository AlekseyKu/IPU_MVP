# backend/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_db
import asyncpg
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/")
async def create_user(user: dict, db: asyncpg.Connection = Depends(get_db)):
    try:
        telegram_id = user.get("telegram_id")
        username = user.get("username")
        first_name = user.get("first_name")
        last_name = user.get("last_name")

        if not telegram_id or not isinstance(telegram_id, int):
            raise HTTPException(status_code=400, detail="Invalid telegram_id")

        existing_user = await db.fetchrow(
            "SELECT telegram_id FROM users WHERE telegram_id = $1",
            telegram_id
        )
        if existing_user:
            await db.execute(
                "UPDATE users SET username = $2, first_name = $3, last_name = $4, updated_at = NOW() WHERE telegram_id = $1",
                telegram_id, username, first_name, last_name
            )
            logger.info(f"User updated: telegram_id={telegram_id}")
            return {
                "message": "Welcome back! Your profile has been updated.",
                "telegram_id": telegram_id,
                "username": username,
                "first_name": first_name,
                "last_name": last_name
            }

        await db.execute(
            "INSERT INTO users (telegram_id, username, first_name, last_name) VALUES ($1, $2, $3, $4)",
            telegram_id, username, first_name, last_name
        )
        logger.info(f"User created: telegram_id={telegram_id}")
        return {
            "message": "Welcome! Your profile has been created.",
            "telegram_id": telegram_id,
            "username": username,
            "first_name": first_name,
            "last_name": last_name
        }
    except Exception as e:
        logger.error(f"Error in create_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{telegram_id}")
async def get_user(telegram_id: int, db: asyncpg.Connection = Depends(get_db)):
    try:
        user = await db.fetchrow(
            "SELECT telegram_id, username, first_name, last_name FROM users WHERE telegram_id = $1",
            telegram_id
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        logger.info(f"User retrieved: telegram_id={telegram_id}")
        return {
            "telegram_id": user["telegram_id"],
            "username": user["username"],
            "first_name": user["first_name"],
            "last_name": user["last_name"]
        }
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")