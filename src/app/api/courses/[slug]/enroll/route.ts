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
import { query } from '@/lib/db';
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

    // 2. Get course details
    const courseResults = await query(
      `SELECT id, title, price, is_free, is_published FROM courses WHERE slug = ? AND is_published = 1 LIMIT 1`,
      [slug]
    );

    if (!courseResults || (courseResults as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    const course = (courseResults as any[])[0];

    // 3. Get user membership status
    const userResults = await query(
      `SELECT membership_type, membership_expires_at FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (!userResults || (userResults as any[]).length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const user = (userResults as any[])[0];

    // 4. Check if user is already enrolled
    const enrollmentCheck = await query(
      `SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? LIMIT 1`,
      [userId, course.id]
    );

    if (enrollmentCheck && (enrollmentCheck as any[]).length > 0) {
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
    if (!course.is_free && !isPro) {
      // Auto upgrade user to PRO when enrolling in PRO course
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year PRO

      await query(
        `UPDATE users SET membership_type = 'PRO', membership_expires_at = ? WHERE id = ?`,
        [expiryDate, userId]
      );

      console.log(`✅ User ${userId} upgraded to PRO`);
    }

    // 6. Create enrollment
    await query(
      `INSERT INTO enrollments (user_id, course_id, enrolled_at, progress_percentage, is_active)
       VALUES (?, ?, NOW(), 0, 1)`,
      [userId, course.id]
    );

    // 7. Update course total_students count
    await query(
      `UPDATE courses SET total_students = total_students + 1 WHERE id = ?`,
      [course.id]
    );

    // 8. Return success response
    return NextResponse.json({
      success: true,
      message: course.is_free 
        ? 'Đăng ký khóa học thành công!' 
        : 'Chúc mừng! Bạn đã trở thành thành viên PRO và đăng ký khóa học thành công!',
      data: {
        courseId: course.id,
        courseTitle: course.title,
        upgradedToPro: !course.is_free && !isPro,
      },
    });
  } catch (error: any) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to enroll in course',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
