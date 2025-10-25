"use client";

import { useState, useEffect } from "react";
import { X, ThumbsUp, MessageCircle, CheckCircle2, Clock, Send, Edit2, Trash2, MoreVertical } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
}

interface QuestionDetail {
  id: string;
  title: string;
  content: string;
  status: "OPEN" | "ANSWERED" | "RESOLVED";
  answersCount: number;
  likesCount: number;
  viewsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  answers: Answer[];
}

interface QuestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  onUpdate: () => void;
}

export default function QuestionDetailModal({
  isOpen,
  onClose,
  questionId,
  onUpdate,
}: QuestionDetailModalProps) {
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && questionId) {
      fetchQuestionDetail();
    }
  }, [isOpen, questionId]);

  const fetchQuestionDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/lessons/questions/${questionId}`, {
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestion(data.data.question);
      } else {
        toast.error(data.message || "Không thể tải câu hỏi");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeQuestion = async () => {
    if (!question) return;

    try {
      const response = await fetch(`/api/lessons/questions/${questionId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestion((prev) =>
          prev
            ? {
                ...prev,
                isLiked: !prev.isLiked,
                likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error liking question:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleLikeAnswer = async (answerId: string) => {
    if (!question) return;

    try {
      const response = await fetch(`/api/lessons/answers/${answerId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestion((prev) =>
          prev
            ? {
                ...prev,
                answers: prev.answers.map((answer) =>
                  answer.id === answerId
                    ? {
                        ...answer,
                        isLiked: !answer.isLiked,
                        likesCount: answer.isLiked
                          ? answer.likesCount - 1
                          : answer.likesCount + 1,
                      }
                    : answer
                ),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error liking answer:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!question || question.user.id !== user?.id) return;

    try {
      const response = await fetch(`/api/lessons/answers/${answerId}/accept`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Đã đánh dấu câu trả lời là giải pháp");
        fetchQuestionDetail();
        onUpdate();
      } else {
        toast.error(data.message || "Không thể đánh dấu câu trả lời");
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      toast.error("Vui lòng nhập nội dung câu trả lời");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/lessons/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: answerContent.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Đã đăng câu trả lời thành công!");
        setAnswerContent("");
        fetchQuestionDetail();
        onUpdate();
      } else {
        toast.error(data.message || "Không thể đăng câu trả lời");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã giải quyết</span>
          </span>
        );
      case "ANSWERED":
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            <span>Đã trả lời</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Chờ trả lời</span>
          </span>
        );
    }
  };

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6 flex items-start justify-between flex-shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              {question && getStatusBadge(question.status)}
              <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-2">
                {question?.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{question?.viewsCount} lượt xem</span>
                <span>•</span>
                <span>{formatTimeAgo(question?.createdAt || "")}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                  <p className="text-sm text-gray-500">Đang tải...</p>
                </div>
              </div>
            ) : question ? (
              <div className="p-6 space-y-6">
                {/* Question */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={question.user.avatarUrl || "/assets/img/default-avatar.png"}
                      alt={question.user.fullName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {question.user.fullName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{question.user.username}
                          </p>
                        </div>
                        <button
                          onClick={handleLikeQuestion}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all ${
                            question.isLiked
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${
                              question.isLiked ? "fill-current" : ""
                            }`}
                          />
                          <span className="text-sm font-medium">
                            {question.likesCount}
                          </span>
                        </button>
                      </div>
                      <div className="prose prose-sm max-w-none mt-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {question.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Answers Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {question.answersCount} Câu trả lời
                  </h3>

                  <div className="space-y-4">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`rounded-lg p-6 ${
                          answer.isAccepted
                            ? "bg-green-50 border-2 border-green-500"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={answer.user.avatarUrl || "/assets/img/default-avatar.png"}
                            alt={answer.user.fullName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900">
                                  {answer.user.fullName}
                                </h4>
                                {answer.isAccepted && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Giải pháp</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(answer.createdAt)}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none mb-3">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {answer.content}
                              </ReactMarkdown>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleLikeAnswer(answer.id)}
                                className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                  answer.isLiked
                                    ? "text-indigo-600"
                                    : "text-gray-500 hover:text-indigo-600"
                                }`}
                              >
                                <ThumbsUp
                                  className={`w-4 h-4 ${
                                    answer.isLiked ? "fill-current" : ""
                                  }`}
                                />
                                <span className="text-sm">{answer.likesCount}</span>
                              </button>
                              {question.user.id === user?.id && !answer.isAccepted && (
                                <button
                                  onClick={() => handleAcceptAnswer(answer.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Chọn làm giải pháp</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Câu trả lời của bạn
                  </h3>
                  <form onSubmit={handleSubmitAnswer}>
                    <textarea
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn (hỗ trợ Markdown)..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none font-mono text-sm"
                      rows={6}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">
                        Hỗ trợ định dạng Markdown: **bold**, *italic*, `code`
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting || !answerContent.trim()}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
