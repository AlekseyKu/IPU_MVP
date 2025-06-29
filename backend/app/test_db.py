# backend/app/test_db.py
import os
from dotenv import load_dotenv
import ssl
from pathlib import Path
import asyncpg

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
CA_CERT_PATH = BASE_DIR / "supabase-ca.crt"

ssl_context = ssl.create_default_context(cafile=str(CA_CERT_PATH))

DATABASE_URL = os.getenv("DATABASE_URL")

async def test_connection():
    try:
        conn = await asyncpg.connect(
            dsn=DATABASE_URL,
            ssl=ssl_context
        )
        print("Connection successful!")
        
        # Проверка существования таблицы users
        result = await conn.fetch("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users');")
        table_exists = result[0][0]
        print(f"Table 'users' exists: {table_exists}")

        # Проверка данных
        users = await conn.fetch("SELECT telegram_id, username FROM users LIMIT 1;")
        print(f"Users in table: {users}")

        await conn.close()
    except Exception as e:
        print(f"Connection failed: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_connection())