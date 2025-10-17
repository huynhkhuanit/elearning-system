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
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/lessons/[lessonId]
 * Lấy thông tin chi tiết của một bài học
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const lesson = await queryOne<LessonData>(
      `SELECT id, title, chapter_id, content, video_url, video_duration, 
              sort_order, is_preview, is_published, created_at, updated_at 
       FROM lessons WHERE id = ?`,
      [lessonId]
    );

    if (!lesson) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin bài học' },
      { status: 500 }
    );
  }
}
