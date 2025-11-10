"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Eye, MessageCircle, Heart, Clock, User } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

interface SavedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  bookmark_count: number;
  published_at: string;
  created_at: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  tags: Array<{ id: number; name: string; slug: string }>;
  author: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    bio: string | null;
  };
}

export default function SavedPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchSavedPosts();
  }, [isAuthenticated]);

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/users/saved?limit=${pagination.limit}&offset=0`, {
        credentials: "include",
      });
      const result = await res.json();

      if (result.success) {
        setPosts(result.data.posts || []);
        setPagination(result.data.pagination || pagination);
      } else {
        toast.error(result.message || "Không thể tải bài viết đã lưu");
      }
    } catch (error) {
      console.error("Fetch saved posts error:", error);
      toast.error("Không thể tải bài viết đã lưu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!pagination.hasMore || isLoading) return;

    try {
      const res = await fetch(
        `/api/users/saved?limit=${pagination.limit}&offset=${pagination.offset + pagination.limit}`,
        { credentials: "include" }
      );
      const result = await res.json();

      if (result.success) {
        setPosts((prev) => [...prev, ...(result.data.posts || [])]);
        setPagination(result.data.pagination || pagination);
      }
    } catch (error) {
      console.error("Load more error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageContainer size="lg" className="py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Bookmark className="w-8 h-8 text-indigo-600 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bài viết đã lưu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Xem lại những bài viết bạn đã lưu để đọc sau
          </p>
        </div>

        {/* Loading State */}
        {isLoading && posts.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <Bookmark className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có bài viết nào được lưu
            </h2>
            <p className="text-gray-600 mb-8">
              Bắt đầu lưu các bài viết yêu thích để xem lại sau
            </p>
            <Link
              href="/articles"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Khám phá bài viết
            </Link>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full flex flex-col cursor-pointer group"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bookmark className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}
                    {/* Bookmark Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Bookmark className="w-4 h-4 text-indigo-600 fill-current" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Categories */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                          <span
                            key={category.id}
                            className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {post.author.avatar_url ? (
                        <Image
                          src={post.author.avatar_url}
                          alt={post.author.full_name || post.author.username}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.author.full_name || post.author.username}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Heart className="w-4 h-4" />
                        <span>{post.like_count.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comment_count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? "Đang tải..." : "Tải thêm"}
                </button>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </div>
  );
}

