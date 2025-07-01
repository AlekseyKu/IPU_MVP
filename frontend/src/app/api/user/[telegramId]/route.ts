// frontend/src/app/api/user/[telegramId]/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: Promise<{ telegramId: string }> }) {
  const params = await context.params; // Асинхронное получение params
  const telegramId = parseInt(params.telegramId, 10);
  const res = await fetch(`http://localhost:8000/api/users/${telegramId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  const data = await res.json();
  return NextResponse.json(data);
}