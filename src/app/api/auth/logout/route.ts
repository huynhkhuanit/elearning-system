import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: 'Đăng xuất thành công',
      },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.delete('auth_token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi đăng xuất',
      },
      { status: 500 }
    );
  }
}
