import { NextRequest, NextResponse } from "next/server";
import { queryBuilder, queryOneBuilder, insert, update, db as supabaseAdmin } from "@/lib/db";
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

    // Build query with Supabase
    let questionsQuery = supabaseAdmin!
      .from("lesson_questions")
      .select(`
        id,
        title,
        content,
        status,
        answers_count,
        likes_count,
        views_count,
        created_at,
        updated_at,
        is_pinned,
        users!inner(id, username, full_name, avatar_url)
      `)
      .eq("lesson_id", lessonId);

    // Filter by status
    if (status !== "ALL") {
      questionsQuery = questionsQuery.eq("status", status);
    }

    // Search
    if (search) {
      questionsQuery = questionsQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Sort
    if (sortBy === "POPULAR") {
      questionsQuery = questionsQuery.order("likes_count", { ascending: false })
        .order("created_at", { ascending: false });
    } else {
      questionsQuery = questionsQuery.order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const { data: questionsData, error: questionsError } = await questionsQuery;

    if (questionsError) {
      throw questionsError;
    }

    // Get likes for current user
    const { data: userLikes } = await supabaseAdmin!
      .from("lesson_question_likes")
      .select("question_id")
      .eq("user_id", userId)
      .in("question_id", (questionsData || []).map((q: any) => q.id));

    const likedQuestionIds = new Set((userLikes || []).map((l: any) => l.question_id));

    const questions = (questionsData || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      status: row.status,
      answersCount: row.answers_count,
      likesCount: row.likes_count,
      viewsCount: row.views_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      user: {
        id: row.users.id,
        username: row.users.username,
        fullName: row.users.full_name,
        avatarUrl: row.users.avatar_url,
      },
      isLiked: likedQuestionIds.has(row.id),
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
    // Get course_id from lesson
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

    const enrollment = await queryOneBuilder<{ id: string }>(
      "enrollments",
      {
        select: "id",
        filters: { user_id: userId, course_id: chapter.course_id, is_active: true }
      }
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to ask questions" },
        { status: 403 }
      );
    }

    // Create question
    const [newQuestion] = await insert<{ id: string }>(
      "lesson_questions",
      {
        lesson_id: lessonId,
        user_id: userId,
        title,
        content,
        status: "OPEN"
      }
    );

    return NextResponse.json({
      success: true,
      data: { questionId: newQuestion.id },
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
