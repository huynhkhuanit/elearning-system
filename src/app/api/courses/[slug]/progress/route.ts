import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, queryBuilder, db as supabaseAdmin } from "@/lib/db";
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
    const course = await queryOneBuilder<{ id: string }>(
      "courses",
      {
        select: "id",
        filters: { slug }
      }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = course.id;

    // Check if user is enrolled
    const enrollment = await queryOneBuilder<{ id: string; [key: string]: any }>(
      "enrollments",
      {
        select: "*",
        filters: { user_id: userId, course_id: courseId }
      }
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Not enrolled" },
        { status: 403 }
      );
    }

    // Get all lessons for this course using Supabase join
    const { data: lessonsData, error: lessonsError } = await supabaseAdmin!
      .from("lessons")
      .select("id, chapters!inner(course_id)")
      .eq("chapters.course_id", courseId);

    const lessonIds = (lessonsData || []).map((l: any) => l.id);

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
    const progressRows = await queryBuilder<{
      lesson_id: string;
      is_completed: boolean;
      watch_time: number | null;
      last_position: number | null;
    }>(
      "lesson_progress",
      {
        select: "lesson_id, is_completed, watch_time, last_position",
        filters: { user_id: userId }
      }
    );

    // Filter progress for lessons in this course
    const courseProgress = progressRows.filter(p => lessonIds.includes(p.lesson_id));

    const completedLessons = courseProgress
      .filter(p => p.is_completed === true)
      .map(p => p.lesson_id);

    const progressMap = courseProgress.reduce((acc, p) => {
      acc[p.lesson_id] = {
        isCompleted: p.is_completed === true,
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
        enrollment
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

