# backend/app/routers/payments_minimal.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import httpx
import os
import logging

router = APIRouter(prefix="/api", tags=["payments"])
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")

class PaymentCreate(BaseModel):
    amount: int = Field(..., gt=0, le=10000)

class InvoiceResponse(BaseModel):
    invoice_link: str

class BalanceResponse(BaseModel):
    balance: int

@router.get("/balance", response_model=BalanceResponse)
async def get_balance():
    # Заглушка: возвращаем 0, баланс не трогаем
    return BalanceResponse(balance=0)

@router.post("/payments/create", response_model=InvoiceResponse)
async def create_payment(data: PaymentCreate):
    if not BOT_TOKEN:
        logger.error("BOT_TOKEN is not set")
        raise HTTPException(status_code=500, detail="Bot token not configured")

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/createInvoiceLink"
    request_data = {
        "title": "Test payment",
        "description": f"Test Stars payment for {data.amount} ⭐",
        "payload": f"test_{data.amount}",
        "currency": "XTR",
        "prices": [{"label": "Top-up", "amount": data.amount}]
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=request_data, timeout=10.0)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="Telegram API error")
        body = resp.json()
        if not body.get("ok"):
            raise HTTPException(status_code=400, detail=body.get("description", "Telegram API error"))
        return InvoiceResponse(invoice_link=body.get("result"))
