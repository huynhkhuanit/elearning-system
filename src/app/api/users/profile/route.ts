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

    console.log('📝 Update request body:', {
      full_name,
      username,
      bio,
      phone,
      avatar_url,
      social: { website, linkedin, github, twitter, facebook }
    });

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

      // 2. Update metadata (social links) - chỉ update các field được gửi lên
      const metadataItems = [
        { key: 'social_website', value: website },
        { key: 'social_linkedin', value: linkedin },
        { key: 'social_github', value: github },
        { key: 'social_twitter', value: twitter },
        { key: 'social_facebook', value: facebook },
      ];

      for (const item of metadataItems) {
        // Chỉ xử lý khi value KHÔNG phải undefined (tức là được gửi từ client)
        if (item.value !== undefined) {
          if (item.value === null || item.value === '' || item.value.trim() === '') {
            // Delete if empty or whitespace
            console.log(`🗑️  Deleting ${item.key}`);
            await connection.execute(
              'DELETE FROM user_metadata WHERE user_id = ? AND meta_key = ?',
              [userId, item.key]
            );
          } else {
            // Insert or update
            console.log(`✅ Upserting ${item.key} = ${item.value}`);
            await connection.execute(
              `INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
               VALUES (UUID(), ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                 meta_value = VALUES(meta_value),
                 updated_at = CURRENT_TIMESTAMP`,
              [userId, item.key, item.value]
            );
          }
        } else {
          console.log(`⏭️  Skipping ${item.key} (undefined - not sent from client)`);
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
