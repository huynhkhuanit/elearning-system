import { NextRequest, NextResponse } from 'next/server';
import { queryBuilder } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. Get total courses
    const courses = await queryBuilder<{ id: string; title: string }>('courses', {
      select: 'id, title'
    });
    const totalCourses = courses.length;

    // 2. Get total lessons and published lessons
    const lessons = await queryBuilder<{ id: string; is_published: boolean; content: string | null; chapter_id: string }>('lessons', {
      select: 'id, is_published, content, chapter_id'
    });
    const totalLessons = lessons.length;
    const publishedLessons = lessons.filter(l => l.is_published).length;
    const lessonsWithContent = lessons.filter(l => l.content && l.content.trim().length > 0).length;

    // 3. Get total chapters
    const chapters = await queryBuilder<{ id: string; course_id: string }>('chapters', {
      select: 'id, course_id'
    });
    const totalChapters = chapters.length;

    // 4. Calculate completion rate (content / total)
    const completionRate = totalLessons > 0 
      ? Math.round((lessonsWithContent / totalLessons) * 100) 
      : 0;

    // 5. Aggregate data for charts
    // Lessons per course
    const courseStats = courses.map(course => {
      const courseChapters = chapters.filter(c => c.course_id === course.id).map(c => c.id);
      const courseLessons = lessons.filter(l => courseChapters.includes(l.chapter_id));
      return {
        name: course.title,
        lessons: courseLessons.length,
        published: courseLessons.filter(l => l.is_published).length,
        content: courseLessons.filter(l => l.content && l.content.trim().length > 0).length
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalCourses,
          totalChapters,
          totalLessons,
          lessonsWithContent,
          publishedLessons,
          completionRate
        },
        charts: {
          courseStats
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch stats',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
