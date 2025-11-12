import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, insert, update } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/auth/recovery-key/generate
 * 
 * Tạo 16 recovery keys mới cho người dùng (chỉ khi đã đăng nhập)
 * Nếu đã có recovery keys, sẽ thay thế bằng 16 keys mới
 * 
 * Requires: Authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = extractTokenFromHeader(request.headers.get('Authorization'));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng đăng nhập để tạo recovery keys',
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token không hợp lệ',
        },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Get user info
    const user = await queryOneBuilder<{
      id: string;
      email: string;
    }>('users', {
      select: 'id, email',
      filters: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Người dùng không tồn tại',
        },
        { status: 404 }
      );
    }

    // Generate 16 recovery keys
    const recoveryKeys: string[] = [];
    const recoveryKeyHashes: Array<{ key: string; hash: string }> = [];

    for (let i = 0; i < 16; i++) {
      // Generate 16-character alphanumeric key (8 bytes = 16 hex characters)
      const key = crypto.randomBytes(8).toString('hex').toUpperCase();
      const hash = crypto
        .createHash('sha256')
        .update(key + (process.env.JWT_SECRET || 'fallback-secret'))
        .digest('hex');
      
      recoveryKeys.push(key);
      recoveryKeyHashes.push({ key, hash });
    }

    // Store recovery keys in user_metadata
    const recoveryKeysMetaValue = JSON.stringify({
      keys: recoveryKeyHashes.map(({ hash }) => ({
        hash,
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
    });

    // Check if recovery keys already exist
    const existingKeysMeta = await queryOneBuilder<{ id: string }>('user_metadata', {
      select: 'id',
      filters: {
        user_id: userId,
        meta_key: 'recovery_keys',
      },
    });

    if (existingKeysMeta) {
      // Update existing recovery keys
      await update(
        'user_metadata',
        {
          meta_value: recoveryKeysMetaValue,
          updated_at: new Date().toISOString(),
        },
        {
          id: existingKeysMeta.id,
        }
      );
    } else {
      // Insert new recovery keys
      await insert('user_metadata', {
        user_id: userId,
        meta_key: 'recovery_keys',
        meta_value: recoveryKeysMetaValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: '16 recovery keys đã được tạo thành công',
        recoveryKeys, // Return keys for user to save
        warning: '⚠️ Lưu ý: Hãy lưu các recovery keys này ở nơi an toàn. Mỗi key chỉ có thể sử dụng một lần để khôi phục mật khẩu.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[RECOVERY KEY GENERATE] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

