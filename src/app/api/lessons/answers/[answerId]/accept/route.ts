import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
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

    // Get answer and question details
    const [answerRows] = await pool.query<RowDataPacket[]>(
      `SELECT a.id, a.question_id, q.user_id as questionOwnerId
       FROM lesson_answers a
       JOIN lesson_questions q ON a.question_id = q.id
       WHERE a.id = ?`,
      [answerId]
    );

    if (answerRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Answer not found" },
        { status: 404 }
      );
    }

    const answer = answerRows[0];

    // Check if current user is the question owner
    if (answer.questionOwnerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Only question owner can accept answers" },
        { status: 403 }
      );
    }

    // Unaccept all other answers for this question
    await pool.query(
      `UPDATE lesson_answers SET is_accepted = 0 WHERE question_id = ?`,
      [answer.question_id]
    );

    // Accept this answer
    await pool.query(
      `UPDATE lesson_answers SET is_accepted = 1 WHERE id = ?`,
      [answerId]
    );

    // Update question status to RESOLVED
    await pool.query(
      `UPDATE lesson_questions SET status = 'RESOLVED' WHERE id = ?`,
      [answer.question_id]
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
