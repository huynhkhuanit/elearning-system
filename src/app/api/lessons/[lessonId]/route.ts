import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

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

    const lesson = await queryOne<LessonData>(
      `SELECT l.id, l.title, l.chapter_id, l.content, l.video_url, l.video_duration, 
              l.sort_order, l.is_preview, l.is_published, l.created_at, l.updated_at,
              c.course_id, co.is_free
       FROM lessons l
       LEFT JOIN chapters c ON l.chapter_id = c.id
       LEFT JOIN courses co ON c.course_id = co.id
       WHERE l.id = ?`,
      [lessonId]
    );

    if (!lesson) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

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
