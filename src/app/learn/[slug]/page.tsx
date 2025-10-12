"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, PlayCircle, CheckCircle, Lock, Clock, FileText, 
  ChevronDown, ChevronRight, BookOpen, Award, Star, 
  Menu, X, MessageSquare, Code, Download, Share2,
  BarChart, Users, TrendingUp, Flag
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
      
      // Fetch course details and user progress
      const [courseResponse, progressResponse] = await Promise.all([
        fetch(`/api/courses/${slug}`, { credentials: "include" }),
        fetch(`/api/users/me/courses`, { credentials: "include" })
      ]);

      // Kiểm tra authentication status từ API response
      if (progressResponse.status === 401 || !progressResponse.ok) {
        toast.error("Vui lòng đăng nhập để tiếp tục");
        router.push("/auth/login");
        return;
      }

      const courseData = await courseResponse.json();
      const progressData = await progressResponse.json();

      if (courseData.success) {
        // Check if user is enrolled
        const isEnrolled = progressData.success && 
          progressData.data.courses.some((c: any) => c.slug === slug);

        if (!isEnrolled) {
          toast.error("Bạn chưa đăng ký khóa học này");
          router.push(`/courses/${slug}`);
          return;
        }

        // Mock course structure with sections and lessons
        const mockSections: Section[] = [
          {
            id: "1",
            title: "Giới thiệu khóa học",
            duration: "45 phút",
            order: 1,
            lessons: [
              { id: "1-1", title: "Chào mừng bạn đến với khóa học", duration: "5:30", type: "video", isCompleted: true, isFree: true, order: 1 },
              { id: "1-2", title: "Cài đặt môi trường làm việc", duration: "12:45", type: "video", isCompleted: true, isFree: false, order: 2 },
              { id: "1-3", title: "Tài liệu khóa học", duration: "10:00", type: "reading", isCompleted: false, isFree: false, order: 3 },
            ]
          },
          {
            id: "2",
            title: "Kiến thức nền tảng",
            duration: "2 giờ 30 phút",
            order: 2,
            lessons: [
              { id: "2-1", title: "Các khái niệm cơ bản", duration: "18:20", type: "video", isCompleted: false, isFree: false, order: 1 },
              { id: "2-2", title: "Cú pháp và quy tắc", duration: "25:10", type: "video", isCompleted: false, isFree: false, order: 2 },
              { id: "2-3", title: "Bài tập thực hành", duration: "30:00", type: "quiz", isCompleted: false, isFree: false, order: 3 },
              { id: "2-4", title: "Best Practices", duration: "15:30", type: "video", isCompleted: false, isFree: false, order: 4 },
            ]
          },
          {
            id: "3",
            title: "Dự án thực tế 1",
            duration: "3 giờ 15 phút",
            order: 3,
            lessons: [
              { id: "3-1", title: "Phân tích yêu cầu dự án", duration: "20:00", type: "video", isCompleted: false, isFree: false, order: 1 },
              { id: "3-2", title: "Thiết kế giao diện", duration: "35:45", type: "video", isCompleted: false, isFree: false, order: 2 },
              { id: "3-3", title: "Xây dựng tính năng chính", duration: "45:30", type: "video", isCompleted: false, isFree: false, order: 3 },
              { id: "3-4", title: "Tối ưu và hoàn thiện", duration: "28:15", type: "video", isCompleted: false, isFree: false, order: 4 },
              { id: "3-5", title: "Deploy lên production", duration: "22:30", type: "video", isCompleted: false, isFree: false, order: 5 },
            ]
          },
          {
            id: "4",
            title: "Kiến thức nâng cao",
            duration: "2 giờ 45 phút",
            order: 4,
            lessons: [
              { id: "4-1", title: "Performance Optimization", duration: "32:20", type: "video", isCompleted: false, isFree: false, order: 1 },
              { id: "4-2", title: "Security Best Practices", duration: "28:40", type: "video", isCompleted: false, isFree: false, order: 2 },
              { id: "4-3", title: "Testing & Debugging", duration: "35:15", type: "video", isCompleted: false, isFree: false, order: 3 },
              { id: "4-4", title: "Quiz tổng hợp", duration: "45:00", type: "quiz", isCompleted: false, isFree: false, order: 4 },
            ]
          },
        ];

        const totalLessons = mockSections.reduce((acc, section) => acc + section.lessons.length, 0);
        const completedLessons = mockSections.reduce((acc, section) => 
          acc + section.lessons.filter(l => l.isCompleted).length, 0
        );

        const courseWithProgress: CourseData = {
          id: courseData.data.id,
          title: courseData.data.title,
          subtitle: courseData.data.subtitle,
          slug: courseData.data.slug,
          instructor: courseData.data.instructor,
          progress: Math.round((completedLessons / totalLessons) * 100),
          sections: mockSections,
          totalLessons,
          completedLessons,
          totalDuration: courseData.data.duration
        };

        setCourse(courseWithProgress);
        
        // Set first uncompleted lesson or first lesson as current
        const firstUncompletedLesson = mockSections
          .flatMap(s => s.lessons)
          .find(l => !l.isCompleted) || mockSections[0].lessons[0];
        
        setCurrentLesson(firstUncompletedLesson);
        
        // Expand first section by default
        setExpandedSections(new Set([mockSections[0].id]));
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
    
    // TODO: Call API to mark lesson as completed
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
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              DHVLearnX
            </span>
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
          <h1 className="text-white font-bold text-lg truncate">{course.title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-gray-700 rounded-full px-4 py-2">
            <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold text-gray-300">{course.progress}%</span>
          </div>
          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Course Content */}
        <div className={`${sidebarOpen ? 'w-full lg:w-96' : 'hidden'} bg-gray-800 border-r border-gray-700 overflow-y-auto absolute lg:relative h-full z-40 lg:z-0`}>
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-black text-white mb-4">Nội dung khóa học</h2>
            
            {/* Progress Stats */}
            <div className="bg-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-300">Tiến độ học tập</span>
                <span className="text-sm font-bold text-orange-400">{course.completedLessons}/{course.totalLessons} bài</span>
              </div>
              <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
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
          <div className="p-4 space-y-2">
            {course.sections.map((section) => (
              <div key={section.id} className="bg-gray-700/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="w-5 h-5 text-orange-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm">{section.title}</h3>
                      <p className="text-xs text-gray-400">{section.lessons.length} bài • {section.duration}</p>
                    </div>
                  </div>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="pb-2">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-700 transition-colors ${
                          currentLesson?.id === lesson.id ? 'bg-gray-700 border-l-4 border-orange-400' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : lesson.isFree ? (
                            <div className="text-gray-400">{getLessonIcon(lesson.type)}</div>
                          ) : (
                            <div className="text-gray-400">{getLessonIcon(lesson.type)}</div>
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium ${
                            currentLesson?.id === lesson.id ? 'text-orange-400' : 'text-gray-300'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">{lesson.duration}</p>
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
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Player Area */}
          <div className="bg-black flex items-center justify-center" style={{ height: '60vh' }}>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                <Play className="w-16 h-16 text-white ml-2" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentLesson?.title}</h2>
              <p className="text-gray-400 mb-6">Thời lượng: {currentLesson?.duration}</p>
              
              {currentLesson?.type === "video" && (
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg">
                  Bắt đầu học
                </button>
              )}
              
              {currentLesson?.type === "reading" && (
                <div className="text-gray-300">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                  <p>Tài liệu đọc</p>
                </div>
              )}
              
              {currentLesson?.type === "quiz" && (
                <div className="text-gray-300">
                  <Flag className="w-12 h-12 mx-auto mb-3 text-green-400" />
                  <p>Bài kiểm tra</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
            <button
              onClick={goToPreviousLesson}
              disabled={!course.sections[0]?.lessons[0] || currentLesson?.id === course.sections[0].lessons[0].id}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              ← Bài trước
            </button>

            {!currentLesson?.isCompleted && (
              <button
                onClick={markAsCompleted}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-semibold shadow-lg"
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Hoàn thành
              </button>
            )}

            <button
              onClick={goToNextLesson}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all font-semibold shadow-lg"
            >
              Bài tiếp theo →
            </button>
          </div>

          {/* Tabs Section */}
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-900">
            {/* Tab Navigation */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 flex space-x-1">
              {[
                { id: "overview", label: "Tổng quan", icon: BookOpen },
                { id: "notes", label: "Ghi chú", icon: FileText },
                { id: "qa", label: "Hỏi đáp", icon: MessageSquare },
                { id: "resources", label: "Tài nguyên", icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-orange-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "overview" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-2xl p-8 mb-6">
                    <h3 className="text-2xl font-black text-white mb-4">Về bài học này</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Trong bài học này, bạn sẽ học được các kiến thức quan trọng và thực hành 
                      với các ví dụ thực tế. Đây là nền tảng quan trọng giúp bạn nắm vững 
                      các khái niệm cơ bản và áp dụng vào dự án thực tế.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-xl p-4 text-center">
                        <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">{currentLesson?.duration}</p>
                        <p className="text-sm text-gray-400">Thời lượng</p>
                      </div>
                      <div className="bg-gray-700 rounded-xl p-4 text-center">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">1,234</p>
                        <p className="text-sm text-gray-400">Học viên</p>
                      </div>
                      <div className="bg-gray-700 rounded-xl p-4 text-center">
                        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white mb-1">4.9</p>
                        <p className="text-sm text-gray-400">Đánh giá</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-2xl p-8">
                    <h3 className="text-xl font-black text-white mb-4">Nội dung chính</h3>
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
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-black text-white mb-6">Ghi chú của bạn</h3>
                    <textarea
                      placeholder="Viết ghi chú của bạn ở đây..."
                      className="w-full h-64 bg-gray-700 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                    ></textarea>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all">
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "qa" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-black text-white mb-6">Hỏi đáp</h3>
                    <p className="text-gray-400 text-center py-12">
                      Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
                    </p>
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all">
                      Đặt câu hỏi mới
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-black text-white mb-6">Tài nguyên bài học</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Slide bài giảng.pdf", size: "2.5 MB", type: "PDF" },
                        { name: "Source code.zip", size: "15.3 MB", type: "ZIP" },
                        { name: "Tài liệu tham khảo.docx", size: "1.2 MB", type: "DOCX" },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-semibold">{file.name}</p>
                              <p className="text-sm text-gray-400">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors">
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
