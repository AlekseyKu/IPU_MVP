// // frontend/src/app/api/promises/route.ts
// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const {
//       user_id,
//       title,
//       deadline,
//       content,
//       media_url,
//       is_public,
//     } = body;

//     if (!user_id || !title || !deadline) {
//       return NextResponse.json({ detail: 'Missing required fields' }, { status: 400 });
//     }

//     const now = new Date();
//     if (new Date(deadline) <= now) {
//       return NextResponse.json({ detail: 'Deadline must be in the future' }, { status: 400 });
//     }

//     const { error } = await supabase.from('promises').insert({
//       user_id: Number(user_id),
//       title,
//       deadline,
//       content,
//       media_url,
//       created_at: new Date().toISOString(),
//       is_completed: false,
//       is_public: is_public ?? true,
//     });

//     if (error) {
//       return NextResponse.json({ detail: `Database error: ${error.message}` }, { status: 400 });
//     }

//     return NextResponse.json({ message: 'Promise created successfully' }, { status: 201 });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'Unknown error';
//     return NextResponse.json({ detail: `Server error: ${message}` }, { status: 500 });
//   }
// }