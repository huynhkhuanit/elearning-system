import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { UserProfile } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Fetch user profile data
    const users = await query<RowDataPacket[]>(
      `SELECT 
        u.id, u.email, u.username, u.full_name, u.avatar_url, u.bio, u.phone,
        u.membership_type, u.membership_expires_at, u.learning_streak, 
        u.total_study_time, u.is_verified, u.created_at,
        (SELECT COUNT(*) FROM enrollments WHERE user_id = u.id AND is_active = TRUE) as total_courses_enrolled,
        (SELECT COUNT(*) FROM enrollments WHERE user_id = u.id AND completed_at IS NOT NULL) as total_courses_completed,
        0 as total_articles_published,
        0 as total_forum_posts,
        0 as followers_count,
        0 as following_count
       FROM users u
       WHERE u.username = ? AND u.is_active = TRUE
       LIMIT 1`,
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy người dùng',
        },
        { status: 404 }
      );
    }

    const userProfile: UserProfile = {
      id: users[0].id,
      email: users[0].email,
      username: users[0].username,
      full_name: users[0].full_name,
      avatar_url: users[0].avatar_url,
      bio: users[0].bio,
      phone: users[0].phone,
      membership_type: users[0].membership_type,
      membership_expires_at: users[0].membership_expires_at,
      learning_streak: users[0].learning_streak,
      total_study_time: users[0].total_study_time,
      is_verified: users[0].is_verified,
      created_at: users[0].created_at,
      total_courses_enrolled: users[0].total_courses_enrolled,
      total_courses_completed: users[0].total_courses_completed,
      total_articles_published: users[0].total_articles_published,
      total_forum_posts: users[0].total_forum_posts,
      followers_count: users[0].followers_count,
      following_count: users[0].following_count,
    };

    return NextResponse.json(
      {
        success: true,
        data: userProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
      },
      { status: 500 }
    );
  }
}
