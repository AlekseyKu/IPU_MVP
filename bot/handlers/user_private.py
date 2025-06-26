from aiogram import Router
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart

router = Router()

@router.message(CommandStart())
async def start_command(msg: Message):
    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть платформу",
                    web_app=WebAppInfo(url="https://yourdomain.com/app")  # 👉 сюда свой URL
                )
            ]
        ]
    )
    await msg.answer(
        f"Привет, {msg.from_user.full_name}! Добро пожаловать 👋",
        reply_markup=kb
    )
