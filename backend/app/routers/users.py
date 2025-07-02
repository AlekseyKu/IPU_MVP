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
        if not telegram_id or not isinstance(telegram_id, int):
            raise HTTPException(status_code=400, detail="Invalid telegram_id")
        if not username or not isinstance(username, str):
            raise HTTPException(status_code=400, detail="Invalid username")

        existing_user = await db.fetchrow(
            "SELECT telegram_id FROM users WHERE telegram_id = $1",
            telegram_id
        )
        if existing_user:
            return {"message": "Welcome back! You're already registered.", "telegram_id": telegram_id, "username": username}

        await db.execute(
            "INSERT INTO users (telegram_id, username) VALUES ($1, $2)",
            telegram_id,
            username
        )
        logger.info(f"User created: telegram_id={telegram_id}")
        logger.info(f"User created: telegram_id={telegram_id}")
        return {"message": "Welcome! Your profile has been created.", "telegram_id": telegram_id, "username": username}
    except Exception as e:
        logger.error(f"Error in create_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{telegram_id}")
async def get_user(telegram_id: int, db: asyncpg.Connection = Depends(get_db)):
    try:
        user = await db.fetchrow(
            "SELECT telegram_id, username FROM users WHERE telegram_id = $1",
            telegram_id
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        logger.info(f"User retrieved: telegram_id={telegram_id}")
        return {"telegram_id": user["telegram_id"], "username": user["username"]}
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")