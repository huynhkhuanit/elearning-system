import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, db as supabaseAdmin } from '@/lib/db';

interface LessonData {
  id: string;
  title: string;
  chapter_id: string;
  content: string | null;
  video_url: string | null;
  video_duration: number | null;
  sort_order: number;
  is_preview: number;
  is_published: number;
  is_free: number; // 1 = FREE course
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/lessons/[lessonId]
 * Lấy thông tin chi tiết của một bài học
 * 
 * Nếu là bài FREE mà không có video_url:
 * - Auto-generate placeholder video
 * - Cho phép user test UI/flow mà không cần quay video thực
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const useMockVideo = request.nextUrl.searchParams.get('mock') === 'true';

    // Get lesson with chapter and course info using Supabase joins
    const { data: lessonData, error } = await supabaseAdmin!
      .from('lessons')
      .select(`
        id,
        title,
        chapter_id,
        content,
        video_url,
        video_duration,
        sort_order,
        is_preview,
        is_published,
        created_at,
        updated_at,
        chapters!left(course_id, courses!left(is_free))
      `)
      .eq('id', lessonId)
      .single();

    if (error || !lessonData) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

    const chapters = lessonData.chapters as any;
    const courseId = chapters?.course_id;
    const courses = chapters?.courses as any;
    const isFree = courses?.is_free || false;

    const lesson: LessonData = {
      id: lessonData.id,
      title: lessonData.title,
      chapter_id: lessonData.chapter_id,
      content: lessonData.content,
      video_url: lessonData.video_url,
      video_duration: lessonData.video_duration,
      sort_order: lessonData.sort_order,
      is_preview: lessonData.is_preview ? 1 : 0,
      is_published: lessonData.is_published ? 1 : 0,
      is_free: isFree ? 1 : 0,
      created_at: lessonData.created_at,
      updated_at: lessonData.updated_at,
    };

    // Nếu là FREE course và không có video, tạo placeholder
    if (!lesson.video_url || useMockVideo) {
      const isFreeOrDevMode = lesson.is_free || process.env.NODE_ENV === 'development';
      
      if (isFreeOrDevMode) {
        // Return placeholder video marker để client tạo
        lesson.video_url = `MOCK_PLACEHOLDER:${lesson.title}`;
        lesson.video_duration = 300; // 5 minutes default
      }
    }

    return NextResponse.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin bài học' },
      { status: 500 }
    );
  }
}
