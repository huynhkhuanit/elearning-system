"use client";

import { Eye, MessageCircle, BookOpen, Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Badge from "@/components/Badge";
import PageContainer from "@/components/PageContainer";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  username: string;
  full_name: string;
  avatar_url: string | null;
  published_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  bookmark_count: number;
  category_names: string | null;
  tag_names: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ArticlesPage() {
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 12,
    offset: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blog/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: "0",
      });

      if (selectedCategory) {
        params.append("categoryId", selectedCategory.toString());
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/blog/posts?${params}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setArticles(result.data);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      }
    } catch (error) {
      console.error("Fetch articles error:", error);
      toast.error("Khong the tai danh sach bai viet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: (pagination.offset + pagination.limit).toString(),
      });

      if (selectedCategory) {
        params.append("categoryId", selectedCategory.toString());
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/blog/posts?${params}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        setArticles((prev) => [...prev, ...result.data]);
        if (result.pagination) {
          setPagination(result.pagination);
        }
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

  const getCategories = (categoryNames: string | null) => {
    if (!categoryNames) return [];
    return categoryNames.split(", ").filter((c) => c).slice(0, 2);
  };

  const getTags = (tagNames: string | null) => {
    if (!tagNames) return [];
    return tagNames.split(", ").filter((t) => t).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <PageContainer size="lg" className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bai viet{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              lap trinh
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Chia se kien thuc va kinh nghiem lap trinh tu cong dong developer
          </p>

          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tim kiem bai viet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === null ? "bg-indigo-500 text-white" : "bg-white text-gray-600 border"}`}
              >
                Tat ca
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat.id ? "bg-indigo-500 text-white" : "bg-white text-gray-600 border"}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/articles/${article.slug}`}>
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden h-full flex flex-col group cursor-pointer">
                    <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                      {article.cover_image ? (
                        <Image
                          src={article.cover_image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      {article.category_names && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getCategories(article.category_names).map((cat, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition">
                        {article.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b">
                        <div className="flex items-center gap-2">
                          {article.avatar_url ? (
                            <Image
                              src={article.avatar_url}
                              alt={article.full_name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                              {article.full_name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">{article.full_name}</span>
                        </div>
                        <span>{formatDate(article.published_at)}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.view_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{article.like_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{article.comment_count}</span>
                        </div>
                      </div>

                      {article.tag_names && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {getTags(article.tag_names).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {!isLoading && articles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chua co bai viet</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory ? "Khong tim thay bai viet phu hop." : "Hay la nguoi dau tien chia se kien thuc!"}
            </p>
            <Link
              href="/write"
              className="inline-block px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600"
            >
              Viet bai viet dau tien
            </Link>
          </div>
        )}

        {!isLoading && articles.length > 0 && pagination.hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 border-2 border-indigo-500 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50"
            >
              Xem them bai viet
            </button>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
