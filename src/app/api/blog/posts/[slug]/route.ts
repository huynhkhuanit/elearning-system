import { NextRequest, NextResponse } from "next/server"
import { rpc, queryBuilder, update } from "@/lib/db"

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

    // Get post details using RPC function
    const posts = await rpc<any[]>('get_blog_post_by_slug', { p_slug: slug })

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài viết" },
        { status: 404 }
      )
    }

    const post = posts[0]

    // Get categories for this post
    const postCategories = await queryBuilder<{
      category_id: number;
    }>('blog_post_categories', {
      select: 'category_id',
      filters: { post_id: post.id },
    })

    const categoryIds = postCategories.map(pc => pc.category_id)
    const categories = categoryIds.length > 0 
      ? await queryBuilder<{
          id: number;
          name: string;
          slug: string;
          description: string | null;
        }>('blog_categories', {
          select: 'id, name, slug, description',
          filters: { id: categoryIds },
        })
      : []

    // Get tags for this post
    const postTags = await queryBuilder<{
      tag_id: number;
    }>('blog_post_tags', {
      select: 'tag_id',
      filters: { post_id: post.id },
    })

    const tagIds = postTags.map(pt => pt.tag_id)
    const tags = tagIds.length > 0
      ? await queryBuilder<{
          id: number;
          name: string;
          slug: string;
        }>('blog_tags', {
          select: 'id, name, slug',
          filters: { id: tagIds },
        })
      : []

    // Increment view count using update helper
    await update('blog_posts', { id: post.id }, {
      view_count: (post.view_count || 0) + 1,
    })

    // Return complete post data
    return NextResponse.json({
      success: true,
      data: {
        ...post,
        view_count: (post.view_count || 0) + 1, // Return updated count
        categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
        tags: tags.sort((a, b) => a.name.localeCompare(b.name)),
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
