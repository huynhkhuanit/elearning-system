import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, update, deleteRows } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password/reset
 * 
 * Đặt lại mật khẩu sau khi xác thực OTP thành công
 * 
 * Body:
 * - resetToken: string (token từ verify-otp)
 * - newPassword: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resetToken, newPassword } = body;

    // Validate input
    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token đặt lại mật khẩu không hợp lệ',
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

    // Find user with reset token
    const resetTokenMeta = await queryOneBuilder<{
      user_id: string;
      meta_value: string;
    }>('user_metadata', {
      select: 'user_id, meta_value',
      filters: {
        meta_key: 'password_reset_token',
      },
    });

    if (!resetTokenMeta) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token đặt lại mật khẩu không tồn tại hoặc đã hết hạn',
        },
        { status: 400 }
      );
    }

    const tokenData = JSON.parse(resetTokenMeta.meta_value);
    const { hash, expiresAt } = tokenData;

    // Check if token expired
    if (new Date(expiresAt) < new Date()) {
      // Delete expired token
      await deleteRows('user_metadata', {
        user_id: resetTokenMeta.user_id,
        meta_key: 'password_reset_token',
      });

      return NextResponse.json(
        {
          success: false,
          message: 'Token đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại',
        },
        { status: 400 }
      );
    }

    // Verify reset token
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken + secret)
      .digest('hex');

    if (hash !== resetTokenHash) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token đặt lại mật khẩu không hợp lệ',
        },
        { status: 400 }
      );
    }

    // Get user
    const user = await queryOneBuilder<{
      id: string;
      email: string;
    }>('users', {
      select: 'id, email',
      filters: {
        id: resetTokenMeta.user_id,
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

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    await update(
      'users',
      {
        id: user.id,
      },
      {
        password_hash: passwordHash,
        updated_at: new Date().toISOString(),
      }
    );

    // Delete reset token after successful password reset
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_token',
    });

    // Delete any remaining OTPs
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_email',
    });
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: 'password_reset_otp_phone',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[FORGOT PASSWORD RESET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

