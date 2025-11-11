"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  Infinity, 
  Bug, 
  CheckCircle2, 
  List, 
  BookOpen, 
  BookOpenText,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
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
  updatedAt: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string | null;
  };
  lesson: {
    id: string;
    title: string;
    type: "theory" | "challenge";
  } | null;
}

interface MostHelpfulUser {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  contributions: number;
  isVerified: boolean;
}

const categories = [
  { id: "all", label: "Tất cả", icon: Infinity, color: "text-blue-600" },
  { id: "off-topic", label: "Chủ đề ngoài khóa học", icon: Bug, color: "text-red-600" },
  { id: "flashcards", label: "Ứng dụng Flashcards", icon: CheckCircle2, color: "text-blue-600" },
  { id: "other", label: "Các loại bài tập khác", icon: List, color: "text-orange-600" },
  { id: "challenge", label: "Bài học thử thách", icon: BookOpen, color: "text-blue-600" },
  { id: "theory", label: "Bài học lý thuyết", icon: BookOpenText, color: "text-orange-600" },
];

// Mock data for Most Helpful users (will be replaced with API call later)
const mockMostHelpfulUsers: MostHelpfulUser[] = [
  { id: "1", username: "vuquocdung", fullName: "Vũ Quốc Dũng", avatarUrl: null, contributions: 16, isVerified: true },
  { id: "2", username: "vuthingochuyen", fullName: "Vũ Thị Ngọc Huyền", avatarUrl: null, contributions: 7, isVerified: true },
  { id: "3", username: "sondang", fullName: "Sơn Đặng", avatarUrl: null, contributions: 6, isVerified: true },
  { id: "4", username: "ngocdai", fullName: "Ngọc Đại Nguyễn", avatarUrl: null, contributions: 1, isVerified: true },
  { id: "5", username: "hoangan", fullName: "Hoàng An", avatarUrl: null, contributions: 1, isVerified: false },
];

export default function QAPage() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseSlug, setCourseSlug] = useState<string | null>(null);

  // Get course slug from URL params if available
  useEffect(() => {
    const slug = searchParams.get("course");
    setCourseSlug(slug);
  }, [searchParams]);

  // Fetch questions
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchQuestions();
  }, [selectedCategory, searchQuery, courseSlug, isAuthenticated]);

  const fetchQuestions = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      // Use general questions endpoint or course-specific endpoint
      const url = courseSlug 
        ? `/api/courses/${courseSlug}/questions?category=${selectedCategory}&search=${encodeURIComponent(searchQuery)}&status=all`
        : `/api/questions?category=${selectedCategory}&search=${encodeURIComponent(searchQuery)}&status=all${courseSlug ? `&courseSlug=${courseSlug}` : ''}`;

      const response = await fetch(url, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions || []);
      } else {
        toast.error(data.message || "Không thể tải câu hỏi");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Đã có lỗi xảy ra khi tải câu hỏi");
      setQuestions([]);
    } finally {
      setLoading(false);
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

  const getQuestionIcon = (lessonType: string | null) => {
    if (lessonType === "challenge") {
      return <BookOpen className="w-5 h-5 text-blue-600" />;
    }
    return <BookOpenText className="w-5 h-5 text-orange-600" />;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "Đã giải quyết";
      case "ANSWERED":
        return "Đã trả lời";
      case "OPEN":
      default:
        return "Chờ trả lời";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "text-green-600";
      case "ANSWERED":
        return "text-blue-600";
      case "OPEN":
      default:
        return "text-gray-600";
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.label || "Tất cả";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để xem câu hỏi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageContainer size="full" className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-[900] text-gray-900 mb-2">
                Hỏi và đáp
              </h1>
              <p className="text-sm text-gray-600">
                Kênh hỏi đáp riêng tư dành riêng cho học viên Pro.
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Danh mục</h2>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : category.color}`} />
                      <span className="flex-1 text-left">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Most Helpful */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Hữu ích nhất</h2>
                <span className="text-xs text-gray-500">30 ngày qua</span>
              </div>
              <div className="space-y-3">
                {mockMostHelpfulUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {user.fullName}
                        </span>
                        {user.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {user.contributions} đóng góp
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 lg:max-w-3xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Câu hỏi</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Đang tải...</div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không có câu hỏi nào
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Thử thay đổi từ khóa tìm kiếm"
                    : "Chưa có câu hỏi nào trong danh mục này"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
                    onClick={() => {
                      router.push(`/discussions/${question.id}`);
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getQuestionIcon(question.lesson?.type || null)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {question.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="font-medium">{question.user.fullName}</span>
                          <span>đăng</span>
                          <span>{formatTimeAgo(question.createdAt)}</span>
                          {question.lesson && (
                            <>
                              <span>trong</span>
                              <span className="font-medium">
                                {getCategoryLabel(question.lesson.type === "challenge" ? "challenge" : "theory")}
                              </span>
                            </>
                          )}
                          <span className="ml-2">.</span>
                          <span className={getStatusColor(question.status)}>
                            {getStatusText(question.status)}
                          </span>
                        </div>
                      </div>

                      {/* Answer Count */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {question.answersCount > 0 ? (
                          <>
                            <div className="flex -space-x-2">
                              {Array.from({ length: Math.min(question.answersCount, 2) }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {question.answersCount}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">0</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}
