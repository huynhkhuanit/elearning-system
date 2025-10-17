import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

interface LessonContentRequest {
  content: string;
}

interface LessonContentResponse {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

/**
 * GET /api/lessons/[lessonId]/content
 * Lấy markdown content của một bài học
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const lesson = await queryOne<LessonContentResponse>(
      'SELECT id, title, content, updated_at FROM lessons WHERE id = ?',
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
    console.error('Error fetching lesson content:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy nội dung bài học' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/lessons/[lessonId]/content
 * Cập nhật markdown content của một bài học
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body: LessonContentRequest = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content phải là chuỗi không rỗng' },
        { status: 400 }
      );
    }

    // Check if lesson exists
    const lesson = await queryOne(
      'SELECT id FROM lessons WHERE id = ?',
      [lessonId]
    );

    if (!lesson) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

    // Update lesson content
    await query(
      'UPDATE lessons SET content = ?, updated_at = NOW() WHERE id = ?',
      [content, lessonId]
    );

    // Return updated lesson
    const updated = await queryOne<LessonContentResponse>(
      'SELECT id, title, content, updated_at FROM lessons WHERE id = ?',
      [lessonId]
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Cập nhật nội dung bài học thành công'
    });
  } catch (error) {
    console.error('Error updating lesson content:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật nội dung bài học' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lessons/[lessonId]/content
 * Cập nhật một phần markdown content (append hoặc merge)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body: LessonContentRequest = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content phải là chuỗi không rỗng' },
        { status: 400 }
      );
    }

    // Get current content
    const lesson = await queryOne<{ content: string | null }>(
      'SELECT content FROM lessons WHERE id = ?',
      [lessonId]
    );

    if (!lesson) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

    // Merge content (append to existing)
    const mergedContent = lesson.content 
      ? `${lesson.content}\n\n${content}` 
      : content;

    // Update lesson content
    await query(
      'UPDATE lessons SET content = ?, updated_at = NOW() WHERE id = ?',
      [mergedContent, lessonId]
    );

    const updated = await queryOne<LessonContentResponse>(
      'SELECT id, title, content, updated_at FROM lessons WHERE id = ?',
      [lessonId]
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Thêm nội dung bài học thành công'
    });
  } catch (error) {
    console.error('Error patching lesson content:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật nội dung bài học' },
      { status: 500 }
    );
  }
}
