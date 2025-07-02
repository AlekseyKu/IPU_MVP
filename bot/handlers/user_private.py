# bot/handlers/user_private.py
from aiogram import Router
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
import httpx
import os
from dotenv import load_dotenv

from config import API_URL

# Загружаем переменные из .env
load_dotenv()

router = Router()

@router.message(CommandStart())
async def start_command(msg: Message):
    base_url = API_URL.rstrip('/')
    async with httpx.AsyncClient() as client:
        payload = {
            "telegram_id": msg.from_user.id,
            "username": msg.from_user.username or "Unknown"
        }
        try:
            response = await client.post(f"{base_url}/api/users/", json=payload)
            response.raise_for_status()
            data = response.json()
            status_message = data.get("message", "Unknown status")
        except httpx.HTTPStatusError as e:
            status_message = f"Something went wrong. Try again later. Error: {e.response.status_code} - {e.response.text}"
        except Exception as e:
            status_message = f"Error occurred during registration. Details: {str(e)}"

    # Определяем URL на основе среды
    env = os.getenv("ENV", "dev")  # По умолчанию "dev", если ENV не задан
    frontend_url = os.getenv("FRONTEND_DEV_URL") if env == "dev" else os.getenv("FRONTEND_PROD_URL")
    if not frontend_url:
        raise ValueError("FRONTEND_DEV_URL or FRONTEND_PROD_URL not set in .env")

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть платформу",
                    web_app=WebAppInfo(url=frontend_url)
                )
            ]
        ]
    )
    await msg.answer(
        f"Привет, {msg.from_user.full_name}! Добро пожаловать 👋\n{status_message}",
        reply_markup=kb
   )