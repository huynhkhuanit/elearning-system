import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { RowDataPacket } from "mysql2"

// GET - Get single blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug không hợp lệ" },
        { status: 400 }
      )
    }

    // Get post details with author, categories, and tags
    const sql = `
      SELECT 
        bp.id,
        bp.user_id,
        bp.title,
        bp.slug,
        bp.content,
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
        u.bio,
        (SELECT COUNT(*) FROM blog_likes WHERE post_id = bp.id) as like_count,
        (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id) as comment_count,
        (SELECT COUNT(*) FROM blog_bookmarks WHERE post_id = bp.id) as bookmark_count
      FROM blog_posts bp
      INNER JOIN users u ON bp.user_id = u.id
      WHERE bp.slug = ?
      LIMIT 1
    `

    const [post] = await query<RowDataPacket[]>(sql, [slug])

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài viết" },
        { status: 404 }
      )
    }

    // Get categories
    const categoriesSql = `
      SELECT bc.id, bc.name, bc.slug, bc.description
      FROM blog_categories bc
      INNER JOIN blog_post_categories bpc ON bc.id = bpc.category_id
      WHERE bpc.post_id = ?
      ORDER BY bc.name
    `
    const categories = await query<RowDataPacket[]>(categoriesSql, [post.id])

    // Get tags
    const tagsSql = `
      SELECT bt.id, bt.name, bt.slug
      FROM blog_tags bt
      INNER JOIN blog_post_tags bpt ON bt.id = bpt.tag_id
      WHERE bpt.post_id = ?
      ORDER BY bt.name
    `
    const tags = await query<RowDataPacket[]>(tagsSql, [post.id])

    // Increment view count
    await query(
      "UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?",
      [post.id]
    )

    // Return complete post data
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        view_count: post.view_count + 1, // Return updated count
        categories,
        tags,
        author: {
          id: post.user_id,
          username: post.username,
          full_name: post.full_name,
          avatar_url: post.avatar_url,
          bio: post.bio,
        },
      },
    })
  } catch (error) {
    console.error("Get post detail error:", error)
    return NextResponse.json(
      { success: false, error: "Không thể lấy thông tin bài viết" },
      { status: 500 }
    )
  }
}
