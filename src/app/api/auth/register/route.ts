import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validations/auth';
import { User } from '@/types/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, username, full_name } = validation.data;

    // Check if email already exists
    const existingEmail = await query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email đã được sử dụng',
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await query<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (existingUsername.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tên đăng nhập đã được sử dụng',
        },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert new user
    const result = await query(
      `INSERT INTO users (email, password_hash, username, full_name, membership_type, is_active, is_verified)
       VALUES (?, ?, ?, ?, 'FREE', TRUE, FALSE)`,
      [email, password_hash, username, full_name]
    );

    // Get the newly created user
    const newUser = await query<RowDataPacket[]>(
      `SELECT id, email, username, full_name, avatar_url, bio, membership_type, 
              learning_streak, total_study_time, is_verified, created_at
       FROM users WHERE email = ?`,
      [email]
    );

    if (newUser.length === 0) {
      throw new Error('Failed to retrieve created user');
    }

    const user = newUser[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công! Vui lòng đăng nhập.',
        data: {
          user: {
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
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng ký',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
