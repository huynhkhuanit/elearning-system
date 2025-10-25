"use client"

import type React from "react"

import { useState } from "react"
import { X, Bold, Italic, List, ListOrdered, Code, LinkIcon, ImageIcon, Eye, ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useToast } from "@/contexts/ToastContext"

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  lessonId: string
  lessonTitle: string
  onQuestionCreated: () => void
}

export default function AskQuestionModal({
  isOpen,
  onClose,
  onBack,
  lessonId,
  lessonTitle,
  onQuestionCreated,
}: AskQuestionModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Đã đăng câu hỏi thành công!")
        setTitle("")
        setContent("")
        onQuestionCreated()
        onClose()
      } else {
        toast.error(data.message || "Không thể đăng câu hỏi")
      }
    } catch (error) {
      console.error("Error creating question:", error)
      toast.error("Đã có lỗi xảy ra")
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("question-content") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**", "**"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*", "*"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`", "`"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("\n- ", ""),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("\n1. ", ""),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => insertMarkdown("[", "](url)"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => insertMarkdown("![alt text](", ")"),
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm" onClick={onClose} />

      {/* Modal - Left Side */}
      <div className="fixed left-0 top-0 bottom-0 z-50 w-full md:w-[45%] bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header - Dark Theme */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Đặt câu hỏi mới</h2>
              <p className="text-sm text-slate-400 mt-1">{lessonTitle}</p>
            </div>
          </div>

          {/* Form - Dark Theme */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title Input */}
              <div>
                <label htmlFor="question-title" className="block text-sm font-medium text-slate-300 mb-2">
                  Tiêu đề câu hỏi <span className="text-red-400">*</span>
                </label>
                <input
                  id="question-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề ngắn gọn và rõ ràng cho câu hỏi của bạn..."
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  maxLength={255}
                />
                <p className="text-xs text-slate-500 mt-1.5">{title.length}/255 ký tự</p>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="question-content" className="block text-sm font-medium text-slate-300">
                    Nội dung chi tiết <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center space-x-1 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isPreview ? "Chỉnh sửa" : "Xem trước"}</span>
                  </button>
                </div>

                {/* Markdown Toolbar */}
                {!isPreview && (
                  <div className="flex items-center space-x-1 p-2 bg-slate-800/50 border border-slate-700 rounded-t-lg">
                    {toolbarButtons.map((button, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={button.action}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title={button.label}
                      >
                        <button.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Editor / Preview */}
                {isPreview ? (
                  <div className="border border-slate-700 rounded-lg p-4 min-h-[300px] bg-slate-800/30">
                    <div className="prose prose-sm prose-invert max-w-none">
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      ) : (
                        <p className="text-slate-500 italic">Chưa có nội dung để xem trước</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <textarea
                    id="question-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Mô tả chi tiết câu hỏi của bạn. Bạn có thể sử dụng Markdown để định dạng văn bản..."
                    className="w-full bg-slate-800/50 border border-slate-700 border-t-0 text-white placeholder-slate-400 rounded-b-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                    rows={12}
                  />
                )}

                {/* Markdown Tips */}
                {!isPreview && (
                  <div className="mt-3 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg text-xs text-slate-400 space-y-1">
                    <p className="font-medium text-slate-300">💡 Hướng dẫn định dạng Markdown:</p>
                    <ul className="space-y-0.5 ml-4">
                      <li>• **Chữ đậm** hoặc *Chữ nghiêng*</li>
                      <li>• `code inline` hoặc ```code block```</li>
                      <li>• [Link](url) hoặc ![Hình ảnh](url)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Dark Theme */}
            <div className="border-t border-slate-700/50 p-6 flex items-center justify-end space-x-3 flex-shrink-0 bg-slate-800/30">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {isSubmitting ? "Đang đăng..." : "Đăng câu hỏi"}
              </button>
            </div>
          </form>
        </div>
    </>
  )
}
