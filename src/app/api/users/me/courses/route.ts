/**
 * API Route: GET /api/users/me/courses
 * 
 * Get current user's enrolled courses
 * - Requires authentication
 * - Returns courses with progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = extractTokenFromHeader(request.headers.get('Authorization'));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // 2. Query enrolled courses
    const sqlQuery = `
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.short_description,
        c.thumbnail_url,
        c.level,
        c.price,
        c.is_free,
        c.estimated_duration,
        c.rating,
        c.total_students,
        c.total_lessons,
        e.enrolled_at,
        e.progress_percentage,
        e.completed_at,
        e.total_watch_time,
        cat.name as category_name,
        cat.slug as category_slug
      FROM enrollments e
      INNER JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = ? AND e.is_active = 1
      ORDER BY e.enrolled_at DESC
    `;

    const courses = await query(sqlQuery, [userId]);

    // 3. Format response
    const formattedCourses = (courses as any[]).map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.short_description,
      thumbnailUrl: course.thumbnail_url,
      level: course.level,
      price: course.is_free ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`,
      isFree: Boolean(course.is_free),
      isPro: !Boolean(course.is_free),
      duration: formatDuration(course.estimated_duration),
      rating: parseFloat(course.rating),
      students: course.total_students,
      totalLessons: course.total_lessons,
      category: {
        name: course.category_name,
        slug: course.category_slug,
      },
      enrollment: {
        enrolledAt: course.enrolled_at,
        progress: parseFloat(course.progress_percentage),
        completedAt: course.completed_at,
        watchTime: course.total_watch_time,
        isCompleted: Boolean(course.completed_at),
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        courses: formattedCourses,
        total: formattedCourses.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user courses:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user courses',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Format duration from minutes to human readable
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : '00'}p`;
}
