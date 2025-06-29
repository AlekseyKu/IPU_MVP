# bot/handlers/user_private.py
from aiogram import Router
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import CommandStart
import httpx

from config import API_URL

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
            response = await client.post(f"{base_url}/api/users/", json=payload)  # Обновили путь
            response.raise_for_status()
            data = response.json()
            status_message = data.get("message", "Unknown status")
        except httpx.HTTPStatusError as e:
            status_message = f"Something went wrong. Try again later. Error: {e.response.status_code} - {e.response.text}"
        except Exception as e:
            status_message = f"Error occurred during registration. Details: {str(e)}"

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть платформу",
                    url="https://t.me/I_P_U_bot?startapp=1"
                )
            ]
        ]
    )
    await msg.answer(
        f"Привет, {msg.from_user.full_name}! Добро пожаловать 👋\n{status_message}",
        reply_markup=kb
    )