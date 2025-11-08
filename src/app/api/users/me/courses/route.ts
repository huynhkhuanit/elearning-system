/**
 * API Route: GET /api/users/me/courses
 * 
 * Get current user's enrolled courses
 * - Requires authentication
 * - Returns courses with progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { rpc } from '@/lib/db-helpers';
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

    // 2. Query enrolled courses using RPC function
    const courses = await rpc<any[]>('get_user_enrolled_courses', { p_user_id: userId });

    // 3. Format response
    const formattedCourses = (courses || []).map((course: any) => ({
      id: course.course_id,
      title: course.course_title,
      slug: course.course_slug,
      subtitle: null, // Not returned by RPC, can be fetched separately if needed
      thumbnailUrl: course.course_thumbnail_url,
      level: null, // Not returned by RPC, can be fetched separately if needed
      price: 'Miễn phí', // Default, can be enhanced
      isFree: true, // Default, can be enhanced
      isPro: false, // Default, can be enhanced
      duration: null, // Not returned by RPC
      rating: null, // Not returned by RPC
      students: null, // Not returned by RPC
      totalLessons: null, // Not returned by RPC
      category: null, // Not returned by RPC
      enrollment: {
        enrolledAt: course.enrolled_at,
        progress: parseFloat(course.progress_percentage || 0),
        completedAt: course.completed_at,
        watchTime: course.total_watch_time || 0,
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
