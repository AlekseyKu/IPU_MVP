# bot/handlers/user_private.py
from aiogram import Router
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
import httpx
import os
from dotenv import load_dotenv

from config import API_URL

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Загружаем переменные из .env
load_dotenv()

router = Router()

@router.message(CommandStart())
async def start_command(msg: Message):
    base_url = API_URL.rstrip('/')
    async with httpx.AsyncClient() as client:
        payload = {
            "telegram_id": msg.from_user.id,
            "username": msg.from_user.username or "Unknown",
            "first_name": msg.from_user.first_name,
            "last_name": msg.from_user.last_name
        }
        logger.info(f"Payload: {payload}")
        try:
            response = await client.post(f"{base_url}/api/users/", json=payload)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Response: {data}")
            status_message = data.get("message", "Unknown status")
        except httpx.HTTPStatusError as e:
            status_message = f"Something went wrong. Try again later. Error: {e.response.status_code} - {e.response.text}"
            logger.error(f"HTTP Error: {status_message}")
        except Exception as e:
            status_message = f"Error occurred during registration. Details: {str(e)}"
            logger.error(f"General Error: {status_message}")

    env = os.getenv("ENV", "dev")
    frontend_url = os.getenv("FRONTEND_DEV_URL") if env == "dev" else os.getenv("FRONTEND_PROD_URL")
    if not frontend_url:
        raise ValueError("FRONTEND_DEV_URL or FRONTEND_PROD_URL not set in .env")

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Open IPU App",
                    web_app=WebAppInfo(url=frontend_url)
                )
            ],
            [
                InlineKeyboardButton(
                    text="👥 Перейти в IPU-communityы",
                    url="https://t.me/IPU_community"
                )
            ]
        ]
    )
    await msg.answer(
        # f"Hello, {msg.from_user.full_name}! Welcome to the IPU App 👋\n{status_message}",
        f"Hello, {msg.from_user.full_name}! Welcome to the IPU App 👋",
        reply_markup=kb
    )