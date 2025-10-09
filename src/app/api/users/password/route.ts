import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
// PUT /api/users/password
// ============================================
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
    const { current_password, new_password } = body;

    // Validation
    if (!current_password || !new_password) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin mật khẩu' },
        { status: 400 }
      );
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Get current user
    const users = await query<any>(
      'SELECT id, password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu hiện tại không đúng' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(new_password, salt);

    // Update password
    await query(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi đổi mật khẩu', error: error.message },
      { status: 500 }
    );
  }
}
