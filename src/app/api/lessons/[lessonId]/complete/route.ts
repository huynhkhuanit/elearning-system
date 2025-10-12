import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
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
    const { lessonId } = params;

    // Check if progress record exists
    const [existingProgress] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId]
    );

    if (existingProgress.length > 0) {
      // Update existing progress
      await pool.query(
        `UPDATE lesson_progress 
         SET is_completed = 1, completed_at = NOW()
         WHERE user_id = ? AND lesson_id = ?`,
        [userId, lessonId]
      );
    } else {
      // Create new progress record
      await pool.query(
        `INSERT INTO lesson_progress (user_id, lesson_id, is_completed, completed_at)
         VALUES (?, ?, 1, NOW())`,
        [userId, lessonId]
      );
    }

    // Update enrollment progress
    // Get course_id from lesson
    const [lessonRows] = await pool.query<RowDataPacket[]>(
      `SELECT c.course_id 
       FROM lessons l
       INNER JOIN chapters c ON l.chapter_id = c.id
       WHERE l.id = ?`,
      [lessonId]
    );

    if (lessonRows.length > 0) {
      const courseId = lessonRows[0].course_id;

      // Calculate new progress percentage
      const [totalLessons] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as total
         FROM lessons l
         INNER JOIN chapters c ON l.chapter_id = c.id
         WHERE c.course_id = ?`,
        [courseId]
      );

      const [completedLessons] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as completed
         FROM lesson_progress lp
         INNER JOIN lessons l ON lp.lesson_id = l.id
         INNER JOIN chapters c ON l.chapter_id = c.id
         WHERE c.course_id = ? AND lp.user_id = ? AND lp.is_completed = 1`,
        [courseId, userId]
      );

      const total = totalLessons[0].total;
      const completed = completedLessons[0].completed;
      const progressPercentage = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

      // Update enrollment
      await pool.query(
        `UPDATE enrollments 
         SET progress_percentage = ?, last_lesson_id = ?
         WHERE user_id = ? AND course_id = ?`,
        [progressPercentage, lessonId, userId, courseId]
      );

      // Update learning activity for today
      const today = new Date().toISOString().split('T')[0];
      const [activityRows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM learning_activities WHERE user_id = ? AND activity_date = ?",
        [userId, today]
      );

      if (activityRows.length > 0) {
        await pool.query(
          `UPDATE learning_activities 
           SET lessons_completed = lessons_completed + 1
           WHERE user_id = ? AND activity_date = ?`,
          [userId, today]
        );
      } else {
        await pool.query(
          `INSERT INTO learning_activities (user_id, activity_date, lessons_completed)
           VALUES (?, ?, 1)`,
          [userId, today]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lesson marked as completed"
    });

  } catch (error) {
    console.error("Error marking lesson as completed:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

