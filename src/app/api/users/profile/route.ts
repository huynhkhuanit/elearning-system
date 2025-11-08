import { NextResponse } from 'next/server';
import { queryOneBuilder, update, insert, deleteRows, queryBuilder } from '@/lib/db';
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

    // 1. Update users table (chỉ update fields có giá trị)
    const userUpdates: Record<string, any> = {};

    if (full_name !== undefined) userUpdates.full_name = full_name;
    if (username !== undefined) userUpdates.username = username;
    if (bio !== undefined) userUpdates.bio = bio;
    if (phone !== undefined) userUpdates.phone = phone;
    if (avatar_url !== undefined) userUpdates.avatar_url = avatar_url;

    if (Object.keys(userUpdates).length > 0) {
      userUpdates.updated_at = new Date().toISOString();
      await update('users', { id: userId }, userUpdates);
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
          await deleteRows('user_metadata', { user_id: userId, meta_key: item.key });
        } else {
          // Check if metadata exists
          const existing = await queryOneBuilder<{ id: string }>(
            'user_metadata',
            {
              select: 'id',
              filters: { user_id: userId, meta_key: item.key }
            }
          );

          if (existing) {
            // Update existing
            console.log(`✅ Updating ${item.key} = ${item.value}`);
            await update(
              'user_metadata',
              { id: existing.id },
              { meta_value: item.value, updated_at: new Date().toISOString() }
            );
          } else {
            // Insert new
            console.log(`✅ Inserting ${item.key} = ${item.value}`);
            await insert('user_metadata', {
              user_id: userId,
              meta_key: item.key,
              meta_value: item.value
            });
          }
        }
      } else {
        console.log(`⏭️  Skipping ${item.key} (undefined - not sent from client)`);
      }
    }

    // Fetch updated user data
    const userData = await queryOneBuilder<any>(
      'users',
      {
        select: '*',
        filters: { id: userId }
      }
    );

    if (!userData) {
      throw new Error('User not found');
    }

    // Fetch metadata separately
    const metadataRows = await queryBuilder<{ meta_key: string; meta_value: string }>(
      'user_metadata',
      {
        select: 'meta_key, meta_value',
        filters: { user_id: userId }
      }
    );

    // Build metadata object
    const metadata: any = {};
    for (const row of metadataRows) {
      metadata[row.meta_key] = row.meta_value;
    }

    // Combine user data with metadata
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

    const result = combinedData;

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
