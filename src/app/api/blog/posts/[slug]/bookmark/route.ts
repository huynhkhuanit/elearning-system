/**
 * API Route: POST /api/blog/posts/[slug]/bookmark
 * 
 * Toggle bookmark status for a blog post
 * - If bookmarked, unbookmark it
 * - If not bookmarked, bookmark it
 */

import { NextRequest, NextResponse } from "next/server";
import { db as supabaseAdmin } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";
import { queryOneBuilder, insert, deleteRows } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
    const { slug } = await params;

    // Get post by slug
    const post = await queryOneBuilder<{ id: number }>("blog_posts", {
      select: "id",
      filters: { slug, status: "published" },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const postId = post.id;

    // Check if already bookmarked
    const existingBookmark = await queryOneBuilder<{ post_id: number }>(
      "blog_bookmarks",
      {
        select: "post_id",
        filters: { post_id: postId, user_id: userId },
      }
    );

    if (existingBookmark) {
      // Unbookmark - delete the bookmark
      await deleteRows("blog_bookmarks", {
        post_id: postId,
        user_id: userId,
      });

      return NextResponse.json({
        success: true,
        data: { bookmarked: false },
        message: "Đã bỏ lưu bài viết",
      });
    } else {
      // Bookmark - insert new bookmark
      await insert("blog_bookmarks", {
        post_id: postId,
        user_id: userId,
      });

      return NextResponse.json({
        success: true,
        data: { bookmarked: true },
        message: "Đã lưu bài viết",
      });
    }
  } catch (error: any) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/blog/posts/[slug]/bookmark
 * 
 * Check if current user has bookmarked this post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Authenticate user
    const cookieToken = request.cookies.get("auth_token")?.value;
    const headerToken = extractTokenFromHeader(request.headers.get("Authorization"));
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json({
        success: true,
        data: { bookmarked: false },
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({
        success: true,
        data: { bookmarked: false },
      });
    }

    const userId = payload.userId;
    const { slug } = await params;

    // Get post by slug
    const post = await queryOneBuilder<{ id: number }>("blog_posts", {
      select: "id",
      filters: { slug, status: "published" },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    const postId = post.id;

    // Check if bookmarked
    const bookmark = await queryOneBuilder<{ post_id: number }>(
      "blog_bookmarks",
      {
        select: "post_id",
        filters: { post_id: postId, user_id: userId },
      }
    );

    return NextResponse.json({
      success: true,
      data: { bookmarked: !!bookmark },
    });
  } catch (error: any) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

