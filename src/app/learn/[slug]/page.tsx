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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Đang tải khóa học...</p>
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
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-lg font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              DHVLearnX
            </span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-base font-semibold text-gray-800 truncate max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Info */}
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <span className="font-semibold text-orange-500">{course.progress}%</span>
          </div>
          
          <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Course Content */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0`}>
          <div className="p-5 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Nội dung khoá học</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
          <div className="flex-1 overflow-y-auto">
            {course.sections.map((section, sectionIndex) => (
              <div key={section.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                      {sectionIndex + 1}
                    </span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
                      <p className="text-xs text-gray-500">{section.lessons.length} bài học • {section.duration}</p>
                    </div>
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedSections.has(section.id) && (
                  <div className="bg-gray-50">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full px-5 py-3 flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                          currentLesson?.id === lesson.id ? 'bg-orange-50 border-l-4 border-orange-500' : 'border-l-4 border-transparent'
                        }`}
                      >
                        <span className="flex-shrink-0 text-xs font-medium text-gray-500 w-6">
                          {sectionIndex + 1}.{lessonIndex + 1}
                        </span>
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${
                            currentLesson?.id === lesson.id ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            {getLessonIcon(lesson.type)}
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Video Player Area */}
          <div className="bg-black flex items-center justify-center relative" style={{ height: '60vh', maxHeight: '600px' }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors z-10"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-12 h-12 text-white ml-1" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentLesson?.title}</h2>
              <p className="text-gray-400 text-sm">Thời lượng: {currentLesson?.duration}</p>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <button
              onClick={goToPreviousLesson}
              disabled={!course.sections[0]?.lessons[0] || currentLesson?.id === course.sections[0].lessons[0].id}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              ← Bài trước
            </button>

            <div className="flex items-center space-x-3">
              {currentLesson?.isCompleted ? (
                <div className="flex items-center space-x-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  <span>Đã hoàn thành</span>
                </div>
              ) : (
                <button
                  onClick={markAsCompleted}
                  className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium shadow-sm text-sm"
                >
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Đánh dấu hoàn thành
                </button>
              )}
            </div>

            <button
              onClick={goToNextLesson}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all font-medium shadow-sm text-sm"
            >
              Bài tiếp theo →
            </button>
          </div>

          {/* Tabs Section */}
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 flex space-x-1 flex-shrink-0">
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
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
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
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {activeTab === "overview" && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Về bài học này</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Trong bài học này, bạn sẽ học được các kiến thức quan trọng và thực hành 
                      với các ví dụ thực tế. Đây là nền tảng quan trọng giúp bạn nắm vững 
                      các khái niệm cơ bản và áp dụng vào dự án thực tế.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                        <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">{currentLesson?.duration}</p>
                        <p className="text-sm text-gray-600">Thời lượng</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                        <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">1,234</p>
                        <p className="text-sm text-gray-600">Học viên</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">4.9</p>
                        <p className="text-sm text-gray-600">Đánh giá</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Nội dung chính</h3>
                    <ul className="space-y-3">
                      {[
                        "Hiểu rõ các khái niệm cốt lõi",
                        "Thực hành với ví dụ thực tế",
                        "Áp dụng kiến thức vào dự án",
                        "Best practices và tips hữu ích",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Ghi chú của bạn</h3>
                    <textarea
                      placeholder="Viết ghi chú của bạn ở đây..."
                      className="w-full h-64 bg-gray-50 text-gray-900 rounded-lg p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    ></textarea>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all shadow-sm">
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Hỏi đáp</h3>
                    <p className="text-gray-500 text-center py-12">
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
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Tài nguyên bài học</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Slide bài giảng.pdf", size: "2.5 MB", type: "PDF" },
                        { name: "Source code.zip", size: "15.3 MB", type: "ZIP" },
                        { name: "Tài liệu tham khảo.docx", size: "1.2 MB", type: "DOCX" },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium">{file.name}</p>
                              <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
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
      </div>
    </div>
  );
}
