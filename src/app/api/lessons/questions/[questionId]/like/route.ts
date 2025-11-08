import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, insert, deleteRows, update } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST /api/lessons/questions/:questionId/like - Toggle like on a question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
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
    const { questionId } = await params;

    // Check if already liked
    const existingLike = await queryOneBuilder<{ id: string }>(
      "lesson_question_likes",
      {
        select: "id",
        filters: { question_id: questionId, user_id: userId }
      }
    );

    if (existingLike) {
      // Unlike
      await deleteRows(
        "lesson_question_likes",
        { question_id: questionId, user_id: userId }
      );
      
      // Get current likes count and decrement
      const question = await queryOneBuilder<{ likes_count: number }>(
        "lesson_questions",
        {
          select: "likes_count",
          filters: { id: questionId }
        }
      );
      
      await update(
        "lesson_questions",
        { id: questionId },
        { likes_count: Math.max(0, (question?.likes_count || 0) - 1) }
      );
      
      return NextResponse.json({
        success: true,
        data: { liked: false },
        message: "Question unliked",
      });
    } else {
      // Like
      await insert(
        "lesson_question_likes",
        { question_id: questionId, user_id: userId }
      );
      
      // Get current likes count and increment
      const question = await queryOneBuilder<{ likes_count: number }>(
        "lesson_questions",
        {
          select: "likes_count",
          filters: { id: questionId }
        }
      );
      
      await update(
        "lesson_questions",
        { id: questionId },
        { likes_count: (question?.likes_count || 0) + 1 }
      );
      
      return NextResponse.json({
        success: true,
        data: { liked: true },
        message: "Question liked",
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
