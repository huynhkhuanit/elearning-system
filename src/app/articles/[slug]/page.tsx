"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import PageContainer from "@/components/PageContainer"

interface Author {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
}

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface BlogPost {
  id: number
  user_id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  status: string
  view_count: number
  like_count: number
  comment_count: number
  bookmark_count: number
  published_at: string
  created_at: string
  updated_at: string
  categories: Category[]
  tags: Tag[]
  author: Author
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const toast = useToast()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/blog/posts/${slug}`)
      const result = await res.json()

      if (res.ok && result.success) {
        setPost(result.data)
      } else {
        toast.error(result.error || "Không tìm thấy bài viết")
        router.push("/articles")
      }
    } catch (error) {
      console.error("Fetch post error:", error)
      toast.error("Không thể tải bài viết")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} phút đọc`
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!post) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
          <Link href="/articles" className="text-blue-500 hover:underline">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <article className="max-w-4xl mx-auto py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-blue-500">
            Bài viết
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              {post.author.avatar_url ? (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.full_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {post.author.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <Link
                  href={`/${post.author.username}`}
                  className="font-medium text-gray-900 hover:text-blue-500"
                >
                  {post.author.full_name}
                </Link>
                <div className="flex items-center gap-2 text-xs">
                  <span>{formatDate(post.published_at)}</span>
                  <span>•</span>
                  <span>{formatReadingTime(post.content)}</span>
                  <span>•</span>
                  <span>{post.view_count.toLocaleString()} lượt xem</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/articles?category=${category.id}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>{post.like_count + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span>Lưu</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>{post.comment_count}</span>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            {post.author.avatar_url ? (
              <Image
                src={post.author.avatar_url}
                alt={post.author.full_name}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                {post.author.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {post.author.full_name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">@{post.author.username}</p>
              {post.author.bio && <p className="text-gray-700">{post.author.bio}</p>}
              <Link
                href={`/${post.author.username}`}
                className="text-blue-500 hover:underline text-sm mt-2 inline-block"
              >
                Xem trang cá nhân →
              </Link>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Bình luận ({post.comment_count})
          </h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
            <p>Tính năng bình luận đang được phát triển</p>
          </div>
        </div>
      </article>
    </PageContainer>
  )
}
