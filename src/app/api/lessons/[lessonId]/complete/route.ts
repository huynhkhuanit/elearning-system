import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, insert, update, queryBuilder, db as supabaseAdmin } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

    // Get course_id from lesson via chapter first (needed for enrollment_id)
    const lesson = await queryOneBuilder<{ chapter_id: string }>(
      "lessons",
      {
        select: "chapter_id",
        filters: { id: lessonId }
      }
    );

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 }
      );
    }

    const chapter = await queryOneBuilder<{ course_id: string }>(
      "chapters",
      {
        select: "course_id",
        filters: { id: lesson.chapter_id }
      }
    );

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: "Chapter not found" },
        { status: 404 }
      );
    }

    const courseId = chapter.course_id;

    // Get enrollment_id from enrollments table
    const enrollment = await queryOneBuilder<{ id: string }>(
      "enrollments",
      {
        select: "id",
        filters: { user_id: userId, course_id: courseId }
      }
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "User is not enrolled in this course" },
        { status: 404 }
      );
    }

    const enrollmentId = enrollment.id;

    // Check if progress record exists
    const existingProgress = await queryOneBuilder<{ id: string }>(
      "lesson_progress",
      {
        select: "id",
        filters: { user_id: userId, lesson_id: lessonId }
      }
    );

    if (existingProgress) {
      // Update existing progress
      await update(
        "lesson_progress",
        { user_id: userId, lesson_id: lessonId },
        { is_completed: true, completed_at: new Date().toISOString() }
      );
    } else {
      // Create new progress record
      await insert("lesson_progress", {
        user_id: userId,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        is_completed: true,
        completed_at: new Date().toISOString()
      });
    }

    // Calculate new progress percentage using Supabase joins
    // Get total lessons for this course
    const { data: courseLessonsData, error: lessonsError } = await supabaseAdmin!
      .from("lessons")
      .select("id, chapters!inner(course_id)")
      .eq("chapters.course_id", courseId);

    const total = courseLessonsData?.length || 0;

    // Get completed lessons count for this course
    const { data: completedProgressData, error: progressError } = await supabaseAdmin!
      .from("lesson_progress")
      .select("lesson_id, lessons!inner(chapters!inner(course_id))")
      .eq("lessons.chapters.course_id", courseId)
      .eq("user_id", userId)
      .eq("is_completed", true);

    const completed = completedProgressData?.length || 0;

    const progressPercentage = total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0;

    // Update enrollment
    await update(
      "enrollments",
      { user_id: userId, course_id: courseId },
      { progress_percentage: progressPercentage, last_lesson_id: lessonId }
    );

    // Update learning activity for today (wrapped in try-catch in case column doesn't exist)
    try {
      const today = new Date().toISOString().split('T')[0];
      const existingActivity = await queryOneBuilder<{ id: string; lessons_completed: number }>(
        "learning_activities",
        {
          select: "id, lessons_completed",
          filters: { user_id: userId, activity_data: today }
        }
      );

      if (existingActivity) {
        await update(
          "learning_activities",
          { id: existingActivity.id },
          { lessons_completed: (existingActivity.lessons_completed || 0) + 1 }
        );
      } else {
        await insert("learning_activities", {
          user_id: userId,
          activity_data: today,
          lessons_completed: 1
        });
      }
    } catch (activityError: any) {
      // Log error but don't fail the request if learning_activities table structure is different
      console.warn("Failed to update learning_activities:", activityError?.message || activityError);
      // Continue execution - this is not critical for marking lesson as complete
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

