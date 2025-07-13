// frontend/src/app/api/promises/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const telegramId = formData.get('telegramId') as string;

  console.log('Received file:', file?.name, 'Type:', file?.type, 'Size:', file?.size);

  if (!file) {
    return NextResponse.json({ detail: 'Missing file' }, { status: 400 });
  }
  if (!telegramId) {
    return NextResponse.json({ detail: 'Missing telegramId' }, { status: 400 });
  }
  if (file.size > 30 * 1024 * 1024) { // Увеличен лимит до 30MB
    return NextResponse.json({ detail: 'File size exceeds 30MB limit' }, { status: 400 });
  }
  const validTypes = ['image/png', 'image/jpeg', 'video/mp4', 'video/avi', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    console.error('Invalid file type:', file.type, 'Allowed types:', validTypes);
    return NextResponse.json({ detail: `Invalid file type, only ${validTypes.join(', ')} are allowed` }, { status: 400 });
  }

  try {
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `promises/${telegramId}/${Date.now()}_${cleanFilename}`;
    console.log('Uploading file:', fileName, 'Type:', file.type);

    const { error: uploadError } = await supabase.storage
      .from('user-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError.message);
      return NextResponse.json({ detail: `Storage upload error: ${uploadError.message}` }, { status: 400 });
    }

    const { data: urlData } = supabase.storage.from('user-images').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;
    console.log('Public URL:', publicUrl);

    return NextResponse.json({ url: publicUrl });
  } catch (error: unknown) {
    console.error('Error in upload handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${errorMessage}` }, { status: 500 });
  }
}