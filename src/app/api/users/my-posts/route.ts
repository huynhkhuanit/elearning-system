import { NextRequest, NextResponse } from "next/server"
import { rpc } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// GET - Get current user's blog posts
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Vui lòng đăng nhập" },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Phiên đăng nhập không hợp lệ" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // 'draft' | 'published' | null (all)
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const offset = parseInt(searchParams.get("offset") || "0")

    // Use RPC function to get posts
    // If status is empty string or null, pass null to get all posts
    const postStatus = status && status !== "" ? status : null
    const results = await rpc<any[]>('get_blog_posts_with_details', {
      p_user_id: decoded.userId,
      p_status: postStatus,
      p_category_id: null,
      p_tag_slug: null,
      p_search: null,
      p_limit: limit,
      p_offset: offset,
    })

    // Get total count
    const total = await rpc<number>('count_blog_posts', {
      p_user_id: decoded.userId,
      p_status: postStatus,
      p_category_id: null,
      p_tag_slug: null,
      p_search: null,
    })

    return NextResponse.json({
      success: true,
      data: results || [],
      pagination: {
        total: total || 0,
        limit,
        offset,
        hasMore: offset + limit < (total || 0),
      },
    })
  } catch (error) {
    console.error("Get my posts error:", error)
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách bài viết" },
      { status: 500 }
    )
  }
}
