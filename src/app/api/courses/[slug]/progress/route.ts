import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
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
    const { slug } = await params;

    // Get course ID
    const [courseRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM courses WHERE slug = ?",
      [slug]
    );

    if (courseRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = courseRows[0].id;

    // Check if user is enrolled
    const [enrollmentRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    if (enrollmentRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Not enrolled" },
        { status: 403 }
      );
    }

    // Get all lessons for this course
    const [lessons] = await pool.query<RowDataPacket[]>(
      `SELECT l.id 
       FROM lessons l
       INNER JOIN chapters c ON l.chapter_id = c.id
       WHERE c.course_id = ?`,
      [courseId]
    );

    const lessonIds = lessons.map(l => l.id);

    if (lessonIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          completedLessons: [],
          progress: 0,
          totalLessons: 0,
          completedCount: 0
        }
      });
    }

    // Get lesson progress
    const [progressRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        lesson_id,
        is_completed,
        watch_time,
        last_position
       FROM lesson_progress
       WHERE user_id = ? AND lesson_id IN (?)`,
      [userId, lessonIds]
    );

    const completedLessons = progressRows
      .filter(p => p.is_completed === 1)
      .map(p => p.lesson_id);

    const progressMap = progressRows.reduce((acc, p) => {
      acc[p.lesson_id] = {
        isCompleted: p.is_completed === 1,
        watchTime: p.watch_time,
        lastPosition: p.last_position
      };
      return acc;
    }, {} as Record<string, any>);

    const totalLessons = lessonIds.length;
    const completedCount = completedLessons.length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedCount / totalLessons) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        completedLessons,
        progressMap,
        progress: progressPercentage,
        totalLessons,
        completedCount,
        enrollment: enrollmentRows[0]
      }
    });

  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

