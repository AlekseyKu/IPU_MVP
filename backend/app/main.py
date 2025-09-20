# backend/app/main.py
from fastapi import FastAPI
from app.routers import users
from contextlib import asynccontextmanager
import logging

from app.routers import payments_minimal

logger = logging.getLogger(__name__)

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up...")
    await init_pool()  # Инициализация пула
    yield
    logger.info("Shutting down...")
    await close_pool()  # Закрытие пула

app.router.lifespan_context = lifespan  # Установка lifespan контекста

app.include_router(users.router)
app.include_router(payments_minimal.router)

from app.db import init_pool, close_pool  # Импорт для использования в lifespan