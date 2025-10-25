import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET /api/lessons/questions/:questionId - Get question detail with answers
export async function GET(
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

    // Increment view count
    await pool.query(
      `UPDATE lesson_questions SET views_count = views_count + 1 WHERE id = ?`,
      [questionId]
    );

    // Get question details
    const [questionRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        q.id,
        q.title,
        q.content,
        q.status,
        q.answers_count as answersCount,
        q.likes_count as likesCount,
        q.views_count as viewsCount,
        q.created_at as createdAt,
        q.updated_at as updatedAt,
        u.id as userId,
        u.username,
        u.full_name as fullName,
        u.avatar_url as avatarUrl,
        EXISTS(
          SELECT 1 FROM lesson_question_likes lql 
          WHERE lql.question_id = q.id AND lql.user_id = ?
        ) as isLiked
      FROM lesson_questions q
      JOIN users u ON q.user_id = u.id
      WHERE q.id = ?`,
      [userId, questionId]
    );

    if (questionRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    const questionRow = questionRows[0];

    // Get answers
    const [answerRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        a.id,
        a.content,
        a.is_accepted as isAccepted,
        a.likes_count as likesCount,
        a.created_at as createdAt,
        a.updated_at as updatedAt,
        u.id as userId,
        u.username,
        u.full_name as fullName,
        u.avatar_url as avatarUrl,
        EXISTS(
          SELECT 1 FROM lesson_answer_likes lal 
          WHERE lal.answer_id = a.id AND lal.user_id = ?
        ) as isLiked
      FROM lesson_answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ?
      ORDER BY a.is_accepted DESC, a.likes_count DESC, a.created_at ASC`,
      [userId, questionId]
    );

    const question = {
      id: questionRow.id,
      title: questionRow.title,
      content: questionRow.content,
      status: questionRow.status,
      answersCount: questionRow.answersCount,
      likesCount: questionRow.likesCount,
      viewsCount: questionRow.viewsCount,
      createdAt: questionRow.createdAt,
      updatedAt: questionRow.updatedAt,
      isLiked: Boolean(questionRow.isLiked),
      user: {
        id: questionRow.userId,
        username: questionRow.username,
        fullName: questionRow.fullName,
        avatarUrl: questionRow.avatarUrl,
      },
      answers: answerRows.map((row) => ({
        id: row.id,
        content: row.content,
        isAccepted: Boolean(row.isAccepted),
        likesCount: row.likesCount,
        isLiked: Boolean(row.isLiked),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user: {
          id: row.userId,
          username: row.username,
          fullName: row.fullName,
          avatarUrl: row.avatarUrl,
        },
      })),
    };

    return NextResponse.json({
      success: true,
      data: { question },
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
