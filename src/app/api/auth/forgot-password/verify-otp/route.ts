import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, update, insert, deleteRows } from '@/lib/db';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password/verify-otp
 * 
 * Xác thực mã OTP 6 số
 * 
 * Body:
 * - method: 'email' | 'phone'
 * - email?: string (nếu method = 'email')
 * - phone?: string (nếu method = 'phone')
 * - otp: string (6 digits)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, email, phone, otp } = body;

    // Validate input
    if (!method || !['email', 'phone'].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phương thức không hợp lệ',
        },
        { status: 400 }
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mã OTP phải là 6 chữ số',
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await queryOneBuilder<{
      id: string;
      email: string;
      phone: string | null;
    }>('users', {
      select: 'id, email, phone',
      filters: method === 'email' ? { email } : { phone },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tài khoản không tồn tại',
        },
        { status: 404 }
      );
    }

    // Get stored OTP
    const metaKey = `password_reset_otp_${method}`;
    const otpMeta = await queryOneBuilder<{
      meta_value: string;
      updated_at: string;
    }>('user_metadata', {
      select: 'meta_value, updated_at',
      filters: {
        user_id: user.id,
        meta_key: metaKey,
      },
    });

    if (!otpMeta) {
      console.log('[VERIFY OTP] No OTP found for user:', user.id);
      return NextResponse.json(
        {
          success: false,
          message: 'Mã OTP không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã mới',
        },
        { status: 400 }
      );
    }

    const otpData = JSON.parse(otpMeta.meta_value);
    const { hash, expiresAt, attempts, maxAttempts } = otpData;
    
    console.log('[VERIFY OTP] Found OTP record:', {
      updatedAt: otpMeta.updated_at,
      expiresAt: expiresAt,
      attempts,
      maxAttempts,
    });

    // Check if OTP expired
    const expiresAtDate = new Date(expiresAt);
    const now = new Date();
    
    // Ensure expiresAt is a valid date
    if (isNaN(expiresAtDate.getTime())) {
      console.error('[VERIFY OTP] Invalid expiresAt:', expiresAt);
      return NextResponse.json(
        {
          success: false,
          message: 'Mã OTP không hợp lệ. Vui lòng yêu cầu mã mới',
        },
        { status: 400 }
      );
    }
    
    // Compare timestamps directly
    if (now.getTime() > expiresAtDate.getTime()) {
      const diffMinutes = Math.round((now.getTime() - expiresAtDate.getTime()) / 60000);
      console.log('[VERIFY OTP] OTP expired:', {
        expiresAt: expiresAt,
        expiresAtDate: expiresAtDate.toISOString(),
        now: now.toISOString(),
        recordUpdatedAt: otpMeta.updated_at,
        diffMs: now.getTime() - expiresAtDate.getTime(),
        diffMinutes: diffMinutes,
      });
      
      // Delete expired OTP
      await deleteRows('user_metadata', {
        user_id: user.id,
        meta_key: metaKey,
      });
      
      return NextResponse.json(
        {
          success: false,
          message: `Mã OTP đã hết hạn ${diffMinutes} phút trước. Vui lòng yêu cầu mã mới`,
        },
        { status: 400 }
      );
    }
    
    console.log('[VERIFY OTP] OTP still valid:', {
      expiresAt: expiresAtDate.toISOString(),
      now: now.toISOString(),
      remainingMs: expiresAtDate.getTime() - now.getTime(),
      remainingMinutes: Math.round((expiresAtDate.getTime() - now.getTime()) / 60000),
    });

    // Check attempts
    if (attempts >= maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          message: 'Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới',
        },
        { status: 400 }
      );
    }

    // Verify OTP
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const otpHash = crypto
      .createHash('sha256')
      .update(otp + secret)
      .digest('hex');

    if (hash !== otpHash) {
      // Increment attempts
      const updatedMetaValue = JSON.stringify({
        ...otpData,
        attempts: attempts + 1,
      });

      await update(
        'user_metadata',
        {
          user_id: user.id,
          meta_key: metaKey,
        },
        {
          meta_value: updatedMetaValue,
          updated_at: new Date().toISOString(),
        }
      );

      return NextResponse.json(
        {
          success: false,
          message: 'Mã OTP không đúng',
          remainingAttempts: maxAttempts - (attempts + 1),
        },
        { status: 400 }
      );
    }

    // OTP verified successfully - generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken + secret)
      .digest('hex');

    const resetExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store reset token
    const resetTokenMetaValue = JSON.stringify({
      hash: resetTokenHash,
      expiresAt: resetExpiresAt.toISOString(),
      method,
    });

    // Try to update first, if fails then insert
    const existingToken = await queryOneBuilder<{ id: string }>('user_metadata', {
      select: 'id',
      filters: {
        user_id: user.id,
        meta_key: 'password_reset_token',
      },
    });

    if (existingToken) {
      await update(
        'user_metadata',
        {
          user_id: user.id,
          meta_key: 'password_reset_token',
        },
        {
          meta_value: resetTokenMetaValue,
          updated_at: new Date().toISOString(),
        }
      );
    } else {
      await insert('user_metadata', [{
        user_id: user.id,
        meta_key: 'password_reset_token',
        meta_value: resetTokenMetaValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    }

    // Delete OTP after successful verification
    await deleteRows('user_metadata', {
      user_id: user.id,
      meta_key: metaKey,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Mã OTP đã được xác thực thành công',
        resetToken, // Return token for client to use in reset password
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[FORGOT PASSWORD VERIFY OTP] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

