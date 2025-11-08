import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, update, db as supabaseAdmin } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST /api/lessons/answers/:answerId/accept - Accept an answer as solution
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ answerId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || "") as { userId: string };
    const userId = decoded.userId;
    const { answerId } = await params;

    // Get answer and question details using Supabase join
    const { data: answerData, error: answerError } = await supabaseAdmin!
      .from("lesson_answers")
      .select("id, question_id, lesson_questions!inner(user_id)")
      .eq("id", answerId)
      .single();

    if (answerError || !answerData) {
      return NextResponse.json(
        { success: false, message: "Answer not found" },
        { status: 404 }
      );
    }

    const questionOwnerId = (answerData.lesson_questions as any).user_id;
    const questionId = answerData.question_id;

    // Check if current user is the question owner
    if (questionOwnerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Only question owner can accept answers" },
        { status: 403 }
      );
    }

    // Unaccept all other answers for this question
    await update(
      "lesson_answers",
      { question_id: questionId },
      { is_accepted: false }
    );

    // Accept this answer
    await update(
      "lesson_answers",
      { id: answerId },
      { is_accepted: true }
    );

    // Update question status to RESOLVED
    await update(
      "lesson_questions",
      { id: questionId },
      { status: "RESOLVED" }
    );

    return NextResponse.json({
      success: true,
      message: "Answer accepted as solution",
    });
  } catch (error) {
    console.error("Error accepting answer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
