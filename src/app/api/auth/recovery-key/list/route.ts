import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import crypto from 'crypto';

/**
 * GET /api/auth/recovery-key/list
 * 
 * Lấy danh sách recovery keys còn lại của user (chỉ khi đã đăng nhập)
 * 
 * Requires: Authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const cookieToken = request.cookies.get('auth_token')?.value;
    const headerToken = extractTokenFromHeader(request.headers.get('Authorization'));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng đăng nhập',
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

    // Get recovery keys metadata
    const recoveryKeysMeta = await queryOneBuilder<{
      meta_value: string;
    }>('user_metadata', {
      select: 'meta_value',
      filters: {
        user_id: userId,
        meta_key: 'recovery_keys',
      },
    });

    if (!recoveryKeysMeta) {
      return NextResponse.json(
        {
          success: true,
          message: 'Không có recovery keys',
          recoveryKeys: [],
          remainingCount: 0,
        },
        { status: 200 }
      );
    }

    const recoveryKeysData = JSON.parse(recoveryKeysMeta.meta_value);
    const remainingCount = recoveryKeysData.keys?.length || 0;

    // Note: We don't return the actual keys (they're hashed)
    // We only return the count and metadata
    return NextResponse.json(
      {
        success: true,
        message: 'Lấy danh sách recovery keys thành công',
        remainingCount,
        createdAt: recoveryKeysData.createdAt,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[RECOVERY KEY LIST] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
      },
      { status: 500 }
    );
  }
}

