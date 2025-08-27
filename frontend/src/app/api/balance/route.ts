import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Getting user balance')

    // Получаем заголовки с данными пользователя
    const telegramUserId = request.headers.get('x-telegram-user-id')
    const telegramInitData = request.headers.get('x-telegram-init-data')

    // Формируем заголовки для backend
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (telegramUserId) {
      headers['x-telegram-user-id'] = telegramUserId
    }
    if (telegramInitData) {
      headers['x-telegram-init-data'] = telegramInitData
    }

    // Отправляем запрос на backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/balance`, {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.detail || 'Failed to get balance' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Balance retrieved:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error getting balance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
