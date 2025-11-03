"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import PageContainer from "@/components/PageContainer"
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  Eye,
  Clock,
  ChevronLeft,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Check,
} from "lucide-react"
import type { BlogPost } from "@/types/BlogPost"
import { fetchPost as fetchPostApi } from "@/api/posts"
import { formatDate, formatReadingTime } from "@/utils/date"

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
  const [readingProgress, setReadingProgress] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchPostApi(slug)
      .then((data) => {
        if (data) {
          setPost(data)
        } else {
          toast.error("Không tìm thấy bài viết")
          router.push("/articles")
        }
      })
      .finally(() => setIsLoading(false))
  }, [slug, toast, router])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const trackLength = documentHeight - windowHeight
      const progress = (scrollTop / trackLength) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ""

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (platform === "copy") {
      navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Đã sao chép liên kết")
      setTimeout(() => setCopied(false), 2000)
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400")
    }

    setShowShareMenu(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <PageContainer size="lg" className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <PageContainer>
          <div className="max-w-4xl mx-auto py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài viết</h1>
            <Link href="/articles" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Quay lại danh sách bài viết
            </Link>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <PageContainer size="lg" className="py-8">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại danh sách bài viết</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isLiked ? "bg-red-50 text-red-600" : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">{post.like_count + (isLiked ? 1 : 0)}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isBookmarked ? "bg-yellow-50 text-yellow-600" : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`} />
                <span className="text-xs font-medium">Lưu</span>
              </motion.button>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition-all w-full"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="text-xs font-medium">Chia sẻ</span>
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-xl p-2 flex flex-col gap-1 min-w-[160px] z-10"
                    >
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                      >
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <span>Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                      >
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleShare("copy")}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition text-sm"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Link2 className="w-4 h-4 text-gray-600" />
                        )}
                        <span>{copied ? "Đã sao chép" : "Sao chép link"}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </aside>

          <article className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/articles?category=${category.id}`}
                      className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                {post.excerpt}
              </p>

              {/* Author & Meta Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Link href={`/${post.author.username}`} className="flex-shrink-0">
                    {post.author.avatar_url ? (
                      <Image
                        src={post.author.avatar_url}
                        alt={post.author.full_name}
                        width={56}
                        height={56}
                        className="rounded-full ring-2 ring-indigo-100 hover:ring-4 hover:ring-indigo-200 transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl ring-2 ring-indigo-100 hover:ring-4 hover:ring-indigo-200 transition-all">
                        {post.author.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={`/${post.author.username}`}
                      className="font-bold text-gray-900 hover:text-indigo-600 transition block text-lg"
                    >
                      {post.author.full_name}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="font-medium">{formatDate(post.published_at)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{formatReadingTime(post.content)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{post.view_count.toLocaleString()} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Image - Hero Position */}
              {post.cover_image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="mb-16 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </motion.div>
              )}

              {/* Mobile Action Bar */}
              <div className="flex lg:hidden items-center gap-3 mb-12 pb-6 border-b border-gray-200">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                    isLiked ? "bg-red-50 text-red-600" : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span>{post.like_count + (isLiked ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-medium ${
                    isBookmarked ? "bg-yellow-50 text-yellow-600" : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  <span>Lưu</span>
                </button>

                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 hover:bg-gray-50 shadow-sm transition-all font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Chia sẻ</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl ml-auto">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comment_count}</span>
                </div>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-xl prose-indigo max-w-none mb-16
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8
                  prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5
                  prose-p:text-gray-700 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
                  prose-a:text-indigo-600 prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-indigo-700
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-em:text-gray-800 prose-em:italic
                  prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:my-8
                  prose-img:rounded-2xl prose-img:shadow-2xl prose-img:my-10
                  prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-700 prose-li:leading-relaxed prose-li:my-2
                  prose-hr:my-12 prose-hr:border-gray-200
                  prose-table:my-8 prose-table:border-collapse
                  prose-th:bg-gray-100 prose-th:font-bold prose-th:text-left prose-th:p-3
                  prose-td:p-3 prose-td:border prose-td:border-gray-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-16 pb-10 border-b border-gray-200">
                  <h3 className="text-base font-bold text-gray-900 mb-5">Thẻ liên quan</h3>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/articles?tag=${tag.slug}`}
                        className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-10 mb-16 border border-indigo-100 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Link href={`/${post.author.username}`} className="flex-shrink-0">
                    {post.author.avatar_url ? (
                      <Image
                        src={post.author.avatar_url}
                        alt={post.author.full_name}
                        width={96}
                        height={96}
                        className="rounded-2xl ring-4 ring-white shadow-xl hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl ring-4 ring-white shadow-xl hover:scale-105 transition-transform">
                        {post.author.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.author.full_name}</h3>
                      <p className="text-indigo-600 text-base font-semibold">@{post.author.username}</p>
                    </div>
                    {post.author.bio && (
                      <p className="text-gray-700 leading-relaxed mb-5 text-base">{post.author.bio}</p>
                    )}
                    <Link
                      href={`/${post.author.username}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-sm rounded-xl shadow-md hover:shadow-xl transition-all group"
                    >
                      <span>Xem trang cá nhân</span>
                      <ChevronLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Comments Section */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Bình luận 
                  <span className="text-gray-400 ml-3">({post.comment_count})</span>
                </h2>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                  <div className="max-w-md mx-auto">
                    <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <p className="text-gray-600 text-xl font-medium mb-2">Tính năng bình luận đang được phát triển</p>
                    <p className="text-gray-500 text-base">Sẽ sớm ra mắt trong thời gian tới để bạn có thể trao đổi và thảo luận</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </article>

          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Bài viết liên quan</h3>
                <p className="text-sm text-gray-500">Đang cập nhật...</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-gray-900 mb-2">Thích bài viết này?</h3>
                <p className="text-sm text-gray-600 mb-4">Đừng quên like và lưu lại để đọc sau nhé!</p>
                <button
                  onClick={() => setIsLiked(true)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <Heart className="w-5 h-5 inline mr-2" />
                  Thích bài viết
                </button>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  )
}
