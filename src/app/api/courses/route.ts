/**
 * API Route: GET /api/courses
 * 
 * Get all courses
 * - Public endpoint
 * - Optional filters: level, is_free, category
 * - Optional search by title
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filters
    const level = searchParams.get('level'); // BEGINNER, INTERMEDIATE, ADVANCED
    const isFreeParam = searchParams.get('is_free'); // '1' or '0'
    const category = searchParams.get('category'); // category slug
    const search = searchParams.get('search'); // search title
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build WHERE clause with params
    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // Always filter published courses
    whereConditions.push('c.is_published = ?');
    queryParams.push(1);

    if (level) {
      whereConditions.push('c.level = ?');
      queryParams.push(level.toUpperCase());
    }

    if (isFreeParam !== null) {
      whereConditions.push('c.is_free = ?');
      queryParams.push(parseInt(isFreeParam));
    }

    if (category) {
      whereConditions.push('cat.slug = ?');
      queryParams.push(category);
    }

    if (search) {
      whereConditions.push('(c.title LIKE ? OR c.short_description LIKE ?)');
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    // Query courses
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
        c.created_at,
        cat.name as category_name,
        cat.slug as category_slug,
        u.full_name as instructor_name,
        u.username as instructor_username
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      ${whereClause}
      ORDER BY 
        CASE WHEN c.is_free = 0 THEN 0 ELSE 1 END,
        c.rating DESC,
        c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Add limit and offset to params
    const coursesParams = [...queryParams, limit, offset];

    const courses = await query(sqlQuery, coursesParams);

    // Get total count (without LIMIT/OFFSET)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ${whereClause}
    `;

    const countResult = await query(countQuery, queryParams);
    const total = (countResult as any)[0].total;

    // Format response
    const formattedCourses = (courses as any[]).map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.short_description,
      thumbnailUrl: course.thumbnail_url,
      level: course.level,
      price: course.is_free ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')}đ`,
      priceAmount: course.price,
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
      instructor: {
        name: course.instructor_name,
        username: course.instructor_username,
      },
      createdAt: course.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        courses: formattedCourses,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching courses:', error);
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
