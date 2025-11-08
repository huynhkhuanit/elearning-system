import { NextRequest, NextResponse } from 'next/server';
import { rpc, queryOneBuilder } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Get user ID from username
    const user = await queryOneBuilder<{ id: string }>(
      'users',
      {
        select: 'id',
        filters: { username }
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy người dùng',
        },
        { status: 404 }
      );
    }

    const userId = user.id;

    // Query enrolled courses using RPC function
    const courses = await rpc<any[]>('get_user_enrolled_courses', { p_user_id: userId });

    // Format response
    const formattedCourses = (courses || []).map((course: any) => ({
      id: course.course_id,
      title: course.course_title,
      slug: course.course_slug,
      thumbnail_url: course.course_thumbnail_url,
      description: course.course_description || null,
      progress_percentage: parseFloat(course.progress_percentage || 0),
      enrolled_at: course.enrolled_at,
      completed_at: course.completed_at,
      is_completed: Boolean(course.completed_at),
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
        message: 'Không thể lấy danh sách khóa học',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

