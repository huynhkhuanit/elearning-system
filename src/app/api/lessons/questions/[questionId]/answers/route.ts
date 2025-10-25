import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST /api/lessons/questions/:questionId/answers - Create an answer
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
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, message: "Content is required" },
        { status: 400 }
      );
    }

    // Check if user is enrolled
    const [enrollmentCheck] = await pool.query<RowDataPacket[]>(
      `SELECT e.id 
       FROM enrollments e
       JOIN lessons l ON l.chapter_id IN (
         SELECT ch.id FROM chapters ch WHERE ch.course_id = (
           SELECT ch2.course_id FROM chapters ch2 
           JOIN lessons l2 ON l2.chapter_id = ch2.id 
           WHERE l2.id = (
             SELECT lesson_id FROM lesson_questions WHERE id = ?
           )
         )
       )
       WHERE e.user_id = ? AND e.is_active = 1`,
      [questionId, userId]
    );

    if (enrollmentCheck.length === 0) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to answer questions" },
        { status: 403 }
      );
    }

    // Create answer
    await pool.query<ResultSetHeader>(
      `INSERT INTO lesson_answers (question_id, user_id, content)
       VALUES (?, ?, ?)`,
      [questionId, userId, content]
    );

    // Update question answers count and status
    await pool.query(
      `UPDATE lesson_questions 
       SET answers_count = answers_count + 1,
           status = CASE WHEN status = 'OPEN' THEN 'ANSWERED' ELSE status END
       WHERE id = ?`,
      [questionId]
    );

    return NextResponse.json({
      success: true,
      message: "Answer created successfully",
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
