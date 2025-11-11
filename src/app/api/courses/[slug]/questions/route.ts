import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, db as supabaseAdmin } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/**
 * GET /api/courses/[slug]/questions
 * Get all questions for a course, grouped by lesson
 * 
 * Query params:
 * - category: Filter by lesson category (all, theory, challenge, off-topic, flashcards, other)
 * - search: Search in question title/content
 * - status: Filter by status (all, open, answered, resolved)
 */
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // Get course ID from slug
    const course = await queryOneBuilder<{ id: string }>(
      "courses",
      {
        select: "id",
        filters: { slug, is_published: true }
      }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = course.id;

    // Optimize: Run independent queries in parallel
    const [chaptersResult, lessonsResult, answersResult] = await Promise.all([
      // Get all chapters for this course
      supabaseAdmin!
        .from("chapters")
        .select("id")
        .eq("course_id", courseId)
        .eq("is_published", true),
      // Get all lessons for this course's chapters
      supabaseAdmin!
        .from("lessons")
        .select(`
          id,
          title,
          chapter_id,
          video_url,
          chapters!inner(
            id,
            course_id
          )
        `)
        .eq("is_published", true),
      // Get all answers with user info (we'll filter after)
      supabaseAdmin!
        .from("lesson_answers")
        .select(`
          question_id,
          users!inner(id, full_name, avatar_url)
        `)
        .order("created_at", { ascending: true })
    ]);

    const { data: chapters } = chaptersResult;
    const { data: lessons } = lessonsResult;
    const { data: answersData } = answersResult;

    if (!chapters || chapters.length === 0 || !lessons || lessons.length === 0) {
      return NextResponse.json({
        success: true,
        data: { questions: [], total: 0 },
      });
    }

    const chapterIds = chapters.map((c: any) => c.id);

    // Filter lessons by chapter_ids and create lesson map
    const lessonMap = new Map();
    const validLessonIds: string[] = [];
    
    lessons.forEach((lesson: any) => {
      const chapterId = lesson.chapters?.id;
      if (chapterId && chapterIds.includes(chapterId)) {
        validLessonIds.push(lesson.id);
        lessonMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          chapter_id: lesson.chapter_id,
          type: lesson.video_url ? "challenge" : "theory",
        });
      }
    });

    if (validLessonIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: { questions: [], total: 0 },
      });
    }

    // Count answers per question and collect answer users (max 2 per question)
    const answersCountMap = new Map<string, number>();
    const answerUsersMap = new Map<string, Array<{ id: string; fullName: string; avatarUrl: string | null }>>();
    
    (answersData || []).forEach((answer: any) => {
      const count = answersCountMap.get(answer.question_id) || 0;
      answersCountMap.set(answer.question_id, count + 1);
      
      // Collect answer users (max 2 per question)
      if (!answerUsersMap.has(answer.question_id)) {
        answerUsersMap.set(answer.question_id, []);
      }
      const users = answerUsersMap.get(answer.question_id)!;
      if (users.length < 2 && answer.users) {
        // Check if user already added (avoid duplicates)
        const userExists = users.some(u => u.id === answer.users.id);
        if (!userExists) {
          users.push({
            id: answer.users.id,
            fullName: answer.users.full_name,
            avatarUrl: answer.users.avatar_url,
          });
        }
      }
    });

    // Now get questions for valid lessons only
    let questionsQuery = supabaseAdmin!
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
        users!inner(id, username, full_name, avatar_url)
      `)
      .in("lesson_id", validLessonIds);

    // Search filter
    if (search) {
      questionsQuery = questionsQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Sort by created_at descending (most recent first)
    questionsQuery = questionsQuery.order("created_at", { ascending: false });

    const { data: questionsData, error: questionsError } = await questionsQuery;

    if (questionsError) {
      throw questionsError;
    }

    if (!questionsData || questionsData.length === 0) {
      return NextResponse.json({
        success: true,
        data: { questions: [], total: 0 },
      });
    }

    // Calculate status and filter by category
    let filteredQuestions = questionsData;
    
    // First, calculate status and add answers_count for each question
    const questionsWithStatus = questionsData.map((q: any) => {
      const answersCount = answersCountMap.get(q.id) || 0;
      
      // Calculate status based on is_resolved and answers_count
      let calculatedStatus: string;
      if (q.is_resolved) {
        calculatedStatus = "RESOLVED";
      } else if (answersCount > 0) {
        calculatedStatus = "ANSWERED";
      } else {
        calculatedStatus = "OPEN";
      }
      
      return {
        ...q,
        calculatedStatus,
        answers_count: answersCount,
      };
    });

    // Filter by status (if not "all")
    if (status !== "all") {
      filteredQuestions = questionsWithStatus.filter((q: any) => {
        if (status === "open") {
          return q.calculatedStatus === "OPEN";
        } else if (status === "answered") {
          return q.calculatedStatus === "ANSWERED";
        } else if (status === "resolved") {
          return q.calculatedStatus === "RESOLVED";
        }
        return true;
      });
    } else {
      filteredQuestions = questionsWithStatus;
    }

    // Filter by category
    if (category !== "all") {
      filteredQuestions = filteredQuestions.filter((q: any) => {
        const lesson = lessonMap.get(q.lesson_id);
        if (!lesson) return false;

        switch (category) {
          case "theory":
            return lesson.type === "theory";
          case "challenge":
            return lesson.type === "challenge";
          case "off-topic":
            // For now, we'll treat this as questions not in any specific lesson category
            // You can extend this logic based on your needs
            return false;
          case "flashcards":
            // This would need additional metadata
            return false;
          case "other":
            // This would need additional metadata
            return false;
          default:
            return true;
        }
      });
    }

    // Format questions with lesson info
    const questions = filteredQuestions.map((row: any) => {
      const lesson = lessonMap.get(row.lesson_id);
      
      return {
        id: row.id,
        title: row.title,
        content: row.content,
        status: row.calculatedStatus,
        answersCount: row.answers_count || 0,
        likesCount: row.likes_count || 0,
        viewsCount: 0, // views_count column doesn't exist, default to 0
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        user: {
          id: row.users.id,
          username: row.users.username,
          fullName: row.users.full_name,
          avatarUrl: row.users.avatar_url,
        },
        answerUsers: answerUsersMap.get(row.id) || [],
        lesson: lesson ? {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        questions,
        total: questions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching course questions:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

