// frontend/src/app/api/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - получить лайки для поста
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('post_id');
  const postType = searchParams.get('post_type');
  const userId = searchParams.get('user_id');

  if (!postId || !postType) {
    return NextResponse.json({ error: 'post_id and post_type are required' }, { status: 400 });
  }

  try {
    // Получаем общее количество лайков для поста
    const { data: likesCount, error: countError } = await supabase
      .from('likes')
      .select('id', { count: 'exact' })
      .eq('post_id', postId)
      .eq('post_type', postType);

    if (countError) {
      console.error('Error fetching likes count:', countError);
      return NextResponse.json({ error: 'Failed to fetch likes count' }, { status: 500 });
    }

    // Проверяем, лайкнул ли текущий пользователь этот пост
    let isLikedByUser = false;
    if (userId) {
      const { data: userLike, error: userLikeError } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('post_type', postType)
        .eq('user_id', userId)
        .single();

      if (!userLikeError && userLike) {
        isLikedByUser = true;
      }
    }

    return NextResponse.json({
      likes_count: likesCount?.length || 0,
      is_liked_by_user: isLikedByUser
    });
  } catch (error) {
    console.error('Error in GET /api/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - поставить лайк
export async function POST(request: NextRequest) {
  try {
    const { post_id, post_type, user_id } = await request.json();

    if (!post_id || !post_type || !user_id) {
      return NextResponse.json({ error: 'post_id, post_type, and user_id are required' }, { status: 400 });
    }

    if (!['promise', 'challenge'].includes(post_type)) {
      return NextResponse.json({ error: 'post_type must be "promise" or "challenge"' }, { status: 400 });
    }

    // Проверяем существование поста перед созданием лайка
    const tableName = post_type === 'promise' ? 'promises' : 'challenges';
    const { data: post, error: postError } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      console.error(`Error checking post existence:`, postError);
      return NextResponse.json({ error: `${post_type} not found` }, { status: 404 });
    }

    // Проверяем существование пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('telegram_id')
      .eq('telegram_id', user_id)
      .single();

    if (userError || !user) {
      console.error('Error checking user existence:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Проверяем, существует ли уже лайк от этого пользователя
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', post_id)
      .eq('post_type', post_type)
      .eq('user_id', user_id)
      .single();

    if (existingLike) {
      return NextResponse.json({ error: 'Like already exists' }, { status: 409 });
    }

    // Создаем новый лайк
    const { data: newLike, error: insertError } = await supabase
      .from('likes')
      .insert({
        post_id,
        post_type,
        user_id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating like:', insertError);
      return NextResponse.json({ error: 'Failed to create like' }, { status: 500 });
    }

    return NextResponse.json(newLike);
  } catch (error) {
    console.error('Error in POST /api/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - убрать лайк
export async function DELETE(request: NextRequest) {
  try {
    const { post_id, post_type, user_id } = await request.json();

    if (!post_id || !post_type || !user_id) {
      return NextResponse.json({ error: 'post_id, post_type, and user_id are required' }, { status: 400 });
    }

    // Удаляем лайк
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', post_id)
      .eq('post_type', post_type)
      .eq('user_id', user_id);

    if (deleteError) {
      console.error('Error deleting like:', deleteError);
      return NextResponse.json({ error: 'Failed to delete like' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/likes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 