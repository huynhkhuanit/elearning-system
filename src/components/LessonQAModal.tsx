"use client"

import { useState, useEffect } from "react"
import { X, Search, MessageCircle, ThumbsUp, CheckCircle2, ArrowLeft, HelpCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/contexts/ToastContext"

interface Question {
  id: string
  title: string
  content: string
  status: "OPEN" | "ANSWERED" | "RESOLVED"
  answersCount: number
  likesCount: number
  viewsCount: number
  createdAt: string
  user: {
    id: string
    username: string
    fullName: string
    avatarUrl?: string
  }
  isLiked: boolean
}

interface LessonQAModalProps {
  isOpen: boolean
  onClose: () => void
  lessonId: string
  lessonTitle: string
  onAskQuestion: () => void
  onQuestionClick: (questionId: string) => void
}

export default function LessonQAModal({ isOpen, onClose, lessonId, lessonTitle, onAskQuestion, onQuestionClick }: LessonQAModalProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OPEN" | "ANSWERED" | "RESOLVED">("ALL")
  const [sortBy, setSortBy] = useState<"RECENT" | "POPULAR">("RECENT")
  const { user } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (isOpen && lessonId) {
      fetchQuestions()
    }
  }, [isOpen, lessonId, filterStatus, sortBy])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: filterStatus,
        sortBy: sortBy,
        search: searchQuery,
      })

      const response = await fetch(`/api/lessons/${lessonId}/questions?${params}`, {
        credentials: "include",
      })

      const data = await response.json()
      if (data.success) {
        setQuestions(data.data.questions)
      } else {
        toast.error(data.message || "Không thể tải câu hỏi")
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast.error("Đã có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handleLikeQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/lessons/questions/${questionId}/like`, {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  isLiked: !q.isLiked,
                  likesCount: q.isLiked ? q.likesCount - 1 : q.likesCount + 1,
                }
              : q,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking question:", error)
      toast.error("Đã có lỗi xảy ra")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium border border-emerald-500/30">
            Đã giải quyết
          </span>
        )
      case "ANSWERED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30">
            Bài học lý thuyết
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium border border-amber-500/30">
            Chờ trả lời
          </span>
        )
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    return date.toLocaleDateString("vi-VN")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm" onClick={onClose} />

      {/* Modal Panel - Left Side Full Screen Dark Theme */}
      <div className="fixed left-0 top-0 bottom-0 z-50 w-full md:w-[640px] bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden">
          {/* Header - Dark Theme */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Hỏi đáp</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar - Dark Theme */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchQuestions()
                  }
                }}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Section Header */}
          <div className="bg-slate-800/30 px-6 py-3 border-b border-slate-700/50">
            <h3 className="text-slate-300 font-medium text-sm">{lessonTitle}</h3>
          </div>

          {/* Filters & Sort - Dark Theme */}
          <div className="bg-slate-800/20 border-b border-slate-700/50 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Các câu hỏi thường gặp ({questions.length})</span>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="text-xs bg-slate-700 border border-slate-600 text-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Tất cả</option>
                <option value="OPEN">Chờ trả lời</option>
                <option value="ANSWERED">Đã trả lời</option>
                <option value="RESOLVED">Đã giải quyết</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-700 border border-slate-600 text-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="RECENT">Mới nhất</option>
                <option value="POPULAR">Phổ biến</option>
              </select>
            </div>
          </div>

          {/* Questions List - Dark Theme */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-3"></div>
                  <p className="text-sm text-slate-400">Đang tải...</p>
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <MessageCircle className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Chưa có câu hỏi nào</h3>
                <p className="text-sm text-slate-400 mb-4">Hãy là người đầu tiên đặt câu hỏi cho bài học này</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="px-6 py-4 hover:bg-slate-800/30 transition-colors cursor-pointer group"
                    onClick={() => onQuestionClick(question.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Question Icon */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          question.status === "RESOLVED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : question.status === "ANSWERED"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {question.status === "RESOLVED" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <HelpCircle className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Question Title */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                            {question.title}
                          </h3>
                          {getStatusBadge(question.status)}
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{question.likesCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{question.answersCount}</span>
                          </div>
                          <span>•</span>
                          <span>{formatTimeAgo(question.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Ask Question Button - Dark Theme */}
          <div className="border-t border-slate-700/50 p-4 flex-shrink-0 bg-slate-800/30">
            <div className="text-center mb-3">
              <p className="text-sm text-slate-400">Không tìm thấy câu hỏi bạn cần?</p>
            </div>
            <button
              onClick={onAskQuestion}
              className="w-full bg-slate-100 hover:bg-white text-slate-900 rounded-lg py-3 px-4 font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl uppercase text-sm tracking-wide"
            >
              <span>Đặt câu hỏi mới</span>
            </button>
          </div>
        </div>
    </>
  )
}
