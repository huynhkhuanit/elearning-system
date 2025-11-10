import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, insert, update } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/auth/recovery-key/generate
 * 
 * Tạo recovery key cho người dùng (chỉ khi đã đăng nhập)
 * Recovery key được tạo khi người dùng có cả email và phone
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
          message: 'Vui lòng đăng nhập để tạo recovery key',
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
      phone: string | null;
    }>('users', {
      select: 'id, email, phone',
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

    // Check if user has both email and phone
    if (!user.phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng cập nhật số điện thoại trong hồ sơ để tạo recovery key',
        },
        { status: 400 }
      );
    }

    // Generate recovery key (16 characters, alphanumeric)
    const recoveryKey = crypto.randomBytes(8).toString('hex').toUpperCase();
    const recoveryKeyHash = crypto
      .createHash('sha256')
      .update(recoveryKey + process.env.JWT_SECRET || 'fallback-secret')
      .digest('hex');

    // Store recovery key hash
    const recoveryKeyMetaValue = JSON.stringify({
      hash: recoveryKeyHash,
      createdAt: new Date().toISOString(),
    });

    // Check if recovery key already exists
    const existingKey = await queryOneBuilder<{ id: string }>('user_metadata', {
      select: 'id',
      filters: {
        user_id: userId,
        meta_key: 'recovery_key',
      },
    });

    if (existingKey) {
      // Update existing recovery key
      await update(
        'user_metadata',
        {
          meta_value: recoveryKeyMetaValue,
          updated_at: new Date().toISOString(),
        },
        {
          user_id: userId,
          meta_key: 'recovery_key',
        }
      );
    } else {
      // Insert new recovery key
      await insert('user_metadata', {
        user_id: userId,
        meta_key: 'recovery_key',
        meta_value: recoveryKeyMetaValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Recovery key đã được tạo thành công',
        recoveryKey, // Return key for user to save
        warning: '⚠️ Lưu ý: Hãy lưu recovery key này ở nơi an toàn. Bạn sẽ cần nó nếu mất cả email và số điện thoại.',
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

