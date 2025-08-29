# backend/app/routers/payments_minimal.py
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
import httpx
import os
import logging
import json
from typing import Optional
from app.db import get_user_balance, update_user_balance, create_user_if_not_exists

router = APIRouter(prefix="/api", tags=["payments"])
logger = logging.getLogger(__name__)

BOT_TOKEN = os.getenv("BOT_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN")

class PaymentCreate(BaseModel):
    amount: int = Field(..., gt=0, le=10000)

class InvoiceResponse(BaseModel):
    invoice_link: str

class BalanceResponse(BaseModel):
    balance: int

class WebhookData(BaseModel):
    message: dict

@router.get("/balance", response_model=BalanceResponse)
async def get_balance(x_telegram_user_id: Optional[str] = Header(None)):
    """Получение баланса пользователя"""
    if not x_telegram_user_id:
        raise HTTPException(status_code=400, detail="Telegram user ID required")
    
    try:
        telegram_id = int(x_telegram_user_id)
        balance = await get_user_balance(telegram_id)
        logger.info(f"Getting balance for user {telegram_id}: {balance}")
        return BalanceResponse(balance=balance)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid telegram user ID")
    except Exception as e:
        logger.error(f"Error getting balance: {e}")
        raise HTTPException(status_code=500, detail="Database error")

@router.post("/payments/create", response_model=InvoiceResponse)
async def create_payment(
    data: PaymentCreate,
    x_telegram_user_id: Optional[str] = Header(None)
):
    """Создание платежа"""
    if not BOT_TOKEN:
        logger.error("BOT_TOKEN is not set")
        raise HTTPException(status_code=500, detail="Bot token not configured")
    
    if not x_telegram_user_id:
        raise HTTPException(status_code=400, detail="Telegram user ID required")
    
    try:
        telegram_id = int(x_telegram_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid telegram user ID")

    # Создаем payload с telegram_id для идентификации пользователя
    payload_data = {
        "telegram_id": telegram_id,
        "amount": data.amount
    }
    payload = json.dumps(payload_data)

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/createInvoiceLink"
    request_data = {
        "title": "Test payment",
        "description": f"Test Stars payment for {data.amount} ⭐",
        "payload": payload,
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

@router.post("/payments/webhook")
async def process_payment_webhook(webhook_data: WebhookData):
    """Обработка webhook'а от бота при успешном платеже"""
    try:
        logger.info(f"Received webhook data: {webhook_data}")
        
        # Извлекаем данные платежа
        message = webhook_data.message
        successful_payment = message.get("successful_payment")
        
        if not successful_payment:
            logger.error("No successful_payment data in webhook")
            raise HTTPException(status_code=400, detail="Invalid webhook data")
        
        # Получаем данные платежа
        payload = successful_payment.get("invoice_payload")
        amount = successful_payment.get("total_amount")
        telegram_payment_charge_id = successful_payment.get("telegram_payment_charge_id")
        
        logger.info(f"Processing payment: payload={payload}, amount={amount}, charge_id={telegram_payment_charge_id}")
        
        # Парсим payload для получения telegram_id
        try:
            payload_data = json.loads(payload)
            telegram_id = payload_data.get("telegram_id")
            if not telegram_id:
                raise ValueError("No telegram_id in payload")
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Error parsing payload: {e}")
            raise HTTPException(status_code=400, detail="Invalid payload format")
        
        # Обновляем баланс пользователя в БД
        try:
            success = await update_user_balance(telegram_id, amount)
            if success:
                logger.info(f"✅ Payment processed successfully: {amount} stars for user {telegram_id}")
            else:
                logger.error(f"❌ Failed to update balance for user {telegram_id}")
                raise HTTPException(status_code=500, detail="Failed to update user balance")
        except Exception as e:
            logger.error(f"Database error updating balance: {e}")
            raise HTTPException(status_code=500, detail="Database error")
        
        return {
            "status": "success",
            "message": f"Payment processed: {amount} stars for user {telegram_id}",
            "payload": payload,
            "amount": amount,
            "telegram_id": telegram_id
        }
        
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail=f"Webhook processing error: {str(e)}")
