"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageCircle, 
  CheckCircle2, 
  Send,
  Shield,
  BookOpen,
  Users,
  AlertTriangle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import PageContainer from "@/components/PageContainer";
import "@/app/markdown.css";

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
  participants: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  lesson: {
    id: string;
    title: string;
    type: "theory" | "challenge";
  } | null;
  chapter: {
    id: string;
    title: string;
  } | null;
  course: {
    id: string;
    title: string;
    slug: string;
  } | null;
  answers: Answer[];
}

export default function DiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  
  const questionId = params.questionId as string;
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetail();
    }
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestion(data.data.question);
      } else {
        toast.error(data.message || "Không thể tải câu hỏi");
        router.push("/qa");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Đã có lỗi xảy ra");
      router.push("/qa");
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

  const handleLikeQuestion = async () => {
    if (!question || !isAuthenticated) return;

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
            : null,
        );
      }
    } catch (error) {
      console.error("Error liking question:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleLikeAnswer = async (answerId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`/api/lessons/answers/${answerId}/like`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        setQuestion((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            answers: prev.answers.map((answer) =>
              answer.id === answerId
                ? {
                    ...answer,
                    isLiked: !answer.isLiked,
                    likesCount: answer.isLiked ? answer.likesCount - 1 : answer.likesCount + 1,
                  }
                : answer,
            ),
          };
        });
      }
    } catch (error) {
      console.error("Error liking answer:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!question || !isAuthenticated) return;

    try {
      const response = await fetch(`/api/lessons/answers/${answerId}/accept`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        fetchQuestionDetail();
        toast.success("Đã chọn câu trả lời tốt nhất");
      } else {
        toast.error(data.message || "Không thể chọn câu trả lời");
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Đã được giải quyết
          </span>
        );
      case "ANSWERED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Đã trả lời
          </span>
        );
      case "OPEN":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Chờ trả lời
          </span>
        );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy câu hỏi</h2>
          <button
            onClick={() => router.push("/qa")}
            className="text-blue-600 hover:text-blue-700"
          >
            Quay lại trang Q&A
          </button>
        </div>
      </div>
    );
  }

  const bestAnswer = question.answers.find((a) => a.isAccepted);
  const otherAnswers = question.answers.filter((a) => !a.isAccepted);

  return (
    <div className="min-h-screen bg-white">
      <PageContainer size="full" className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 min-w-0 lg:max-w-3xl">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                {getStatusBadge(question.status)}
                <span className="text-sm text-gray-600">
                  {question.user.fullName} đã đăng {formatTimeAgo(question.createdAt)}
                  {question.lesson && (
                    <>
                      {" "}trong{" "}
                      <span className="font-medium">
                        {question.lesson.type === "challenge" ? "Bài học thử thách" : "Bài học lý thuyết"}
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {question.user.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{question.user.fullName}</h3>
                      <p className="text-sm text-gray-500">{formatTimeAgo(question.createdAt)}</p>
                    </div>
                    <button
                      onClick={handleLikeQuestion}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                        question.isLiked
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${question.isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm font-medium">{question.likesCount}</span>
                    </button>
                  </div>
                  
                  <div className="prose prose-sm prose-gray max-w-none mt-4">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: ({ node, inline, className, children, ...props }: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          ) : (
                            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {question.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolved Banner */}
            {question.status === "RESOLVED" && bestAnswer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium flex-1">
                    Vấn đề đã được giải quyết bởi câu trả lời của {bestAnswer.user.fullName}
                  </span>
                  <span className="text-sm text-green-600">
                    {formatTimeAgo(bestAnswer.createdAt)}
                  </span>
                </div>
              </div>
            )}

            {/* Best Answer */}
            {bestAnswer && (
              <div className="mb-6">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Câu trả lời tốt nhất</span>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {bestAnswer.user.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{bestAnswer.user.fullName}</h4>
                          <p className="text-sm text-gray-500">{formatTimeAgo(bestAnswer.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleLikeAnswer(bestAnswer.id)}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                            bestAnswer.isLiked
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${bestAnswer.isLiked ? "fill-current" : ""}`} />
                          <span className="text-sm font-medium">{bestAnswer.likesCount}</span>
                        </button>
                      </div>
                      
                      <div className="prose prose-sm prose-gray max-w-none mt-4">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: ({ node, inline, className, children, ...props }: any) => {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ) : (
                                <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {bestAnswer.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Answers */}
            {otherAnswers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {otherAnswers.length} {otherAnswers.length === 1 ? "bình luận" : "bình luận"}
                </h3>
                <div className="space-y-4">
                  {otherAnswers.map((answer) => (
                    <div key={answer.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {answer.user.fullName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{answer.user.fullName}</h4>
                              <p className="text-sm text-gray-500">{formatTimeAgo(answer.createdAt)}</p>
                            </div>
                            <button
                              onClick={() => handleLikeAnswer(answer.id)}
                              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                                answer.isLiked
                                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${answer.isLiked ? "fill-current" : ""}`} />
                              <span className="text-sm font-medium">{answer.likesCount}</span>
                            </button>
                          </div>
                          
                          <div className="prose prose-sm prose-gray max-w-none mt-4">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({ node, inline, className, children, ...props }: any) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {answer.content}
                            </ReactMarkdown>
                          </div>
                          
                          {question.user.id === user?.id && !answer.isAccepted && (
                            <button
                              onClick={() => handleAcceptAnswer(answer.id)}
                              className="mt-3 flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Chọn làm giải pháp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Form */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nhập bình luận mới của bạn
              </h3>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Nhập câu trả lời của bạn (hỗ trợ Markdown)..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={6}
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-500">
                    Hỗ trợ định dạng Markdown: **bold**, *italic*, `code`
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || !answerContent.trim()}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi câu trả lời"}</span>
                  </button>
                </div>
              </form>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              {/* Categories */}
              {question.lesson && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Danh mục</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>
                      {question.lesson.type === "challenge" ? "Bài học thử thách" : "Bài học lý thuyết"}
                    </span>
                  </div>
                </div>
              )}

              {/* Lesson */}
              {question.lesson && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Bài học</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <span>{question.lesson.title}</span>
                  </div>
                </div>
              )}

              {/* Participants */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  {question.participants} {question.participants === 1 ? "người tham gia" : "người tham gia"}
                </h4>
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(question.participants, 5) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"
                    />
                  ))}
                </div>
              </div>

              {/* Report Spam */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé
                </p>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}

