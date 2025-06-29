# backend/app/schemas/user.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    telegram_id: int
    username: str | None = None

class UserResponse(BaseModel):
    id: int
    telegram_id: int
    username: str | None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True