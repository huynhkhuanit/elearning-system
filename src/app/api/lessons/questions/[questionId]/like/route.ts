import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
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
    const [existingLike] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM lesson_question_likes WHERE question_id = ? AND user_id = ?`,
      [questionId, userId]
    );

    if (existingLike.length > 0) {
      // Unlike
      await pool.query(
        `DELETE FROM lesson_question_likes WHERE question_id = ? AND user_id = ?`,
        [questionId, userId]
      );
      await pool.query(
        `UPDATE lesson_questions SET likes_count = likes_count - 1 WHERE id = ?`,
        [questionId]
      );
      return NextResponse.json({
        success: true,
        data: { liked: false },
        message: "Question unliked",
      });
    } else {
      // Like
      await pool.query(
        `INSERT INTO lesson_question_likes (question_id, user_id) VALUES (?, ?)`,
        [questionId, userId]
      );
      await pool.query(
        `UPDATE lesson_questions SET likes_count = likes_count + 1 WHERE id = ?`,
        [questionId]
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
