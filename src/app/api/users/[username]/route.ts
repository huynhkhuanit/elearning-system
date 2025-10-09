import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { UserProfile } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

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

    const user = users[0];

    // Fetch metadata separately
    const metadataResults = await query<RowDataPacket[]>(
      `SELECT meta_key, meta_value FROM user_metadata WHERE user_id = ?`,
      [user.id]
    );

    // Build metadata object
    const metadata: any = {};
    for (const row of metadataResults) {
      metadata[row.meta_key] = row.meta_value;
    }

    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      phone: user.phone,
      membership_type: user.membership_type,
      membership_expires_at: user.membership_expires_at,
      learning_streak: user.learning_streak,
      total_study_time: user.total_study_time,
      is_verified: user.is_verified,
      created_at: user.created_at,
      total_courses_enrolled: user.total_courses_enrolled,
      total_courses_completed: user.total_courses_completed,
      total_articles_published: user.total_articles_published,
      total_forum_posts: user.total_forum_posts,
      followers_count: user.followers_count,
      following_count: user.following_count,
      
      // Social links from metadata
      website: metadata.social_website || null,
      linkedin: metadata.social_linkedin || null,
      github: metadata.social_github || null,
      twitter: metadata.social_twitter || null,
      facebook: metadata.social_facebook || null,
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
