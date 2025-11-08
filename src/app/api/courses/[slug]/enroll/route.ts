/**
 * API Route: POST /api/courses/[slug]/enroll
 * 
 * Enroll user in a course
 * - Requires authentication
 * - Free courses: Anyone can enroll
 * - PRO courses: Only PRO members or payment required
 * - Auto upgrade to PRO when enrolling in PRO course
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, insert, update } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    const { slug } = await params;

    // 2. Get course details using Supabase
    const course = await queryOneBuilder<{
      id: string;
      title: string;
      price: number;
      is_free: boolean;
      is_published: boolean;
    }>('courses', {
      select: 'id, title, price, is_free, is_published',
      filters: { slug, is_published: true },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    // 3. Get user membership status
    const user = await queryOneBuilder<{
      membership_type: string;
      membership_expires_at: string | null;
    }>('users', {
      select: 'membership_type, membership_expires_at',
      filters: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // 4. Check if user is already enrolled
    const existingEnrollment = await queryOneBuilder<{ id: string }>('enrollments', {
      select: 'id',
      filters: { user_id: userId, course_id: course.id },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã đăng ký khóa học này rồi!' },
        { status: 400 }
      );
    }

    // 5. Check enrollment eligibility
    const isPro = user.membership_type === 'PRO' && 
                  user.membership_expires_at && 
                  new Date(user.membership_expires_at) > new Date();

    // If course is PRO and user is not PRO
    let upgradedToPro = false;
    if (!course.is_free && !isPro) {
      // Auto upgrade user to PRO when enrolling in PRO course
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year PRO

      await update('users', { id: userId }, {
        membership_type: 'PRO',
        membership_expires_at: expiryDate.toISOString(),
      });

      upgradedToPro = true;
      console.log(`✅ User ${userId} upgraded to PRO`);
    }

    // 6. Create enrollment using Supabase insert
    await insert('enrollments', {
      user_id: userId,
      course_id: course.id,
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
      is_active: true,
    });

    // Note: total_students is updated automatically by trigger in PostgreSQL

    // 7. Return success response
    return NextResponse.json({
      success: true,
      message: course.is_free 
        ? 'Đăng ký khóa học thành công!' 
        : 'Chúc mừng! Bạn đã trở thành thành viên PRO và đăng ký khóa học thành công!',
      data: {
        courseId: course.id,
        courseTitle: course.title,
        upgradedToPro,
      },
    });
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    
    // Handle unique constraint violations
    if (error?.code === '23505' || error?.message?.includes('duplicate')) {
      return NextResponse.json(
        { success: false, message: 'Bạn đã đăng ký khóa học này rồi!' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to enroll in course',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
