import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, insert, deleteRows, update } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST /api/lessons/answers/:answerId/like - Toggle like on an answer
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

    // Check if already liked
    const existingLike = await queryOneBuilder<{ id: string }>(
      "lesson_answer_likes",
      {
        select: "id",
        filters: { answer_id: answerId, user_id: userId }
      }
    );

    if (existingLike) {
      // Unlike
      await deleteRows(
        "lesson_answer_likes",
        { answer_id: answerId, user_id: userId }
      );
      
      // Get current likes count and decrement
      const answer = await queryOneBuilder<{ likes_count: number }>(
        "lesson_answers",
        {
          select: "likes_count",
          filters: { id: answerId }
        }
      );
      
      await update(
        "lesson_answers",
        { id: answerId },
        { likes_count: Math.max(0, (answer?.likes_count || 0) - 1) }
      );
      
      return NextResponse.json({
        success: true,
        data: { liked: false },
        message: "Answer unliked",
      });
    } else {
      // Like
      await insert(
        "lesson_answer_likes",
        { answer_id: answerId, user_id: userId }
      );
      
      // Get current likes count and increment
      const answer = await queryOneBuilder<{ likes_count: number }>(
        "lesson_answers",
        {
          select: "likes_count",
          filters: { id: answerId }
        }
      );
      
      await update(
        "lesson_answers",
        { id: answerId },
        { likes_count: (answer?.likes_count || 0) + 1 }
      );
      
      return NextResponse.json({
        success: true,
        data: { liked: true },
        message: "Answer liked",
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
