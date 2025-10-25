"use client";

import { useState, useEffect } from "react";
import { X, Plus, Search, MessageCircle, ThumbsUp, CheckCircle2, Clock, Filter, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Question {
  id: string;
  title: string;
  content: string;
  status: "OPEN" | "ANSWERED" | "RESOLVED";
  answersCount: number;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  isLiked: boolean;
}

interface LessonQAModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  onAskQuestion: () => void;
}

export default function LessonQAModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  onAskQuestion,
}: LessonQAModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "OPEN" | "ANSWERED" | "RESOLVED">("ALL");
  const [sortBy, setSortBy] = useState<"RECENT" | "POPULAR">("RECENT");
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (isOpen && lessonId) {
      fetchQuestions();
    }
  }, [isOpen, lessonId, filterStatus, sortBy]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filterStatus,
        sortBy: sortBy,
        search: searchQuery,
      });

      const response = await fetch(`/api/lessons/${lessonId}/questions?${params}`, {
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.data.questions);
      } else {
        toast.error(data.message || "Không thể tải câu hỏi");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/lessons/questions/${questionId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  isLiked: !q.isLiked,
                  likesCount: q.isLiked ? q.likesCount - 1 : q.likesCount + 1,
                }
              : q
          )
        );
      }
    } catch (error) {
      console.error("Error liking question:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã giải quyết</span>
          </span>
        );
      case "ANSWERED":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <MessageCircle className="w-3 h-3" />
            <span>Đã trả lời</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            <span>Chờ trả lời</span>
          </span>
        );
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Panel - Left Side */}
      <div className="fixed left-0 top-0 h-screen w-[480px] bg-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">Hỏi & Đáp</h2>
              <p className="text-indigo-100 text-sm">{lessonTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchQuestions();
                }
              }}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Tất cả</option>
              <option value="OPEN">Chờ trả lời</option>
              <option value="ANSWERED">Đã trả lời</option>
              <option value="RESOLVED">Đã giải quyết</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="RECENT">Mới nhất</option>
              <option value="POPULAR">Phổ biến</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500">Đang tải...</p>
              </div>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Chưa có câu hỏi nào
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Hãy là người đầu tiên đặt câu hỏi cho bài học này
              </p>
              <button
                onClick={onAskQuestion}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium"
              >
                Đặt câu hỏi đầu tiên
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // Navigate to question detail
                    window.location.hash = `question-${question.id}`;
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <img
                      src={question.user.avatarUrl || "/assets/img/default-avatar.png"}
                      alt={question.user.fullName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      {/* Question Title & Status */}
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {question.title}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-2">{getStatusBadge(question.status)}</div>

                      {/* Question Preview */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {question.content.replace(/[#*`]/g, "")}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>{question.user.fullName}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(question.createdAt)}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          {/* Like Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeQuestion(question.id);
                            }}
                            className={`flex items-center space-x-1 text-xs transition-colors ${
                              question.isLiked
                                ? "text-indigo-600"
                                : "text-gray-500 hover:text-indigo-600"
                            }`}
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${
                                question.isLiked ? "fill-current" : ""
                              }`}
                            />
                            <span>{question.likesCount}</span>
                          </button>

                          {/* Answers Count */}
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.answersCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Ask Question Button */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
          <button
            onClick={onAskQuestion}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-3 px-4 font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Đặt câu hỏi mới</span>
          </button>
        </div>
      </div>
    </>
  );
}
