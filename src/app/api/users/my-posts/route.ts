import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { RowDataPacket } from "mysql2"

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

    // Build query
    let sql = `
      SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.status,
        bp.view_count,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        (SELECT COUNT(*) FROM blog_likes WHERE post_id = bp.id) as like_count,
        (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id) as comment_count,
        (SELECT COUNT(*) FROM blog_bookmarks WHERE post_id = bp.id) as bookmark_count,
        GROUP_CONCAT(DISTINCT bc.name ORDER BY bc.name SEPARATOR ', ') as category_names,
        GROUP_CONCAT(DISTINCT bt.name ORDER BY bt.name SEPARATOR ', ') as tag_names
      FROM blog_posts bp
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
      LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
      LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
      WHERE bp.user_id = ?
    `

    const params: any[] = [decoded.userId]

    // Filter by status if provided
    if (status) {
      sql += ` AND bp.status = ?`
      params.push(status)
    }

    sql += `
      GROUP BY bp.id, bp.title, bp.slug, bp.excerpt, bp.cover_image,
               bp.status, bp.view_count, bp.published_at, bp.created_at, bp.updated_at
      ORDER BY bp.updated_at DESC
      LIMIT ? OFFSET ?
    `
    params.push(limit, offset)

    const results = await query<RowDataPacket[]>(sql, params)

    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM blog_posts WHERE user_id = ?`
    const countParams: any[] = [decoded.userId]

    if (status) {
      countSql += ` AND status = ?`
      countParams.push(status)
    }

    const [countResult] = await query<RowDataPacket[]>(countSql, countParams)
    const total = countResult.total || 0

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
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
