# backend/app/db.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import ssl

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
# Создаем SSL контекст с сертификатом Supabase
ssl_context = ssl.create_default_context(cafile="supabase-ca.crt")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={
        "ssl": ssl_context,  # Включаем SSL
    }
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_connect=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session