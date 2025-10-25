"use client";

import { useState } from "react";
import { X, Bold, Italic, List, ListOrdered, Code, Link as LinkIcon, Image as ImageIcon, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/contexts/ToastContext";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  onQuestionCreated: () => void;
}

export default function AskQuestionModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  onQuestionCreated,
}: AskQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung câu hỏi");
      return;
    }

    setIsSubmitting(true);
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
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Đã đăng câu hỏi thành công!");
        setTitle("");
        setContent("");
        onQuestionCreated();
        onClose();
      } else {
        toast.error(data.message || "Không thể đăng câu hỏi");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("question-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

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
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Đặt câu hỏi mới</h2>
              <p className="text-sm text-gray-500 mt-1">{lessonTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Title Input */}
              <div>
                <label htmlFor="question-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề câu hỏi <span className="text-red-500">*</span>
                </label>
                <input
                  id="question-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề ngắn gọn và rõ ràng cho câu hỏi của bạn..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">{title.length}/255 ký tự</p>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="question-content" className="block text-sm font-medium text-gray-700">
                    Nội dung chi tiết <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isPreview ? "Chỉnh sửa" : "Xem trước"}</span>
                  </button>
                </div>

                {/* Markdown Toolbar */}
                {!isPreview && (
                  <div className="flex items-center space-x-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
                    {toolbarButtons.map((button, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={button.action}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                        title={button.label}
                      >
                        <button.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Editor / Preview */}
                {isPreview ? (
                  <div className="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50">
                    <div className="prose prose-sm max-w-none">
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-gray-400 italic">Chưa có nội dung để xem trước</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <textarea
                    id="question-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Mô tả chi tiết câu hỏi của bạn. Bạn có thể sử dụng Markdown để định dạng văn bản..."
                    className="w-full border border-gray-300 border-t-0 rounded-b-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                    rows={12}
                  />
                )}

                {/* Markdown Tips */}
                {!isPreview && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p className="font-medium">💡 Hướng dẫn định dạng:</p>
                    <ul className="space-y-0.5 ml-4">
                      <li>• **Chữ đậm** hoặc *Chữ nghiêng*</li>
                      <li>• `code inline` hoặc ```code block```</li>
                      <li>• [Link](url) hoặc ![Hình ảnh](url)</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 flex items-center justify-end space-x-3 flex-shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang đăng..." : "Đăng câu hỏi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
