import { NextRequest, NextResponse } from 'next/server';
import { rpc, queryBuilder } from '@/lib/db-helpers';
import { UserProfile } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Fetch user profile data using RPC function
    const users = await rpc<any[]>('get_user_profile', { p_username: username });

    if (!users || users.length === 0) {
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
    const metadataResults = await queryBuilder<{ meta_key: string; meta_value: string }>(
      'user_metadata',
      {
        select: 'meta_key, meta_value',
        filters: { user_id: user.id },
      }
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
      total_courses_enrolled: Number(user.total_courses_enrolled) || 0,
      total_courses_completed: Number(user.total_courses_completed) || 0,
      total_articles_published: Number(user.total_articles_published) || 0,
      total_forum_posts: Number(user.total_forum_posts) || 0,
      followers_count: Number(user.followers_count) || 0,
      following_count: Number(user.following_count) || 0,
      
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
