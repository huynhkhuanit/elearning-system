"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Play, PlayCircle, CheckCircle, Lock, Clock, FileText, 
  ChevronDown, ChevronRight, BookOpen, Award, Star, 
  Menu, X, MessageSquare, Code, Download, Share2,
  BarChart, Users, TrendingUp, Flag, Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { usePageTitle, useLessonContent } from "@/lib/hooks";
import VideoPlayer from "@/components/VideoPlayer";
import LessonQAButton from "@/components/LessonQAButton";
import LessonQAModal from "@/components/LessonQAModal";
import AskQuestionModal from "@/components/AskQuestionModal";
import QuestionDetailModal from "@/components/QuestionDetailModal";
import "@/app/markdown.css";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  isCompleted: boolean;
  isFree: boolean;
  order: number;
  videoUrl?: string; // Add video URL to lesson interface
  videoDuration?: number; // Add video duration to lesson interface
}

interface Section {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
  order: number;
}

interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  instructor: {
    name: string;
    avatar: string;
  };
  progress: number;
  sections: Section[];
  totalLessons: number;
  completedLessons: number;
  totalDuration: string;
}

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lessonContent, setLessonContent] = useState<string>("");
  const [isFreeCourseDetermined, setIsFreeCourseDetermined] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  
  // Update page title when course changes
  usePageTitle(course ? `${course.title} - DHV LearnX` : "DHV LearnX");
  
  // Load markdown content when current lesson changes
  const markdownContent = useLessonContent(currentLesson?.id || "");

  // Handle hash changes for question navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#question-")) {
        const questionId = hash.replace("#question-", "");
        setSelectedQuestionId(questionId);
        setIsQAModalOpen(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    // ✅ FIX: Wait for auth check to complete before deciding what to do
    if (authLoading) {
      console.log("[LEARN PAGE] Auth is loading, waiting...");
      return;
    }

    // ✅ FIX: Check authentication IMMEDIATELY before making any API calls
    if (!isAuthenticated) {
      console.log("[LEARN PAGE] User not authenticated, redirecting to login");
      toast.error("Vui lòng đăng nhập để tiếp tục học");
      router.push("/auth/login");
      setLoading(false);
      return;
    }

    // Only fetch data when slug exists and user is authenticated
    if (slug) {
      fetchCourseData();
    }
  }, [slug, isAuthenticated, authLoading]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // ✅ FIX: No need to check authentication here anymore
      // Authentication is already checked in useEffect

      // Fetch course details, chapters, and progress
      const [courseResponse, chaptersResponse, progressResponse] = await Promise.all([
        fetch(`/api/courses/${slug}`, { credentials: "include" }),
        fetch(`/api/courses/${slug}/chapters`, { credentials: "include" }),
        fetch(`/api/courses/${slug}/progress`, { credentials: "include" })
      ]);

      // ✅ FIX: Handle authentication error (401)
      if (progressResponse.status === 401) {
        console.log("[LEARN PAGE] User not authenticated (401)");
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        router.push("/auth/login");
        return;
      }

      // ✅ FIX: Handle enrollment error (403) - user is authenticated but not enrolled
      if (progressResponse.status === 403) {
        console.log("[LEARN PAGE] User not enrolled in course (403)");
        toast.error("Bạn chưa đăng ký khóa học này. Vui lòng đăng ký để tiếp tục");
        router.push(`/courses/${slug}`);
        return;
      }

      // Parse responses
      const courseData = await courseResponse.json();
      const chaptersData = await chaptersResponse.json();
      const progressData = await progressResponse.json();

      // ✅ FIX: Validate all responses are successful
      if (!courseData.success || !chaptersData.success || !progressData.success) {
        console.error("[LEARN PAGE] API response not successful:", {
          courseSuccess: courseData.success,
          chaptersSuccess: chaptersData.success,
          progressSuccess: progressData.success
        });
        toast.error("Không thể tải khóa học. Vui lòng thử lại");
        return;
      }

      // Determine if it's a FREE course
      const isFreeFlag = courseData.data.isFree || false;
      setIsFree(isFreeFlag);
      setIsFreeCourseDetermined(true);

      const chapters = chaptersData.data.chapters;
      const completedLessons = progressData.data.completedLessons || [];
      
      // Transform chapters data to match UI structure
      const sections: Section[] = chapters.map((chapter: any) => ({
        id: chapter.id,
        title: chapter.title,
        duration: chapter.duration,
        order: chapter.order,
        lessons: chapter.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          duration: lesson.duration,
          type: lesson.type as "video" | "reading" | "quiz",
          isCompleted: completedLessons.includes(lesson.id),
          isFree: lesson.isPreview || false,
          order: lesson.order,
          videoUrl: lesson.videoUrl,
          videoDuration: lesson.videoDuration,
        }))
      }));

      // Calculate totals
      const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
      const completedCount = sections.reduce((acc, section) => 
        acc + section.lessons.filter(l => l.isCompleted).length, 0
      );

      const courseWithProgress: CourseData = {
        id: courseData.data.id,
        title: courseData.data.title,
        subtitle: courseData.data.subtitle,
        slug: courseData.data.slug,
        instructor: courseData.data.instructor,
        progress: progressData.data.progress || 0,
        sections: sections,
        totalLessons,
        completedLessons: completedCount,
        totalDuration: courseData.data.duration
      };

      setCourse(courseWithProgress);
      
      // Set first uncompleted lesson or first lesson as current
      const firstUncompletedLesson = sections
        .flatMap(s => s.lessons)
        .find(l => !l.isCompleted) || sections[0]?.lessons[0];
      
      if (firstUncompletedLesson) {
        setCurrentLesson(firstUncompletedLesson);
      }
      
      // Expand first section by default
      if (sections.length > 0) {
        setExpandedSections(new Set([sections[0].id]));
      }
    } catch (error) {
      console.error("[LEARN PAGE] Error fetching course:", error);
      toast.error("Đã có lỗi xảy ra khi tải khóa học. Vui lòng thử lại");
      // ✅ FIX: Redirect to home instead of courses page when there's an error
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const markAsCompleted = async () => {
    if (!currentLesson) return;
    
    try {
      const response = await fetch(`/api/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Đã đánh dấu hoàn thành bài học");
        
        // Update local state
        setCourse(prev => {
          if (!prev) return prev;
          
          const updatedSections = prev.sections.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => 
              lesson.id === currentLesson.id 
                ? { ...lesson, isCompleted: true }
                : lesson
            )
          }));

          const completedLessons = updatedSections.reduce((acc, section) => 
            acc + section.lessons.filter(l => l.isCompleted).length, 0
          );

          return {
            ...prev,
            sections: updatedSections,
            completedLessons,
            progress: Math.round((completedLessons / prev.totalLessons) * 100)
          };
        });

        // Auto advance to next lesson
        goToNextLesson();
      } else {
        toast.error(data.message || "Không thể đánh dấu hoàn thành");
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const goToNextLesson = async () => {
    if (!course || !currentLesson) return;

    try {
      // Mark current lesson as completed
      const response = await fetch(`/api/lessons/${currentLesson.id}/complete`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setCourse(prev => {
          if (!prev) return prev;
          
          const updatedSections = prev.sections.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => 
              lesson.id === currentLesson.id 
                ? { ...lesson, isCompleted: true }
                : lesson
            )
          }));

          const completedLessons = updatedSections.reduce((acc, section) => 
            acc + section.lessons.filter(l => l.isCompleted).length, 0
          );

          return {
            ...prev,
            sections: updatedSections,
            completedLessons,
            progress: Math.round((completedLessons / prev.totalLessons) * 100)
          };
        });
      }

      // Navigate to next lesson
      const allLessons = course.sections.flatMap(s => s.lessons);
      const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
      
      if (currentIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentIndex + 1]);
      } else {
        toast.success("Chúc mừng! Bạn đã hoàn thành khóa học!");
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      toast.error("Đã có lỗi xảy ra");
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-600 border-r-indigo-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">Đang tải khóa học...</p>
          <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  // Sử dụng dark theme cho PRO courses, light theme cho FREE courses
  const isDarkTheme = !isFree;
  const bgClass = isDarkTheme ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-white";
  const headerBgClass = isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const headerTextClass = isDarkTheme ? "text-gray-200" : "text-gray-900";
  const sidebarBgClass = isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const buttonBgClass = isDarkTheme 
    ? "text-orange-500 bg-transparent border-[2px] border-orange-500" 
    : "text-indigo-600 bg-transparent border-[2px] border-indigo-600";
  const buttonHoverClass = isDarkTheme
    ? "hover:border-orange-500"
    : "hover:border-indigo-600 hover:bg-indigo-50";
  const contentBgClass = isDarkTheme ? "bg-gray-800" : "bg-white";
  const textColorClass = isDarkTheme ? "text-gray-300" : "text-gray-700";

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <Flag className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`h-screen ${bgClass} flex flex-col overflow-hidden`}>
      {/* Top Header Bar */}
      <div className={`${headerBgClass} border-b px-6 py-1.5 flex items-center justify-between flex-shrink-0`}>
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center space-x-2 ${isDarkTheme ? 'text-gray-300 hover:opacity-80' : 'text-gray-600 hover:opacity-80'} transition-opacity flex-shrink-0`}
          >
            <img 
              src="/assets/img/logo.png" 
              alt="DHVLearnX Logo" 
              className="h-8 w-8 rounded"
            />
          </button>
          <div className={`h-5 w-px ${isDarkTheme ? 'bg-gray-600' : 'bg-gray-300'} flex-shrink-0`}></div>
          <div className={`font-[900] ${headerTextClass} truncate`} style={{ fontSize: '16px' }}>
            {course?.title}
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Circular Progress */}
          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <svg className="transform -rotate-90 w-10 h-10">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={isDarkTheme ? "text-gray-700" : "text-gray-300"}
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke={isDarkTheme ? "url(#gradient)" : "url(#gradientFree)"}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - (course?.progress || 0) / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                  <linearGradient id="gradientFree" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-600">{course?.progress}%</span>
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <p className={`text-xs font-semibold ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{course?.completedLessons}/{course?.totalLessons}</p>
              <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>hoàn thành</p>
            </div>
          </div>
          
          <button className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${isDarkTheme ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-700' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}>
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden justify-center items-center">
          {/* Video and Lesson Content */}
          <div className={`w-full flex-1 overflow-y-auto ${isDarkTheme ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'} flex flex-col`}>
            {/* Video Player Area */}
            <div className={isDarkTheme ? "bg-black" : "bg-gray-100"}>
              <div className="max-w-6xl mx-auto px-4 py-4">
                {currentLesson?.videoUrl ? (
                  <VideoPlayer
                    videoUrl={currentLesson.videoUrl}
                    lessonId={currentLesson.id}
                    duration={currentLesson.videoDuration}
                    title={currentLesson.title}
                    onComplete={() => {
                      toast.success("Bài học đã hoàn thành! Tiếp tục với bài học tiếp theo");
                      goToNextLesson();
                    }}
                    onProgress={(data) => {
                      console.log(`Progress: ${data.currentTime}s / ${data.duration}s`);
                    }}
                    autoSave={true}
                  />
                ) : (
                  // Show message for non-video lessons (reading materials, quizzes)
                  <div className={`w-full aspect-video ${isDarkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-gray-200 to-gray-100 border-gray-300'} rounded-lg flex items-center justify-center border`}>
                    <div className="text-center">
                      {currentLesson?.type === 'reading' ? (
                        <>
                          <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`} />
                          <p className={`text-lg font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Bài học dạng đọc</p>
                          <p className={`text-sm mt-2 ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>Xem nội dung bên dưới</p>
                        </>
                      ) : currentLesson?.type === 'quiz' ? (
                        <>
                          <Flag className={`w-16 h-16 mx-auto mb-4 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`} />
                          <p className={`text-lg font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Bài kiểm tra</p>
                          <p className={`text-sm mt-2 ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>Xem câu hỏi bên dưới</p>
                        </>
                      ) : (
                        <>
                          <PlayCircle className={`w-16 h-16 mx-auto mb-4 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`} />
                          <p className={`text-lg font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>Đang cập nhật video</p>
                          <p className={`text-sm mt-2 ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>Video sẽ được thêm sớm</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Content Section */}
            <div className={contentBgClass}>
              <div className="max-w-4xl mx-auto p-6">
                {/* Markdown Content */}
                <div className={`prose ${isDarkTheme ? 'prose-invert' : 'prose'} max-w-none text-sm`}>
                  {markdownContent ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {markdownContent}
                    </ReactMarkdown>
                  ) : (
                    <div className={`rounded-lg p-6 border ${isDarkTheme ? 'bg-gray-700/30 border-gray-600 text-gray-300' : 'bg-indigo-50 border-indigo-200 text-gray-600'}`}>
                      <p className={isDarkTheme ? "text-gray-400 italic" : "text-gray-600 italic"}>
                        Chọn một bài học để xem nội dung chi tiết.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className={`w-full ${isDarkTheme ? 'bg-gray-800/70 border-gray-700' : 'bg-white/70 border-gray-200'} backdrop-blur-sm border-t px-6 py-4 flex items-center justify-between flex-shrink-0`}>
            <div className="flex-1"></div>

            <div className="flex items-center gap-6">
              <button
                onClick={goToPreviousLesson}
                disabled={!course || !currentLesson || course.sections.flatMap(s => s.lessons)[0]?.id === currentLesson.id}
                className={`px-6 py-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'} bg-transparent border-[2px] ${isDarkTheme ? 'border-gray-600 hover:border-orange-500' : 'border-gray-400 hover:border-indigo-600'} rounded-md transition-all font-medium text-sm flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Bài trước</span>
              </button>

              <button
                onClick={goToNextLesson}
                className={`px-6 py-2 rounded-md transition-all font-medium text-sm flex items-center space-x-2 ${isDarkTheme 
                  ? 'text-orange-500 bg-transparent border-[2px] border-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-500 hover:text-white hover:border-0' 
                  : 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 border-[2px] border-transparent hover:from-indigo-700 hover:to-indigo-800'
                }`}
              >
                <span>Bài tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="text-right">
                <p className={`text-sm font-medium truncate max-w-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-900'}`}>{currentLesson?.title}</p>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg transition-colors z-10 backdrop-blur-sm ${isDarkTheme ? 'bg-gray-700/50 hover:bg-gray-600/70 text-gray-300' : 'bg-indigo-100/50 hover:bg-indigo-200/70 text-indigo-600'}`}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content Modal */}
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-30 ${
              sidebarOpen
                ? 'bg-black/50 animate-in fade-in duration-200 pointer-events-auto'
                : 'bg-black/0 animate-out fade-out duration-200 pointer-events-none'
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Modal Panel */}
          <div className={`fixed right-0 top-0 h-screen w-96 ${sidebarBgClass} border-l flex flex-col overflow-hidden z-40 transition-all duration-300 ease-in-out ${
            sidebarOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : 'translate-x-full opacity-0 pointer-events-none'
          }`}>
              <div className={`p-5 border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-bold ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>Nội dung khoá học</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`transition-colors ${isDarkTheme ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className={`flex items-center space-x-4 text-sm ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.totalLessons} bài học</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.totalDuration}</span>
                  </div>
                </div>
              </div>

              {/* Sections & Lessons */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {course.sections.map((section, sectionIndex) => (
                  <div key={section.id} className={`border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${isDarkTheme ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full ${isDarkTheme ? 'bg-gray-700 text-orange-400' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center text-sm font-bold`}>
                          {sectionIndex + 1}
                        </span>
                        <div className="text-left">
                          <h3 className={`font-semibold text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'}`}>{section.title}</h3>
                          <p className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-500'}`}>{section.lessons.length} bài học • {section.duration}</p>
                        </div>
                      </div>
                      {expandedSections.has(section.id) ? (
                        <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                      ) : (
                        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>

                    {expandedSections.has(section.id) && (
                      <div className={isDarkTheme ? "bg-gray-900/50" : "bg-gray-50"}>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              handleLessonClick(lesson);
                              setSidebarOpen(false);
                            }}
                            className={`w-full px-5 py-3 flex items-center space-x-3 transition-colors border-r-4 ${
                              currentLesson?.id === lesson.id 
                                ? isDarkTheme 
                                  ? 'bg-orange-500/10 border-orange-500' 
                                  : 'bg-indigo-50 border-indigo-600'
                                : `${isDarkTheme ? 'hover:bg-gray-700/30 border-transparent' : 'hover:bg-gray-100 border-transparent'}`
                            }`}
                          >
                            <span className={`flex-shrink-0 text-xs font-medium w-6 ${isDarkTheme ? 'text-gray-500' : 'text-gray-600'}`}>
                              {sectionIndex + 1}.{lessonIndex + 1}
                            </span>
                            <div className="flex-shrink-0">
                              {lesson.isCompleted ? (
                                <CheckCircle className={`w-5 h-5 ${isDarkTheme ? 'text-green-400' : 'text-emerald-500'}`} />
                              ) : (
                                <div className={`w-5 h-5 rounded-full border-2 ${isDarkTheme ? 'border-gray-600' : 'border-gray-400'}`}></div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`text-sm font-medium ${
                                currentLesson?.id === lesson.id 
                                  ? isDarkTheme 
                                    ? 'text-orange-400' 
                                    : 'text-indigo-600'
                                  : isDarkTheme ? 'text-gray-400' : 'text-gray-700'
                              }`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <div className={isDarkTheme ? 'text-gray-600' : 'text-gray-500'}>
                                  {getLessonIcon(lesson.type)}
                                </div>
                                <span className={`text-xs ${isDarkTheme ? 'text-gray-600' : 'text-gray-600'}`}>{lesson.duration}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </>
      </div>

      {/* Q&A Button - Fixed on bottom left */}
      {currentLesson && (
        <LessonQAButton onClick={() => setIsQAModalOpen(true)} />
      )}

      {/* Q&A Modal */}
      {currentLesson && (
        <LessonQAModal
          isOpen={isQAModalOpen}
          onClose={() => setIsQAModalOpen(false)}
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.title}
          onAskQuestion={() => {
            setIsQAModalOpen(false);
            setIsAskQuestionModalOpen(true);
          }}
          onQuestionClick={(questionId) => {
            setSelectedQuestionId(questionId);
            setIsQAModalOpen(false);
          }}
        />
      )}

      {/* Ask Question Modal */}
      {currentLesson && (
        <AskQuestionModal
          isOpen={isAskQuestionModalOpen}
          onClose={() => setIsAskQuestionModalOpen(false)}
          onBack={() => {
            setIsAskQuestionModalOpen(false);
            setIsQAModalOpen(true);
          }}
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.title}
          onQuestionCreated={() => {
            setIsAskQuestionModalOpen(false);
            setIsQAModalOpen(true);
          }}
        />
      )}

      {/* Question Detail Modal */}
      {selectedQuestionId && (
        <QuestionDetailModal
          isOpen={!!selectedQuestionId}
          onClose={() => {
            setSelectedQuestionId(null);
            window.location.hash = "";
          }}
          onBack={() => {
            setSelectedQuestionId(null);
            window.location.hash = "";
            setIsQAModalOpen(true);
          }}
          questionId={selectedQuestionId}
          onUpdate={() => {
            // Refresh questions list if modal is open
            if (isQAModalOpen) {
              // This will trigger a re-fetch in LessonQAModal
              setIsQAModalOpen(false);
              setTimeout(() => setIsQAModalOpen(true), 100);
            }
          }}
        />
      )}
    </div>
  );
}
