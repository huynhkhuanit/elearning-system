import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET /api/lessons/:lessonId/questions - Get all questions for a lesson
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
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

    const { lessonId } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const sortBy = searchParams.get("sortBy") || "RECENT";
    const search = searchParams.get("search") || "";

    let query = `
      SELECT 
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
      WHERE q.lesson_id = ?
    `;

    const queryParams: any[] = [userId, lessonId];

    // Filter by status
    if (status !== "ALL") {
      query += ` AND q.status = ?`;
      queryParams.push(status);
    }

    // Search
    if (search) {
      query += ` AND (q.title LIKE ? OR q.content LIKE ?)`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // Sort
    if (sortBy === "POPULAR") {
      query += ` ORDER BY q.likes_count DESC, q.created_at DESC`;
    } else {
      query += ` ORDER BY q.is_pinned DESC, q.created_at DESC`;
    }

    const [rows] = await pool.query<RowDataPacket[]>(query, queryParams);

    const questions = rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      status: row.status,
      answersCount: row.answersCount,
      likesCount: row.likesCount,
      viewsCount: row.viewsCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: {
        id: row.userId,
        username: row.username,
        fullName: row.fullName,
        avatarUrl: row.avatarUrl,
      },
      isLiked: Boolean(row.isLiked),
    }));

    return NextResponse.json({
      success: true,
      data: { questions },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/lessons/:lessonId/questions - Create a new question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
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

    const { lessonId } = await params;
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    // Check if user is enrolled in the course
    const [enrollmentRows] = await pool.query<RowDataPacket[]>(
      `SELECT e.id 
       FROM enrollments e
       JOIN lessons l ON l.chapter_id IN (
         SELECT ch.id FROM chapters ch WHERE ch.course_id = (
           SELECT ch2.course_id FROM chapters ch2 
           JOIN lessons l2 ON l2.chapter_id = ch2.id 
           WHERE l2.id = ?
         )
       )
       WHERE e.user_id = ? AND e.is_active = 1`,
      [lessonId, userId]
    );

    if (enrollmentRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to ask questions" },
        { status: 403 }
      );
    }

    // Create question
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO lesson_questions (lesson_id, user_id, title, content, status)
       VALUES (?, ?, ?, ?, 'OPEN')`,
      [lessonId, userId, title, content]
    );

    return NextResponse.json({
      success: true,
      data: { questionId: result.insertId },
      message: "Question created successfully",
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
