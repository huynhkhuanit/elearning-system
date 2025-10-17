import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

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
    const [courseRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, slug FROM courses WHERE is_published = 1 ORDER BY created_at DESC`
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
    const [chapterRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, course_id, title, sort_order 
       FROM chapters 
       WHERE course_id IN (?) AND is_published = 1
       ORDER BY sort_order ASC`,
      [courseIds]
    );

    const chapterIds = chapterRows.length > 0 ? chapterRows.map(c => c.id) : [0];

    // Get all lessons for these chapters
    const [lessonRows] = await pool.query<RowDataPacket[]>(
      `SELECT id, chapter_id, title, content, sort_order, is_published
       FROM lessons 
       WHERE chapter_id IN (?)
       ORDER BY sort_order ASC`,
      [chapterIds]
    );

    // Build hierarchical structure
    const lessons: { [key: string]: AdminLesson[] } = {};
    lessonRows.forEach((lesson: any) => {
      if (!lessons[lesson.chapter_id]) {
        lessons[lesson.chapter_id] = [];
      }
      lessons[lesson.chapter_id].push({
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        sort_order: lesson.sort_order,
        is_published: lesson.is_published,
      });
    });

    const chapters: { [key: string]: AdminChapter[] } = {};
    chapterRows.forEach((chapter: any) => {
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

    const courses: AdminCourse[] = courseRows.map((course: any) => ({
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
          totalChapters: chapterRows.length,
          totalLessons: lessonRows.length,
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
