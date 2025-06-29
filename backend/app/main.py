# backend/app/main.py
from fastapi import FastAPI
from app.routers import users
from app.db import engine
from app.models.user import Base

app = FastAPI()

app.include_router(users.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)