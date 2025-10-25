import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
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
    const [existingLike] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM lesson_answer_likes WHERE answer_id = ? AND user_id = ?`,
      [answerId, userId]
    );

    if (existingLike.length > 0) {
      // Unlike
      await pool.query(
        `DELETE FROM lesson_answer_likes WHERE answer_id = ? AND user_id = ?`,
        [answerId, userId]
      );
      await pool.query(
        `UPDATE lesson_answers SET likes_count = likes_count - 1 WHERE id = ?`,
        [answerId]
      );
      return NextResponse.json({
        success: true,
        data: { liked: false },
        message: "Answer unliked",
      });
    } else {
      // Like
      await pool.query(
        `INSERT INTO lesson_answer_likes (answer_id, user_id) VALUES (?, ?)`,
        [answerId, userId]
      );
      await pool.query(
        `UPDATE lesson_answers SET likes_count = likes_count + 1 WHERE id = ?`,
        [answerId]
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
