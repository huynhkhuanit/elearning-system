import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, update, deleteRows } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/auth/recovery-key/verify
 * 
 * Xác thực recovery key và đặt lại mật khẩu
 * Dùng khi người dùng mất cả email và số điện thoại
 * 
 * Body:
 * - recoveryKey: string
 * - email: string (để tìm user)
 * - newPassword: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recoveryKey, email, newPassword } = body;

    // Validate input
    if (!recoveryKey || recoveryKey.length !== 16) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không hợp lệ',
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập email',
        },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mật khẩu phải có ít nhất 6 ký tự',
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await queryOneBuilder<{
      id: string;
      email: string;
    }>('users', {
      select: 'id, email',
      filters: {
        email,
      },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key hoặc email không đúng',
        },
        { status: 400 }
      );
    }

    // Get recovery key
    const recoveryKeyMeta = await queryOneBuilder<{
      meta_value: string;
    }>('user_metadata', {
      select: 'meta_value',
      filters: {
        user_id: user.id,
        meta_key: 'recovery_key',
      },
    });

    if (!recoveryKeyMeta) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không tồn tại cho tài khoản này',
        },
        { status: 400 }
      );
    }

    const recoveryKeyData = JSON.parse(recoveryKeyMeta.meta_value);
    const { hash } = recoveryKeyData;

    // Verify recovery key
    const recoveryKeyHash = crypto
      .createHash('sha256')
      .update(recoveryKey.toUpperCase() + process.env.JWT_SECRET || 'fallback-secret')
      .digest('hex');

    if (hash !== recoveryKeyHash) {
      return NextResponse.json(
        {
          success: false,
          message: 'Recovery key không đúng',
        },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await update(
      'users',
      {
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      },
      {
        id: user.id,
      }
    );

    // Delete recovery key after use (security: one-time use)
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'recovery_key',
    });

    // Delete any remaining OTPs and reset tokens
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_email',
    });
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_phone',
    });
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_token',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới',
        warning: 'Recovery key đã được sử dụng và đã bị xóa. Vui lòng tạo recovery key mới sau khi đăng nhập.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[RECOVERY KEY VERIFY] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

