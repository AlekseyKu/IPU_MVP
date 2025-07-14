// frontend/src/app/api/challenges/upload/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const telegramId = formData.get('telegramId') as string;

  if (!file) {
    return NextResponse.json({ detail: 'Missing file' }, { status: 400 });
  }

  if (!telegramId) {
    return NextResponse.json({ detail: 'Missing telegramId' }, { status: 400 });
  }

  if (file.size > 30 * 1024 * 1024) {
    return NextResponse.json({ detail: 'File size exceeds 30MB limit' }, { status: 400 });
  }

  const validTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/avi', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ detail: `Invalid file type, only ${validTypes.join(', ')} are allowed` }, { status: 400 });
  }

  try {
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `challenges/${telegramId}/${Date.now()}_${cleanFilename}`;

    const { error: uploadError } = await supabase.storage
      .from('user-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      return NextResponse.json({ detail: `Storage upload error: ${uploadError.message}` }, { status: 400 });
    }

    const { data: urlData } = supabase.storage
      .from('user-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
  }
}