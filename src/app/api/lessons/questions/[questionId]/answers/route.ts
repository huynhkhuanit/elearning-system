import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, insert, update, db as supabaseAdmin } from "@/lib/db";
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
    // Get lesson_id from question
    const question = await queryOneBuilder<{ lesson_id: string }>(
      "lesson_questions",
      {
        select: "lesson_id",
        filters: { id: questionId }
      }
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    // Get chapter_id from lesson
    const lesson = await queryOneBuilder<{ chapter_id: string }>(
      "lessons",
      {
        select: "chapter_id",
        filters: { id: question.lesson_id }
      }
    );

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 }
      );
    }

    // Get course_id from chapter
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

    // Check enrollment
    const enrollment = await queryOneBuilder<{ id: string }>(
      "enrollments",
      {
        select: "id",
        filters: { user_id: userId, course_id: chapter.course_id, is_active: true }
      }
    );

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "You must be enrolled in this course to answer questions" },
        { status: 403 }
      );
    }

    // Create answer and get the created answer with user info
    // Explicitly set created_at and updated_at to current UTC time
    // This ensures consistent timestamp regardless of database timezone settings
    const now = new Date();
    const nowISO = now.toISOString();
    
    const { data: newAnswer, error: insertError } = await supabaseAdmin!
      .from("lesson_answers")
      .insert({
        question_id: questionId,
        user_id: userId,
        content,
        created_at: nowISO,
        updated_at: nowISO
      })
      .select(`
        id,
        content,
        is_accepted,
        likes_count,
        created_at,
        updated_at,
        users!inner(id, username, full_name, avatar_url)
      `)
      .single();

    if (insertError || !newAnswer) {
      throw insertError || new Error("Failed to create answer");
    }

    // Note: answers_count and status columns don't exist in Supabase
    // They are calculated dynamically from lesson_answers table
    // No need to update them here

    // Use the timestamp we explicitly set (nowISO) to ensure accuracy
    // This avoids timezone conversion issues from database
    const createdAt = nowISO;
    const updatedAt = nowISO;

    return NextResponse.json({
      success: true,
      message: "Answer created successfully",
      data: {
        answer: {
          id: newAnswer.id,
          content: newAnswer.content,
          isAccepted: Boolean(newAnswer.is_accepted),
          likesCount: newAnswer.likes_count || 0,
          isLiked: false, // User just created it, so not liked yet
          createdAt: createdAt,
          updatedAt: updatedAt,
          user: {
            id: (newAnswer.users as any).id,
            username: (newAnswer.users as any).username,
            fullName: (newAnswer.users as any).full_name,
            avatarUrl: (newAnswer.users as any).avatar_url,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
