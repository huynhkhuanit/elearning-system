import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
  is_published: number;
}

/**
 * GET /api/chapters/[chapterId]/lessons
 * Lấy danh sách lessons của một chapter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const { chapterId } = await params;

    const lessons = await query<Lesson[]>(
      `SELECT id, title, content, sort_order, is_published 
       FROM lessons 
       WHERE chapter_id = ? 
       ORDER BY sort_order ASC`,
      [chapterId]
    );

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bài học' },
      { status: 500 }
    );
  }
}
