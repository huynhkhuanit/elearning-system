/**
 * Example: Migrated Login Route using Supabase
 * This shows how to convert from MySQL to Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, update } from '@/lib/db-helpers';
import { comparePassword, generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email using Supabase query builder
    const user = await queryOneBuilder<{
      id: string;
      email: string;
      password_hash: string;
      username: string;
      full_name: string;
      avatar_url: string | null;
      bio: string | null;
      membership_type: string;
      learning_streak: number;
      total_study_time: number;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
    }>('users', {
      select: 'id, email, password_hash, username, full_name, avatar_url, bio, membership_type, learning_streak, total_study_time, is_verified, is_active, created_at',
      filters: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa',
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        },
        { status: 401 }
      );
    }

    // Update last login using Supabase update helper
    await update('users', { id: user.id }, { last_login: new Date().toISOString() });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      membership_type: user.membership_type,
    });

    // Prepare public user data
    const publicUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      membership_type: user.membership_type,
      learning_streak: user.learning_streak,
      total_study_time: user.total_study_time,
      is_verified: user.is_verified,
      created_at: user.created_at,
    };

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          user: publicUser,
          token,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for security
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng nhập',
      },
      { status: 500 }
    );
  }
}

