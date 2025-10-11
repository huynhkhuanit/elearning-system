/**
 * API Route: GET /api/courses/[slug]
 * 
 * Get course details by slug
 * - Public endpoint
 * - Returns full course information
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Query course details
    const sqlQuery = `
      SELECT 
        c.id,
        c.title,
        c.slug,
        c.description,
        c.short_description,
        c.thumbnail_url,
        c.level,
        c.price,
        c.is_free,
        c.is_published,
        c.estimated_duration,
        c.rating,
        c.total_students,
        c.total_lessons,
        c.created_at,
        c.updated_at,
        cat.id as category_id,
        cat.name as category_name,
        cat.slug as category_slug,
        u.id as instructor_id,
        u.full_name as instructor_name,
        u.username as instructor_username,
        u.avatar_url as instructor_avatar,
        u.bio as instructor_bio
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.slug = ? AND c.is_published = 1
      LIMIT 1
    `;

    const results = await query(sqlQuery, [slug]);

    if (!results || (results as any[]).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Course not found',
        },
        { status: 404 }
      );
    }

    const course = (results as any[])[0];

    // Format response
    const formattedCourse = {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      shortDescription: course.short_description,
      thumbnailUrl: course.thumbnail_url,
      level: course.level,
      price: course.is_free ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`,
      priceAmount: course.price,
      isFree: Boolean(course.is_free),
      isPro: !Boolean(course.is_free),
      duration: formatDuration(course.estimated_duration),
      durationMinutes: course.estimated_duration,
      rating: parseFloat(course.rating),
      students: course.total_students,
      totalLessons: course.total_lessons,
      category: {
        id: course.category_id,
        name: course.category_name,
        slug: course.category_slug,
      },
      instructor: {
        id: course.instructor_id,
        name: course.instructor_name,
        username: course.instructor_username,
        avatar: course.instructor_avatar,
        bio: course.instructor_bio,
      },
      createdAt: course.created_at,
      updatedAt: course.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: formattedCourse,
    });
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch course',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Format duration from minutes to human readable
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "32h45p")
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : '00'}p`;
}
