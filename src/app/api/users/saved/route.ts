/**
 * API Route: GET /api/users/saved
 * 
 * Get all saved blog posts for the authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const cookieToken = request.cookies.get("auth_token")?.value;
    const headerToken = extractTokenFromHeader(request.headers.get("Authorization"));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Get pagination params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get saved posts with joins
    const { data: bookmarks, error: bookmarksError } = await supabaseAdmin!
      .from("blog_bookmarks")
      .select("post_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (bookmarksError) {
      console.error("Error fetching bookmarks:", bookmarksError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch saved posts" },
        { status: 500 }
      );
    }

    if (!bookmarks || bookmarks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          posts: [],
          pagination: {
            total: 0,
            limit,
            offset,
            hasMore: false,
          },
        },
      });
    }

    const postIds = bookmarks.map((b: any) => b.post_id);

    // Get blog posts with full details
    // Use explicit foreign key relationship to avoid ambiguity
    const { data: posts, error: postsError } = await supabaseAdmin!
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image,
        status,
        view_count,
        published_at,
        created_at,
        updated_at,
        user_id,
        users!blog_posts_user_id_fkey (
          id,
          username,
          full_name,
          avatar_url,
          bio
        )
      `)
      .in("id", postIds)
      .eq("status", "published");

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return NextResponse.json(
        { success: false, message: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    // Get categories for each post
    const { data: postCategories } = await supabaseAdmin!
      .from("blog_post_categories")
      .select("post_id, category_id, blog_categories!inner(id, name, slug)")
      .in("post_id", postIds);

    // Get tags for each post
    const { data: postTags } = await supabaseAdmin!
      .from("blog_post_tags")
      .select("post_id, tag_id, blog_tags!inner(id, name, slug)")
      .in("post_id", postIds);

    // Get like counts
    const { data: likes } = await supabaseAdmin!
      .from("blog_likes")
      .select("post_id")
      .in("post_id", postIds);

    // Get comment counts
    const { data: comments } = await supabaseAdmin!
      .from("blog_comments")
      .select("post_id")
      .in("post_id", postIds);

    // Get bookmark counts
    const { data: allBookmarks } = await supabaseAdmin!
      .from("blog_bookmarks")
      .select("post_id")
      .in("post_id", postIds);

    // Aggregate counts
    const likeCounts: Record<number, number> = {};
    const commentCounts: Record<number, number> = {};
    const bookmarkCounts: Record<number, number> = {};

    likes?.forEach((like: any) => {
      likeCounts[like.post_id] = (likeCounts[like.post_id] || 0) + 1;
    });

    comments?.forEach((comment: any) => {
      commentCounts[comment.post_id] = (commentCounts[comment.post_id] || 0) + 1;
    });

    allBookmarks?.forEach((bookmark: any) => {
      bookmarkCounts[bookmark.post_id] = (bookmarkCounts[bookmark.post_id] || 0) + 1;
    });

    // Get total count for pagination
    const { count: totalCount } = await supabaseAdmin!
      .from("blog_bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Format posts
    const formattedPosts = (posts || []).map((post: any) => {
      const author = post.users || {};
      const categories = (postCategories || [])
        .filter((pc: any) => pc.post_id === post.id)
        .map((pc: any) => pc.blog_categories)
        .filter(Boolean);
      const tags = (postTags || [])
        .filter((pt: any) => pt.post_id === post.id)
        .map((pt: any) => pt.blog_tags)
        .filter(Boolean);

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        cover_image: post.cover_image,
        status: post.status,
        view_count: post.view_count || 0,
        like_count: likeCounts[post.id] || 0,
        comment_count: commentCounts[post.id] || 0,
        bookmark_count: bookmarkCounts[post.id] || 0,
        published_at: post.published_at,
        created_at: post.created_at,
        updated_at: post.updated_at,
        categories,
        tags,
        author: {
          id: author.id,
          username: author.username,
          full_name: author.full_name,
          avatar_url: author.avatar_url,
          bio: author.bio,
        },
      };
    });

    // Sort by bookmark created_at (most recent first)
    const bookmarkMap = new Map(bookmarks.map((b: any) => [b.post_id, b.created_at]));
    formattedPosts.sort((a, b) => {
      const aDate = bookmarkMap.get(a.id) || a.created_at;
      const bDate = bookmarkMap.get(b.id) || b.created_at;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          hasMore: (offset + limit) < (totalCount || 0),
        },
      },
    });
  } catch (error: any) {
    console.error("Error in /api/users/saved:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

