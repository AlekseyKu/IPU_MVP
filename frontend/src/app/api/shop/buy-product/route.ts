import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json()

    console.log('🛒 Creating product payment for:', product)

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
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/payments/create-product`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        product
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.detail || 'Failed to create product payment' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Product payment created:', data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Error creating product payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
