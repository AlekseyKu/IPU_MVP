# bot\handlers\user_private.py
from aiogram import Router
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
import httpx

from config import FRONTEND_URL, API_URL

router = Router()

@router.message(CommandStart())
async def start_command(msg: Message):
    # Создание/проверка пользователя в БД через FastAPI
    async with httpx.AsyncClient() as client:
        payload = {
            "telegram_id": msg.from_user.id,
            "username": msg.from_user.username
        }
        try:
            response = await client.post(f"{API_URL}users", json=payload)
            response.raise_for_status()
            status_message = "Welcome! Your profile has been created." if response.status_code == 201 else "Welcome back! You're already registered."
        except httpx.HTTPStatusError as e:
            status_message = "Something went wrong. Try again later."
        except Exception:
            status_message = "Error occurred during registration."

    # Клавиатура
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть платформу",
                    # web_app=WebAppInfo(url=f"{FRONTEND_URL}/?startapp=1")
                    url="https://t.me/I_P_U_bot?startapp=1"
                )
            ]
        ]
    )
    await msg.answer(
        f"Привет, {msg.from_user.full_name}! Добро пожаловать 👋\n{status_message}",
        reply_markup=kb
    )