"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"
import TipTapEditor from "@/components/TipTapEditor"
import {
  Save,
  Eye,
  Send,
  X,
  Image as ImageIcon,
  ArrowLeft,
  FileText,
  Clock,
  Tag,
  Folder,
} from "lucide-react"
import { motion } from "framer-motion"

interface Category {
  id: number
  name: string
  slug: string
}

export default function WriteBlogPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const toast = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<"" | "saving" | "saved">("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Vui lòng đăng nhập để viết blog")
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router, toast])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/blog/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!title && !content) return

    const timer = setTimeout(() => {
      handleSaveDraft(true) // silent save
    }, 30000)

    return () => clearTimeout(timer)
  }, [title, content, coverImage, selectedCategories, tags])

  const handleSaveDraft = async (silent = false) => {
    if (!title.trim()) {
      if (!silent) toast.error("Vui lòng nhập tiêu đề bài viết")
      return
    }

    if (!silent) setIsSaving(true)
    setAutoSaveStatus("saving")

    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: Send cookies including auth token
        body: JSON.stringify({
          title,
          content,
          coverImage,
          categories: selectedCategories,
          tags,
          status: "draft",
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setAutoSaveStatus("saved")
        setLastSaved(new Date())
        if (!silent) {
          toast.success(data.message || "Đã lưu bản nháp")
          // Redirect to edit page if this is a new post
          const postSlug = data.data?.post?.slug || data.data?.slug
          if (postSlug) {
            router.push(`/write/${postSlug}`)
          }
        }
      } else {
        throw new Error(data.error || "Không thể lưu bài viết")
      }
    } catch (error) {
      console.error("Save draft error:", error)
      setAutoSaveStatus("")
      if (!silent) {
        toast.error(error instanceof Error ? error.message : "Không thể lưu bài viết")
      }
    } finally {
      if (!silent) setIsSaving(false)
      // Clear status after 3 seconds
      setTimeout(() => setAutoSaveStatus(""), 3000)
    }
  }

  const handlePublish = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề bài viết")
      return
    }

    if (!content.trim() || content === "<p></p>") {
      toast.error("Vui lòng viết nội dung bài viết")
      return
    }

    if (selectedCategories.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục")
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important: Send cookies including auth token
        body: JSON.stringify({
          title,
          content,
          coverImage,
          categories: selectedCategories,
          tags,
          status: "published",
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(data.message || "Đã đăng bài viết thành công!")
        const postSlug = data.data?.post?.slug || data.data?.slug
        if (postSlug) {
          router.push(`/articles/${postSlug}`)
        } else {
          // Fallback: redirect to articles list if slug is missing
          console.error("Slug not found in response:", data)
          router.push("/articles")
        }
      } else {
        throw new Error(data.error || "Không thể đăng bài viết")
      }
    } catch (error) {
      console.error("Publish error:", error)
      toast.error(error instanceof Error ? error.message : "Không thể đăng bài viết")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    } else {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh")
      return
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 1MB")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setCoverImage(data.url)
        toast.success("Tải ảnh lên thành công")
      } else {
        throw new Error(data.error || "Tải ảnh thất bại")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Không thể tải ảnh lên")
    } finally {
      setIsUploading(false)
      // Reset input value to allow uploading same file again if needed
      e.target.value = ""
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-[66px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h1 className="text-lg font-semibold text-gray-900">Viết Blog</h1>
              </div>
              {/* Auto-save status */}
              {autoSaveStatus && (
                <div className="flex items-center space-x-2 text-sm">
                  {autoSaveStatus === "saving" ? (
                    <>
                      <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
                      <span className="text-yellow-600">Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">
                        Đã lưu {lastSaved ? `lúc ${lastSaved.toLocaleTimeString()}` : ""}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">{showPreview ? "Chỉnh sửa" : "Xem trước"}</span>
              </button>

              <button
                onClick={() => handleSaveDraft(false)}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Lưu nháp</span>
              </button>

              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Đăng bài</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Area - Left (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            <div className="space-y-4">
              {coverImage ? (
                <div className="relative group">
                  <img
                    src={coverImage}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <label
                    htmlFor="cover-upload"
                    className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors ${
                      isUploading
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="text-sm text-gray-500">Đang tải lên...</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          Click để tải ảnh bìa lên
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF (Tối đa 1MB)
                        </span>
                      </>
                    )}
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề bài viết của bạn..."
                className="w-full text-4xl font-bold placeholder-gray-300 focus:outline-none border-none bg-transparent"
                maxLength={255}
              />
              <p className="text-sm text-gray-400 mt-2">{title.length}/255 ký tự</p>
            </div>

            {/* Content Editor */}
            {showPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-3xl font-bold mb-6">{title || "Tiêu đề bài viết"}</h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content || "<p>Nội dung bài viết...</p>" }}
                />
              </motion.div>
            ) : (
              <TipTapEditor
                content={content}
                onChange={setContent}
                placeholder="Bắt đầu viết nội dung bài viết của bạn..."
              />
            )}
          </div>

          {/* Sidebar - Right (1/3) */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Folder className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Danh mục</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Tags</h3>
                <span className="text-xs text-gray-500">({tags.length}/5)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    <span>#{tag}</span>
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Thêm tag..."
                  disabled={tags.length >= 5}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleAddTag}
                  disabled={tags.length >= 5 || !tagInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Nhấn Enter hoặc click Thêm để thêm tag</p>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 Mẹo viết blog hay</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Tiêu đề nên ngắn gọn, hấp dẫn (50-60 ký tự)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Sử dụng heading để chia nhỏ nội dung</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Thêm hình ảnh minh họa cho sinh động</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Chọn đúng danh mục để tiếp cận độc giả</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Sử dụng code block cho ví dụ lập trình</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
