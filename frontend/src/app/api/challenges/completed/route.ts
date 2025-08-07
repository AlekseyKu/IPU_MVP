// frontend/src/app/api/challenges/completed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET - получение статистики завершённого челленджа
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challenge_id");
    const userId = searchParams.get("user_id");

    if (!challengeId || !userId) {
      return NextResponse.json(
        { detail: "Missing challenge_id or user_id" },
        { status: 400 }
      );
    }

    // Получаем данные завершённого челленджа
    const { data: completedChallenge, error } = await supabase
      .from("completed_challenges")
      .select("*")
      .eq("challenge_id", challengeId)
      .eq("user_id", parseInt(userId))
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Запись не найдена
        return NextResponse.json(
          { detail: "Completed challenge not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching completed challenge:", error);
      return NextResponse.json(
        { detail: "Error fetching completed challenge" },
        { status: 500 }
      );
    }

    return NextResponse.json(completedChallenge, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server error:", message);
    return NextResponse.json(
      { detail: `Server error: ${message}` },
      { status: 500 }
    );
  }
}

// POST - создание записи о завершённом челлендже
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { challenge_id, user_id, stats, final_comment, final_media_url } =
      body;

    if (!challenge_id || !user_id || !stats) {
      return NextResponse.json(
        { detail: "Missing required fields: challenge_id, user_id, stats" },
        { status: 400 }
      );
    }

    // Проверяем, что челлендж существует и завершён
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("id, is_completed, user_id")
      .eq("id", challenge_id)
      .single();

    if (challengeError || !challenge) {
      return NextResponse.json(
        { detail: "Challenge not found" },
        { status: 404 }
      );
    }

    if (!challenge.is_completed) {
      return NextResponse.json(
        { detail: "Challenge is not completed yet" },
        { status: 400 }
      );
    }

    if (challenge.user_id !== parseInt(user_id)) {
      return NextResponse.json({ detail: "Unauthorized" }, { status: 403 });
    }

    // Проверяем, что запись о завершении ещё не существует
    const { data: existingRecord } = await supabase
      .from("completed_challenges")
      .select("id")
      .eq("challenge_id", challenge_id)
      .eq("user_id", parseInt(user_id))
      .single();

    if (existingRecord) {
      return NextResponse.json(
        { detail: "Completed challenge record already exists" },
        { status: 409 }
      );
    }

    // Создаём запись о завершённом челлендже
    const { data: completedChallenge, error: insertError } = await supabase
      .from("completed_challenges")
      .insert({
        challenge_id,
        user_id: parseInt(user_id),
        stats,
        final_comment: final_comment || null,
        final_media_url: final_media_url || null,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating completed challenge record:", insertError);
      return NextResponse.json(
        { detail: "Error creating completed challenge record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Completed challenge record created successfully",
        completed_challenge: completedChallenge,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Server error:", message);
    return NextResponse.json(
      { detail: `Server error: ${message}` },
      { status: 500 }
    );
  }
}
