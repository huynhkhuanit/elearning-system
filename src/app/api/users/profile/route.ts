import { NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper: Get user from token
async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// ============================================
// GET /api/users/[username]
// ============================================
// Optimized query: Lấy user info + metadata trong 1 query duy nhất
export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Query user data first
    const userResults = await query<any>(
      `SELECT 
        u.id,
        u.email,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio,
        u.phone,
        u.membership_type,
        u.membership_expires_at,
        u.learning_streak,
        u.total_study_time,
        u.is_verified,
        u.created_at,
        
        -- Stats (sử dụng subqueries để tối ưu)
        (SELECT COUNT(*) FROM enrollments WHERE user_id = u.id) as total_courses_enrolled,
        (SELECT COUNT(*) FROM enrollments WHERE user_id = u.id AND is_completed = TRUE) as total_courses_completed,
        (SELECT COUNT(*) FROM articles WHERE author_id = u.id AND status = 'PUBLISHED') as total_articles_published,
        (SELECT COUNT(*) FROM forum_posts WHERE user_id = u.id) as total_forum_posts,
        (SELECT COUNT(*) FROM user_followers WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id) as following_count
        
      FROM users u
      WHERE u.username = ? AND u.is_active = TRUE`,
      [username]
    );

    if (!userResults || userResults.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    const user = userResults[0];

    // Fetch metadata separately to avoid JSON_OBJECTAGG NULL key issues
    const metadataResults = await query<any>(
      `SELECT meta_key, meta_value FROM user_metadata WHERE user_id = ?`,
      [user.id]
    );

    // Build metadata object
    const metadata: any = {};
    for (const row of metadataResults) {
      metadata[row.meta_key] = row.meta_value;
    }

    // Build response với social links
    const profileData = {
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
      
      // Extract social links from metadata
      website: metadata.social_website || null,
      linkedin: metadata.social_linkedin || null,
      github: metadata.social_github || null,
      twitter: metadata.social_twitter || null,
      facebook: metadata.social_facebook || null,
      
      // Stats
      total_courses_enrolled: user.total_courses_enrolled,
      total_courses_completed: user.total_courses_completed,
      total_articles_published: user.total_articles_published,
      total_forum_posts: user.total_forum_posts,
      followers_count: user.followers_count,
      following_count: user.following_count,
    };

    return NextResponse.json({
      success: true,
      data: profileData,
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi server', error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PUT /api/users/profile
// ============================================
// Optimized update: Cập nhật users table và metadata trong transaction
export async function PUT(request: Request) {
  try {
    const userId = await getUserFromToken();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      full_name,
      username,
      bio,
      phone,
      avatar_url,
      // Social links
      website,
      linkedin,
      github,
      twitter,
      facebook,
    } = body;

    // Use transaction helper to avoid prepared statement protocol issue
    const result = await transaction(async (connection) => {
      // 1. Update users table (chỉ update fields có giá trị)
      const userUpdates: string[] = [];
      const userValues: any[] = [];

      if (full_name !== undefined) {
        userUpdates.push('full_name = ?');
        userValues.push(full_name);
      }
      if (username !== undefined) {
        userUpdates.push('username = ?');
        userValues.push(username);
      }
      if (bio !== undefined) {
        userUpdates.push('bio = ?');
        userValues.push(bio);
      }
      if (phone !== undefined) {
        userUpdates.push('phone = ?');
        userValues.push(phone);
      }
      if (avatar_url !== undefined) {
        userUpdates.push('avatar_url = ?');
        userValues.push(avatar_url);
      }

      if (userUpdates.length > 0) {
        userValues.push(userId);
        await connection.execute(
          `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`,
          userValues
        );
      }

      // 2. Update metadata (social links) - sử dụng INSERT ON DUPLICATE KEY UPDATE
      const metadataItems = [
        { key: 'social_website', value: website },
        { key: 'social_linkedin', value: linkedin },
        { key: 'social_github', value: github },
        { key: 'social_twitter', value: twitter },
        { key: 'social_facebook', value: facebook },
      ];

      for (const item of metadataItems) {
        if (item.value !== undefined) {
          if (item.value === null || item.value === '') {
            // Delete if empty
            await connection.execute(
              'DELETE FROM user_metadata WHERE user_id = ? AND meta_key = ?',
              [userId, item.key]
            );
          } else {
            // Insert or update
            await connection.execute(
              `INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
               VALUES (UUID(), ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                 meta_value = VALUES(meta_value),
                 updated_at = CURRENT_TIMESTAMP`,
              [userId, item.key, item.value]
            );
          }
        }
      }

      // Fetch updated user data without metadata aggregation to avoid NULL key issues
      const [userResult] = await connection.execute(
        `SELECT * FROM users WHERE id = ?`,
        [userId]
      );

      // Fetch metadata separately
      const [metadataResult] = await connection.execute(
        `SELECT meta_key, meta_value FROM user_metadata WHERE user_id = ?`,
        [userId]
      );

      // Build metadata object
      const metadata: any = {};
      for (const row of metadataResult as any[]) {
        metadata[row.meta_key] = row.meta_value;
      }

      // Combine user data with metadata
      const userData = (userResult as any[])[0];
      const combinedData = {
        ...userData,
        metadata,
        // Extract social links for convenience
        website: metadata.social_website || null,
        linkedin: metadata.social_linkedin || null,
        github: metadata.social_github || null,
        twitter: metadata.social_twitter || null,
        facebook: metadata.social_facebook || null,
      };

      return combinedData;
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: result,
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật', error: error.message },
      { status: 500 }
    );
  }
}
