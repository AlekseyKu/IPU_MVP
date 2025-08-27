# bot/handlers/payments.py
from aiogram import Router, F
from aiogram.types import Message, PreCheckoutQuery
from aiogram.enums import ContentType
import httpx
import logging
import os

router = Router()
logger = logging.getLogger(__name__)

# Проверка перед оплатой
@router.pre_checkout_query()
async def process_pre_checkout_query(pre_checkout_q: PreCheckoutQuery):
    """Обработка pre-checkout запроса"""
    try:
        await pre_checkout_q.bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)
        logger.info(f"Pre-checkout approved for user {pre_checkout_q.from_user.id}")
    except Exception as e:
        logger.error(f"Error in pre-checkout: {e}")
        await pre_checkout_q.bot.answer_pre_checkout_query(pre_checkout_q.id, ok=False, error_message="Ошибка проверки платежа")

# Успешная оплата
@router.message(F.content_type == ContentType.SUCCESSFUL_PAYMENT)
async def successful_payment(message: Message):
    """Обработка успешного платежа"""
    try:
        payment = message.successful_payment
        logger.info(f"✅ Successful payment: {payment}")
        
        # Получаем payload (tx_id) и сумму
        payload = payment.invoice_payload
        amount = payment.total_amount
        
        if not payload:
            logger.error("No invoice_payload in successful payment")
            await message.answer("❌ Ошибка обработки платежа: отсутствует payload")
            return
        
        # Отправляем webhook на backend
        backend_url = os.getenv('BACKEND_URL', 'http://localhost:8000')
        
        async with httpx.AsyncClient() as client:
            webhook_data = {
                "message": {
                    "successful_payment": {
                        "invoice_payload": payload,
                        "total_amount": amount,
                        "telegram_payment_charge_id": payment.telegram_payment_charge_id
                    }
                }
            }
            
            try:
                response = await client.post(f"{backend_url}/api/payments/webhook", json=webhook_data, timeout=10.0)
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"✅ Webhook processed successfully: {result}")
                    
                    # Уведомляем пользователя
                    await message.answer(f"✅ Баланс успешно пополнен на {amount} ⭐!")
                else:
                    logger.error(f"❌ Webhook processing failed: {response.status_code} - {response.text}")
                    await message.answer("⚠️ Платеж прошел, но возникла ошибка при обновлении баланса. Обратитесь в поддержку.")
                    
            except httpx.TimeoutException:
                logger.error("❌ Webhook timeout")
                await message.answer("⚠️ Платеж прошел, но возникла ошибка при обновлении баланса. Обратитесь в поддержку.")
            except httpx.RequestError as e:
                logger.error(f"❌ Webhook request error: {e}")
                await message.answer("⚠️ Платеж прошел, но возникла ошибка при обновлении баланса. Обратитесь в поддержку.")
                
    except Exception as e:
        logger.error(f"Error processing successful payment: {e}")
        await message.answer("❌ Ошибка обработки платежа")
