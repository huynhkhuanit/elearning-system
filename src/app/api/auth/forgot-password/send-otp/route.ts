import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, insert, update, queryBuilder } from '@/lib/db';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password/send-otp
 * 
 * Gửi mã OTP 6 số về email hoặc số điện thoại
 * 
 * Body:
 * - method: 'email' | 'phone'
 * - email?: string (nếu method = 'email')
 * - phone?: string (nếu method = 'phone')
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { method, email, phone } = body;

    // Validate input
    if (!method || !['email', 'phone'].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phương thức không hợp lệ. Vui lòng chọn email hoặc số điện thoại',
        },
        { status: 400 }
      );
    }

    if (method === 'email' && !email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập email',
        },
        { status: 400 }
      );
    }

    if (method === 'phone' && !phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập số điện thoại',
        },
        { status: 400 }
      );
    }

    // Find user by email or phone
    const user = await queryOneBuilder<{
      id: string;
      email: string;
      phone: string | null;
    }>('users', {
      select: 'id, email, phone',
      filters: method === 'email' ? { email } : { phone },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json(
        {
          success: true,
          message: 'Nếu tài khoản tồn tại, mã OTP đã được gửi',
        },
        { status: 200 }
      );
    }

    // Check if user has the required contact method
    if (method === 'email' && user.email !== email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email không khớp với tài khoản',
        },
        { status: 400 }
      );
    }

    if (method === 'phone' && (!user.phone || user.phone !== phone)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Số điện thoại không khớp với tài khoản',
        },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash OTP for storage
    const otpHash = crypto
      .createHash('sha256')
      .update(otp + process.env.JWT_SECRET || 'fallback-secret')
      .digest('hex');

    // Store OTP in user_metadata
    const metaKey = `password_reset_otp_${method}`;
    const metaValue = JSON.stringify({
      hash: otpHash,
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      maxAttempts: 5,
    });

    // Check if OTP already exists
    const existingOtp = await queryOneBuilder<{ id: string }>('user_metadata', {
      select: 'id',
      filters: {
        user_id: user.id,
        meta_key: metaKey,
      },
    });

    if (existingOtp) {
      // Update existing OTP
      await update('user_metadata', 
        { meta_value: metaValue, updated_at: new Date().toISOString() },
        { user_id: user.id, meta_key: metaKey }
      );
    } else {
      // Insert new OTP
      await insert('user_metadata', {
        user_id: user.id,
        meta_key: metaKey,
        meta_value: metaValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // TODO: Send OTP via email/SMS service
    // For now, log it (in production, use email/SMS service)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${method === 'email' ? email : phone}: ${otp}`);
      console.log(`[DEV] OTP expires at: ${expiresAt.toISOString()}`);
    }

    // In production, integrate with email/SMS service:
    // if (method === 'email') {
    //   await sendEmail(email, 'Mã xác thực đặt lại mật khẩu', `Mã OTP của bạn là: ${otp}`);
    // } else {
    //   await sendSMS(phone, `Mã OTP của bạn là: ${otp}`);
    // }

    return NextResponse.json(
      {
        success: true,
        message: `Mã OTP đã được gửi đến ${method === 'email' ? 'email' : 'số điện thoại'} của bạn`,
        // Only return OTP in development
        ...(process.env.NODE_ENV === 'development' && { otp }),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[FORGOT PASSWORD SEND OTP] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

