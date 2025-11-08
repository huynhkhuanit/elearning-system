import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = extractTokenFromHeader(
      request.headers.get('Authorization')
    );
    
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy token xác thực',
        },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn',
        },
        { status: 401 }
      );
    }

    // Get user from database using Supabase
    const user = await queryOneBuilder<{
      id: string;
      email: string;
      username: string;
      full_name: string;
      avatar_url: string | null;
      bio: string | null;
      phone: string | null;
      role: string;
      membership_type: string;
      membership_expires_at: string | null;
      learning_streak: number;
      total_study_time: number;
      is_verified: boolean;
      is_active: boolean;
      last_login: string | null;
      created_at: string;
    }>('users', {
      select: 'id, email, username, full_name, avatar_url, bio, phone, role, membership_type, membership_expires_at, learning_streak, total_study_time, is_verified, is_active, last_login, created_at',
      filters: { id: payload.userId, is_active: true },
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

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            bio: user.bio,
            phone: user.phone,
            role: user.role,
            membership_type: user.membership_type,
            membership_expires_at: user.membership_expires_at,
            learning_streak: user.learning_streak,
            total_study_time: user.total_study_time,
            is_verified: user.is_verified,
            last_login: user.last_login,
            created_at: user.created_at,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi lấy thông tin người dùng',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
