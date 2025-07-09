// frontend/src/app/api/users/[telegramId]/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request, context: { params: Promise<{ telegramId: string }> }) {
  const { telegramId } = await context.params;
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const initData = formData.get('initData') as string;
  const file_type = formData.get('file_type') as string;

  console.log('Received initData:', initData);
  console.log('Bucket: user-images, using SUPABASE_SERVICE_ROLE_KEY');

  if (!file) {
    return NextResponse.json({ detail: 'Missing file' }, { status: 400 });
  }
  if (!initData) {
    return NextResponse.json({ detail: 'Missing initData' }, { status: 400 });
  }
  if (!['hero', 'avatar'].includes(file_type)) {
    return NextResponse.json({ detail: 'Invalid file_type, must be "hero" or "avatar"' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ detail: 'File size exceeds 5MB limit' }, { status: 400 });
  }
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return NextResponse.json({ detail: 'Invalid file type, only PNG and JPEG are allowed' }, { status: 400 });
  }

  try {
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${telegramId}/${file_type}/${Date.now()}_${cleanFilename}`;
    console.log('Uploading file:', fileName);

    const { error: uploadError } = await supabase.storage
      .from('user-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Supabase storage error:', uploadError);
      return NextResponse.json({ detail: `Storage upload error: ${uploadError.message}` }, { status: 400 });
    }

    const { data: urlData } = supabase.storage.from('user-images').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;
    console.log('Public URL:', publicUrl);

    const { error: updateError } = await supabase
      .from('users')
      .update({ [`${file_type}_img_url`]: publicUrl })
      .eq('telegram_id', parseInt(telegramId, 10));

    if (updateError) {
      console.error('Supabase database error:', updateError);
      return NextResponse.json({ detail: `Database update error: ${updateError.message}` }, { status: 400 });
    }

    return NextResponse.json({ message: 'Image uploaded successfully', url: publicUrl });
  } catch (error: unknown) {
    console.error('Error in upload handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ detail: `Server error: ${errorMessage}` }, { status: 500 });
  }
}