import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * GET /api/questions/[questionId]
 * Get question detail with answers, lesson info, and participants
 * Optimized with parallel queries
 */
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

    // Optimize: Run queries in parallel
    const [questionResult, answersResult, likesResult, answerLikesResult] = await Promise.all([
      // Get question with user and lesson info
      supabaseAdmin!
        .from("lesson_questions")
        .select(`
          id,
          lesson_id,
          title,
          content,
          is_resolved,
          likes_count,
          created_at,
          updated_at,
          users!inner(id, username, full_name, avatar_url),
          lessons!inner(
            id,
            title,
            chapter_id,
            video_url,
            chapters!inner(
              id,
              title,
              course_id,
              courses!inner(
                id,
                title,
                slug
              )
            )
          )
        `)
        .eq("id", questionId)
        .single(),
      // Get answers with user info
      supabaseAdmin!
        .from("lesson_answers")
        .select(`
          id,
          content,
          is_accepted,
          likes_count,
          created_at,
          updated_at,
          users!inner(id, username, full_name, avatar_url)
        `)
        .eq("question_id", questionId)
        .order("is_accepted", { ascending: false })
        .order("likes_count", { ascending: false })
        .order("created_at", { ascending: true }),
      // Check if user liked this question
      supabaseAdmin!
        .from("lesson_question_likes")
        .select("id")
        .eq("question_id", questionId)
        .eq("user_id", userId)
        .maybeSingle(),
      // Get all answer likes for current user
      supabaseAdmin!
        .from("lesson_answer_likes")
        .select("answer_id")
        .eq("user_id", userId)
    ]);

    const { data: questionData, error: questionError } = questionResult;
    const { data: answersData, error: answersError } = answersResult;
    const { data: userLike } = likesResult;
    const { data: answerLikes } = answerLikesResult;

    if (questionError || !questionData) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    if (answersError) {
      throw answersError;
    }

    // Get unique participants (users who answered)
    const participantIds = new Set<string>();
    participantIds.add((questionData.users as any).id);
    (answersData || []).forEach((answer: any) => {
      participantIds.add((answer.users as any).id);
    });

    const likedAnswerIds = new Set((answerLikes || []).map((l: any) => l.answer_id));

    // Calculate status
    const answersCount = (answersData || []).length;
    let calculatedStatus: string;
    if (questionData.is_resolved) {
      calculatedStatus = "RESOLVED";
    } else if (answersCount > 0) {
      calculatedStatus = "ANSWERED";
    } else {
      calculatedStatus = "OPEN";
    }

    // Extract lesson info
    const lesson = questionData.lessons as any;
    const chapter = lesson?.chapters as any;
    const course = chapter?.courses as any;

    const question = {
      id: questionData.id,
      title: questionData.title,
      content: questionData.content,
      status: calculatedStatus,
      answersCount: answersCount,
      likesCount: questionData.likes_count || 0,
      viewsCount: 0, // views_count column doesn't exist
      createdAt: questionData.created_at,
      updatedAt: questionData.updated_at,
      isLiked: !!userLike,
      user: {
        id: (questionData.users as any).id,
        username: (questionData.users as any).username,
        fullName: (questionData.users as any).full_name,
        avatarUrl: (questionData.users as any).avatar_url,
      },
      lesson: lesson ? {
        id: lesson.id,
        title: lesson.title,
        type: lesson.video_url ? "challenge" : "theory",
      } : null,
      chapter: chapter ? {
        id: chapter.id,
        title: chapter.title,
      } : null,
      course: course ? {
        id: course.id,
        title: course.title,
        slug: course.slug,
      } : null,
      answers: (answersData || []).map((row: any) => ({
        id: row.id,
        content: row.content,
        isAccepted: Boolean(row.is_accepted),
        likesCount: row.likes_count || 0,
        isLiked: likedAnswerIds.has(row.id),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        user: {
          id: (row.users as any).id,
          username: (row.users as any).username,
          fullName: (row.users as any).full_name,
          avatarUrl: (row.users as any).avatar_url,
        },
      })),
      participants: Array.from(participantIds).length,
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

