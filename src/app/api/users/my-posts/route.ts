import { NextRequest, NextResponse } from "next/server"
import { rpc, queryBuilder, db as supabaseAdmin } from "@/lib/db"
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

    // Build query filters
    const filters: any = { user_id: decoded.userId }
    if (status && status !== "") {
      filters.status = status
    }

    // Query posts directly from database
    // First, get posts without JOIN to avoid potential issues
    let query = supabaseAdmin!
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        status,
        view_count,
        published_at,
        created_at,
        updated_at,
        user_id
      `)
      .eq("user_id", decoded.userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply status filter if provided
    if (status && status !== "") {
      query = query.eq("status", status)
    }

    const { data: posts, error: postsError } = await query

    if (postsError) {
      console.error("Error fetching posts:", postsError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Không thể lấy danh sách bài viết",
          details: process.env.NODE_ENV === 'development' ? postsError.message : undefined
        },
        { status: 500 }
      )
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false,
        },
      })
    }

    // Get categories for each post
    const postIds = (posts || []).map((p: any) => p.id)
    let categoriesData: Record<number, any> = {}
    let categoryMap = new Map<number, any>()

    if (postIds.length > 0) {
      // Get post categories
      const { data: postCategories } = await supabaseAdmin!
        .from("blog_post_categories")
        .select("post_id, category_id")
        .in("post_id", postIds)

      if (postCategories && postCategories.length > 0) {
        const categoryIds = [...new Set(postCategories.map((pc: any) => pc.category_id))]
        
        // Get category details
        const { data: categories } = await supabaseAdmin!
          .from("blog_categories")
          .select("id, name, slug")
          .in("id", categoryIds)

        if (categories) {
          categories.forEach((cat: any) => {
            categoryMap.set(cat.id, cat)
          })
        }

        // Map categories to posts
        postCategories.forEach((pc: any) => {
          const category = categoryMap.get(pc.category_id)
          if (category) {
            if (!categoriesData[pc.post_id]) {
              categoriesData[pc.post_id] = category
            }
          }
        })
      }
    }

    // Format results
    const formattedPosts = (posts || []).map((post: any) => ({
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      cover_image: post.cover_image || null,
      status: post.status,
      views_count: post.view_count || 0,
      likes_count: 0, // TODO: Get from blog_post_likes table if needed
      created_at: post.created_at,
      updated_at: post.updated_at,
      published_at: post.published_at || null,
      category_name: categoriesData[post.id]?.name || null,
      category_slug: categoriesData[post.id]?.slug || null,
    }))

    // Get total count - use a simpler approach
    let countQuery = supabaseAdmin!
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", decoded.userId)

    if (status && status !== "") {
      countQuery = countQuery.eq("status", status)
    }

    const { count, error: countError } = await countQuery

    // Use posts.length as fallback if count fails
    const totalCount = countError ? posts.length : (count || 0)

    return NextResponse.json({
      success: true,
      data: formattedPosts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    })
  } catch (error: any) {
    console.error("Get my posts error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Không thể lấy danh sách bài viết",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
