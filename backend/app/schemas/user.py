# backend/app/schemas/user.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    telegram_id: int
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None

class UserResponse(BaseModel):
    id: int
    telegram_id: int
    username: str | None
    first_name: str | None
    last_name: str | None
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True