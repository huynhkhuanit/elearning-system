"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, PlayCircle, CheckCircle, Lock, Clock, FileText, 
  ChevronDown, ChevronRight, BookOpen, Award, Star, 
  Menu, X, MessageSquare, Code, Download, Share2,
  BarChart, Users, TrendingUp, Flag, Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "reading" | "quiz";
  isCompleted: boolean;
  isFree: boolean;
  order: number;
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
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "qa" | "resources">("overview");
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Chỉ fetch data khi có slug, không kiểm tra auth ở đây
    if (slug) {
      fetchCourseData();
    }
  }, [slug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details, chapters, and progress
      const [courseResponse, chaptersResponse, progressResponse] = await Promise.all([
        fetch(`/api/courses/${slug}`, { credentials: "include" }),
        fetch(`/api/courses/${slug}/chapters`, { credentials: "include" }),
        fetch(`/api/courses/${slug}/progress`, { credentials: "include" })
      ]);

      // Kiểm tra authentication status
      if (progressResponse.status === 401) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/auth/login");
        return;
      }

      // Kiểm tra enrollment status
      if (progressResponse.status === 403) {
        toast.error("Bạn chưa đăng ký khóa học này");
        router.push(`/courses/${slug}`);
        return;
      }

      const courseData = await courseResponse.json();
      const chaptersData = await chaptersResponse.json();
      const progressData = await progressResponse.json();

      if (courseData.success && chaptersData.success && progressData.success) {
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
            order: lesson.order
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
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Không thể tải khóa học");
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

  const goToNextLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.sections.flatMap(s => s.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    } else {
      toast.success("Chúc mừng! Bạn đã hoàn thành khóa học!");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-orange-500 border-r-yellow-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-300 mb-2">Đang tải khóa học...</p>
          <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

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
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Header Bar - Dark */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-lg font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              DHVLearnX
            </span>
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="text-base font-semibold text-gray-200 truncate max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {/* Circular Progress */}
          <div className="flex items-center space-x-3">
            <div className="relative w-14 h-14">
              <svg className="transform -rotate-90 w-14 h-14">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - course.progress / 100)}`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{course.progress}%</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-200">{course.completedLessons}/{course.totalLessons} bài</p>
              <p className="text-xs text-gray-400">Đã hoàn thành</p>
            </div>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-orange-400 hover:bg-gray-700 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area - Left Side */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-900">
          {/* Video Player Area */}
          <div className="bg-black flex items-center justify-center relative" style={{ height: '65vh', maxHeight: '700px' }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-lg transition-colors z-10 backdrop-blur-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <div className="text-center px-8">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-8 shadow-2xl hover:scale-110 transition-transform cursor-pointer group">
                <Play className="w-14 h-14 text-white ml-2 group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">{currentLesson?.title}</h2>
              <div className="flex items-center justify-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{currentLesson?.duration}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  {getLessonIcon(currentLesson?.type || "video")}
                  <span className="text-sm capitalize">{currentLesson?.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <button
              onClick={goToPreviousLesson}
              disabled={!course.sections[0]?.lessons[0] || currentLesson?.id === course.sections[0].lessons[0].id}
              className="px-6 py-2.5 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm flex items-center space-x-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Bài trước</span>
            </button>

            <div className="flex items-center space-x-3">
              {currentLesson?.isCompleted ? (
                <div className="flex items-center space-x-2 text-green-400 font-medium bg-green-500/10 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>Đã hoàn thành</span>
                </div>
              ) : (
                <button
                  onClick={markAsCompleted}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-lg text-sm flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Hoàn thành bài học</span>
                </button>
              )}
            </div>

            <button
              onClick={goToNextLesson}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all font-medium shadow-lg text-sm flex items-center space-x-2"
            >
              <span>Bài tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs Section */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-800">
            {/* Tab Navigation */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 flex space-x-1 flex-shrink-0">
              {[
                { id: "overview", label: "Tổng quan", icon: BookOpen },
                { id: "notes", label: "Ghi chú", icon: FileText },
                { id: "qa", label: "Hỏi đáp", icon: MessageSquare },
                { id: "resources", label: "Tài nguyên", icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 font-medium transition-colors relative text-sm ${
                    activeTab === tab.id
                      ? 'text-orange-400'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
              {activeTab === "overview" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Về bài học này</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Trong bài học này, bạn sẽ học được các kiến thức quan trọng và thực hành 
                      với các ví dụ thực tế. Đây là nền tảng quan trọng giúp bạn nắm vững 
                      các khái niệm cơ bản và áp dụng vào dự án thực tế.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                        <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">{currentLesson?.duration}</p>
                        <p className="text-sm text-gray-400">Thời lượng</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">1,234</p>
                        <p className="text-sm text-gray-400">Học viên</p>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">4.9</p>
                        <p className="text-sm text-gray-400">Đánh giá</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-bold text-white mb-4">Nội dung chính</h3>
                    <ul className="space-y-3">
                      {[
                        "Hiểu rõ các khái niệm cốt lõi",
                        "Thực hành với ví dụ thực tế",
                        "Áp dụng kiến thức vào dự án",
                        "Best practices và tips hữu ích",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6">Ghi chú của bạn</h3>
                    <textarea
                      placeholder="Viết ghi chú của bạn ở đây..."
                      className="w-full h-64 bg-gray-700 text-gray-100 rounded-lg p-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none placeholder-gray-400"
                    ></textarea>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all shadow-sm">
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6">Hỏi đáp</h3>
                    <p className="text-gray-400 text-center py-12">
                      Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
                    </p>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all shadow-sm">
                      Đặt câu hỏi mới
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-6">Tài nguyên bài học</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Slide bài giảng.pdf", size: "2.5 MB", type: "PDF" },
                        { name: "Source code.zip", size: "15.3 MB", type: "ZIP" },
                        { name: "Tài liệu tham khảo.docx", size: "1.2 MB", type: "DOCX" },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors border border-gray-600">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{file.name}</p>
                              <p className="text-sm text-gray-400">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content (Right Side) */}
        <div className={`${sidebarOpen ? 'w-96' : 'w-0'} bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0`}>
          <div className="p-5 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Nội dung khoá học</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
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
              <div key={section.id} className="border-b border-gray-700">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-orange-400">
                      {sectionIndex + 1}
                    </span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white text-sm">{section.title}</h3>
                      <p className="text-xs text-gray-400">{section.lessons.length} bài học • {section.duration}</p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedSections.has(section.id) && (
                  <div className="bg-gray-900/50">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full px-5 py-3 flex items-center space-x-3 hover:bg-gray-700/30 transition-colors ${
                          currentLesson?.id === lesson.id ? 'bg-orange-500/10 border-r-4 border-orange-500' : 'border-r-4 border-transparent'
                        }`}
                      >
                        <span className="flex-shrink-0 text-xs font-medium text-gray-500 w-6">
                          {sectionIndex + 1}.{lessonIndex + 1}
                        </span>
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${
                            currentLesson?.id === lesson.id ? 'text-orange-400' : 'text-gray-300'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <div className="text-gray-500">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
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
      </div>
    </div>
  );
}
