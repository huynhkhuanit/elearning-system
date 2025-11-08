import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, update, db as supabaseAdmin } from "@/lib/db";
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

    // Note: views_count column doesn't exist in Supabase
    // Skip incrementing view count for now

    // Get question details with user info
    // Note: Only select columns that exist in Supabase
    const { data: questionData, error: questionError } = await supabaseAdmin!
      .from("lesson_questions")
      .select(`
        id,
        title,
        content,
        is_resolved,
        likes_count,
        created_at,
        updated_at,
        users!inner(id, username, full_name, avatar_url)
      `)
      .eq("id", questionId)
      .single();

    if (questionError || !questionData) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    // Check if user liked this question
    const { data: userLike } = await supabaseAdmin!
      .from("lesson_question_likes")
      .select("id")
      .eq("question_id", questionId)
      .eq("user_id", userId)
      .single();

    // Get answers with user info
    const { data: answersData, error: answersError } = await supabaseAdmin!
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
      .order("created_at", { ascending: true });

    if (answersError) {
      throw answersError;
    }

    // Get user likes for answers
    const answerIds = (answersData || []).map((a: any) => a.id);
    const { data: answerLikes } = await supabaseAdmin!
      .from("lesson_answer_likes")
      .select("answer_id")
      .eq("user_id", userId)
      .in("answer_id", answerIds);

    const likedAnswerIds = new Set((answerLikes || []).map((l: any) => l.answer_id));

    // Calculate answers_count from lesson_answers table
    const answersCount = (answersData || []).length;
    
    // Calculate status based on answers_count and is_resolved
    let calculatedStatus: string;
    if (questionData.is_resolved) {
      calculatedStatus = "RESOLVED";
    } else if (answersCount > 0) {
      calculatedStatus = "ANSWERED";
    } else {
      calculatedStatus = "OPEN";
    }
    
    const question = {
      id: questionData.id,
      title: questionData.title,
      content: questionData.content,
      status: calculatedStatus,
      answersCount: answersCount,
      likesCount: questionData.likes_count || 0,
      viewsCount: 0, // views_count column doesn't exist, default to 0
      createdAt: questionData.created_at,
      updatedAt: questionData.updated_at,
      isLiked: !!userLike,
      user: {
        id: (questionData.users as any).id,
        username: (questionData.users as any).username,
        fullName: (questionData.users as any).full_name,
        avatarUrl: (questionData.users as any).avatar_url,
      },
      answers: (answersData || []).map((row: any) => ({
        id: row.id,
        content: row.content,
        isAccepted: Boolean(row.is_accepted),
        likesCount: row.likes_count,
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
