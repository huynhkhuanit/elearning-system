import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { RowDataPacket, ResultSetHeader } from "mysql2"

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Helper function to generate excerpt
function generateExcerpt(html: string, maxLength: number = 200): string {
  const text = html.replace(/<[^>]*>/g, "").trim()
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

// GET - Get all posts or user's posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    let sql = `
      SELECT 
        bp.*,
        u.username,
        u.full_name,
        u.avatar_url,
        (SELECT COUNT(*) FROM blog_likes WHERE post_id = bp.id) as like_count,
        (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id) as comment_count,
        GROUP_CONCAT(DISTINCT CONCAT('{"id":', bc.id, ',"name":"', bc.name, '","slug":"', bc.slug, '"}')) as categories
      FROM blog_posts bp
      JOIN users u ON bp.user_id = u.id
      LEFT JOIN blog_post_categories bpc ON bp.id = bpc.post_id
      LEFT JOIN blog_categories bc ON bpc.category_id = bc.id
      WHERE 1=1
    `

    const params: any[] = []

    if (userId) {
      sql += ` AND bp.user_id = ?`
      params.push(userId)
    }

    if (status) {
      sql += ` AND bp.status = ?`
      params.push(status)
    } else {
      sql += ` AND bp.status = 'published'`
    }

    sql += `
      GROUP BY bp.id, u.username, u.full_name, u.avatar_url
      ORDER BY bp.created_at DESC
      LIMIT ? OFFSET ?
    `
    params.push(limit, offset)

    const results = await query<RowDataPacket[]>(sql, params)

    // Parse categories JSON strings
    const posts = results.map((post: any) => ({
      ...post,
      categories: post.categories
        ? `[${post.categories}]`.replace(/}\{/g, "},{")
        : "[]",
    }))

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "Không thể lấy danh sách bài viết" }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { title, content, coverImage, categories, tags, status: postStatus } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    const result = await transaction(async (connection) => {
      // Generate unique slug
      let slug = generateSlug(title)
      let slugExists = true
      let slugSuffix = 1

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

      // Generate excerpt
      const excerpt = generateExcerpt(content)

      // Insert post
      const [postResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO blog_posts 
        (user_id, title, slug, content, excerpt, cover_image, status, published_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          decoded.userId,
          title,
          slug,
          content,
          excerpt,
          coverImage || null,
          postStatus || "draft",
          postStatus === "published" ? new Date() : null,
        ],
      )

      const postId = postResult.insertId

      // Insert categories
      if (categories && categories.length > 0) {
        for (const categoryId of categories) {
          await connection.query("INSERT INTO blog_post_categories (post_id, category_id) VALUES (?, ?)", [
            postId,
            categoryId,
          ])
        }
      }

      // Insert tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Get or create tag
          const [tagResult] = await connection.query<RowDataPacket[]>("SELECT id FROM blog_tags WHERE name = ?", [
            tagName,
          ])

          let tagId
          if (tagResult.length === 0) {
            const tagSlug = generateSlug(tagName)
            const [newTag] = await connection.query<ResultSetHeader>(
              "INSERT INTO blog_tags (name, slug) VALUES (?, ?)",
              [tagName, tagSlug],
            )
            tagId = newTag.insertId
          } else {
            tagId = tagResult[0].id
          }

          await connection.query("INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)", [postId, tagId])
        }
      }

      return { postId, slug }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Không thể tạo bài viết" }, { status: 500 })
  }
}
