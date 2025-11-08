import { NextRequest, NextResponse } from 'next/server';
import { queryBuilder } from '@/lib/db';

interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  chapters: AdminChapter[];
}

interface AdminChapter {
  id: string;
  title: string;
  sort_order: number;
  lessons: AdminLesson[];
}

interface AdminLesson {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
  is_published: number;
}

/**
 * GET /api/admin/courses-full
 * Fetch all courses with chapters and lessons (optimized for admin dashboard)
 * Only for authenticated admin/teacher users
 */
export async function GET(request: NextRequest) {
  try {
    // Get all published courses
    const courseRows = await queryBuilder<{ id: string; title: string; slug: string }>(
      'courses',
      {
        select: 'id, title, slug',
        filters: { is_published: true },
        orderBy: { column: 'created_at', ascending: false }
      }
    );

    if (courseRows.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          courses: []
        }
      });
    }

    const courseIds = courseRows.map(c => c.id);

    // Get all chapters for these courses
    const chapterRows = await queryBuilder<{ id: string; course_id: string; title: string; sort_order: number }>(
      'chapters',
      {
        select: 'id, course_id, title, sort_order',
        filters: { is_published: true },
        orderBy: { column: 'sort_order', ascending: true }
      }
    );

    // Filter chapters by course_ids
    const filteredChapters = chapterRows.filter(c => courseIds.includes(c.course_id));
    const chapterIds = filteredChapters.length > 0 ? filteredChapters.map(c => c.id) : [];

    // Get all lessons for these chapters
    const lessonRows = await queryBuilder<{ id: string; chapter_id: string; title: string; content: string | null; sort_order: number; is_published: boolean }>(
      'lessons',
      {
        select: 'id, chapter_id, title, content, sort_order, is_published',
        orderBy: { column: 'sort_order', ascending: true }
      }
    );

    // Filter lessons by chapter_ids
    const filteredLessons = chapterIds.length > 0 
      ? lessonRows.filter(l => chapterIds.includes(l.chapter_id))
      : [];

    // Build hierarchical structure
    const lessons: { [key: string]: AdminLesson[] } = {};
    filteredLessons.forEach((lesson) => {
      if (!lessons[lesson.chapter_id]) {
        lessons[lesson.chapter_id] = [];
      }
      lessons[lesson.chapter_id].push({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        sort_order: lesson.sort_order,
        is_published: lesson.is_published ? 1 : 0,
      });
    });

    const chapters: { [key: string]: AdminChapter[] } = {};
    filteredChapters.forEach((chapter) => {
      if (!chapters[chapter.course_id]) {
        chapters[chapter.course_id] = [];
      }
      chapters[chapter.course_id].push({
        id: chapter.id,
        title: chapter.title,
        sort_order: chapter.sort_order,
        lessons: lessons[chapter.id] || [],
      });
    });

    const courses: AdminCourse[] = courseRows.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      chapters: chapters[course.id] || [],
    }));

    return NextResponse.json({
      success: true,
      data: {
        courses,
        meta: {
          totalCourses: courses.length,
          totalChapters: filteredChapters.length,
          totalLessons: filteredLessons.length,
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin courses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch courses',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
