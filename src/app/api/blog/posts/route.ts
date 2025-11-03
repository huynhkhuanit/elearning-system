import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { RowDataPacket, ResultSetHeader } from "mysql2"

// Helper function to generate slug from Vietnamese text
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // Decompose Vietnamese characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d") // Handle special case 'đ'
    .replace(/Đ/g, "d")
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-+|-+$/g, "") // Trim hyphens from start/end
}

// Helper function to generate excerpt from HTML content
function generateExcerpt(html: string, maxLength: number = 200): string {
  // Remove all HTML tags
  const text = html.replace(/<[^>]*>/g, "").trim()
  // Remove extra whitespace
  const cleaned = text.replace(/\s+/g, " ")
  // Truncate to maxLength
  return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + "..." : cleaned
}

// GET - Fetch blog posts with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const tag = searchParams.get("tag")
    const search = searchParams.get("search")
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50) // Max 50
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build dynamic SQL query
    let sql = `
      SELECT 
        bp.id,
        bp.user_id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.cover_image,
        bp.status,
        bp.view_count,
        bp.published_at,
        bp.created_at,
        bp.updated_at,
        u.username,
        u.full_name,
        u.avatar_url,
        (SELECT COUNT(*) FROM blog_likes WHERE post_id = bp.id) as like_count,
        (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id) as comment_count,
        (SELECT COUNT(*) FROM blog_bookmarks WHERE post_id = bp.id) as bookmark_count,
        GROUP_CONCAT(DISTINCT bc.name ORDER BY bc.name SEPARATOR ', ') as category_names,
        GROUP_CONCAT(DISTINCT bt.name ORDER BY bt.name SEPARATOR ', ') as tag_names
      FROM blog_posts bp
      INNER JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
      LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
      LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
      WHERE 1=1
    `

    const params: any[] = []

    // Filter by user
    if (userId) {
      sql += ` AND bp.user_id = ?`
      params.push(userId)
    }

    // Filter by status
    if (status) {
      sql += ` AND bp.status = ?`
      params.push(status)
    } else {
      // Default: only show published posts for public
      sql += ` AND bp.status = 'published'`
    }

    // Filter by category
    if (categoryId) {
      sql += ` AND EXISTS (
        SELECT 1 FROM blog_post_categories 
        WHERE post_id = bp.id AND category_id = ?
      )`
      params.push(categoryId)
    }

    // Filter by tag
    if (tag) {
      sql += ` AND EXISTS (
        SELECT 1 FROM blog_post_tags bpt2
        INNER JOIN blog_tags bt2 ON bpt2.tag_id = bt2.id
        WHERE bpt2.post_id = bp.id AND bt2.slug = ?
      )`
      params.push(tag)
    }

    // Search by title or content
    if (search) {
      sql += ` AND (bp.title LIKE ? OR bp.excerpt LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm)
    }

    // Group by post
    sql += `
      GROUP BY bp.id, bp.user_id, bp.title, bp.slug, bp.excerpt, bp.cover_image,
               bp.status, bp.view_count, bp.published_at, bp.created_at, bp.updated_at,
               u.username, u.full_name, u.avatar_url
      ORDER BY bp.created_at DESC
      LIMIT ? OFFSET ?
    `
    params.push(limit, offset)

    const results = await query<RowDataPacket[]>(sql, params)

    // Get total count for pagination
    let countSql = `SELECT COUNT(DISTINCT bp.id) as total FROM blog_posts bp WHERE 1=1`
    const countParams: any[] = []

    if (userId) {
      countSql += ` AND bp.user_id = ?`
      countParams.push(userId)
    }
    if (status) {
      countSql += ` AND bp.status = ?`
      countParams.push(status)
    } else {
      countSql += ` AND bp.status = 'published'`
    }
    if (categoryId) {
      countSql += ` AND EXISTS (SELECT 1 FROM blog_post_categories WHERE post_id = bp.id AND category_id = ?)`
      countParams.push(categoryId)
    }
    if (tag) {
      countSql += ` AND EXISTS (
        SELECT 1 FROM blog_post_tags bpt INNER JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bpt.post_id = bp.id AND bt.slug = ?
      )`
      countParams.push(tag)
    }
    if (search) {
      countSql += ` AND (bp.title LIKE ? OR bp.excerpt LIKE ?)`
      const searchTerm = `%${search}%`
      countParams.push(searchTerm, searchTerm)
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
    console.error("Get posts error:", error)
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách bài viết" },
      { status: 500 },
    )
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    // Get token from cookie (note: login API sets cookie as "auth_token")
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Vui lòng đăng nhập để viết blog" },
        { status: 401 },
      )
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Phiên đăng nhập không hợp lệ" },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { title, content, coverImage, categories, tags, status: postStatus } = body

    // Validation
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Tiêu đề không được để trống" },
        { status: 400 },
      )
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Nội dung không được để trống" },
        { status: 400 },
      )
    }

    if (title.length > 255) {
      return NextResponse.json(
        { success: false, error: "Tiêu đề không được vượt quá 255 ký tự" },
        { status: 400 },
      )
    }

    // Categories validation for published posts
    if (postStatus === "published" && (!categories || categories.length === 0)) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn ít nhất một danh mục khi đăng bài" },
        { status: 400 },
      )
    }

    // Use transaction for data consistency
    const result = await transaction(async (connection) => {
      // Generate unique slug
      let slug = generateSlug(title)
      let slugExists = true
      let slugSuffix = 1

      // Check for unique slug
      while (slugExists) {
        const [checkSlug] = await connection.query<RowDataPacket[]>(
          "SELECT id FROM blog_posts WHERE slug = ?",
          [slug],
        )
        if (checkSlug.length === 0) {
          slugExists = false
        } else {
          slug = `${generateSlug(title)}-${slugSuffix}`
          slugSuffix++
        }
      }

      // Generate excerpt from content
      const excerpt = generateExcerpt(content, 200)

      // Determine published_at timestamp
      const publishedAt = postStatus === "published" ? new Date() : null

      // Insert blog post
      const [postResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO blog_posts 
        (user_id, title, slug, content, excerpt, cover_image, status, published_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [decoded.userId, title, slug, content, excerpt, coverImage || null, postStatus || "draft", publishedAt],
      )

      const postId = postResult.insertId

      // Insert categories (if provided)
      if (categories && Array.isArray(categories) && categories.length > 0) {
        for (const categoryId of categories) {
          // Validate category exists
          const [categoryCheck] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM blog_categories WHERE id = ?",
            [categoryId],
          )

          if (categoryCheck.length > 0) {
            await connection.query(
              "INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)",
              [postId, categoryId],
            )
          }
        }
      }

      // Insert tags (if provided)
      if (tags && Array.isArray(tags) && tags.length > 0) {
        for (const tagName of tags) {
          const cleanTagName = tagName.trim().toLowerCase()
          if (!cleanTagName) continue

          // Get or create tag
          const [tagResult] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM blog_tags WHERE name = ?",
            [cleanTagName],
          )

          let tagId: number

          if (tagResult.length === 0) {
            // Create new tag
            const tagSlug = generateSlug(cleanTagName)
            const [newTag] = await connection.query<ResultSetHeader>(
              "INSERT INTO blog_tags (name, slug) VALUES (?, ?)",
              [cleanTagName, tagSlug],
            )
            tagId = newTag.insertId
          } else {
            tagId = tagResult[0].id
          }

          // Link tag to post (avoid duplicates)
          await connection.query(
            `INSERT INTO blog_post_tags (post_id, tag_id) 
             VALUES (?, ?) 
             ON DUPLICATE KEY UPDATE post_id = post_id`,
            [postId, tagId],
          )
        }
      }

      return { postId, slug, status: postStatus || "draft" }
    })

    return NextResponse.json(
      {
        success: true,
        message: result.status === "published" ? "Đã đăng bài viết thành công!" : "Đã lưu bản nháp",
        data: result,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json(
      { success: false, error: "Không thể tạo bài viết. Vui lòng thử lại." },
      { status: 500 },
    )
  }
}
