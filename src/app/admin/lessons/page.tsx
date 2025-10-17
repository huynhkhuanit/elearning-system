'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit,
  Loader,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useAdminAccess } from '@/lib/hooks/useAdminAccess';

interface Chapter {
  id: string;
  title: string;
  sort_order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  sort_order: number;
  is_published: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  chapters: Chapter[];
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const { user, loading: authLoading, hasAccess } = useAdminAccess();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && hasAccess) {
      fetchCourses();
    }
  }, [authLoading, hasAccess]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Use optimized endpoint that fetches all data at once
      const response = await fetch('/api/admin/courses-full');
      if (!response.ok) throw new Error('Không tải được danh sách khóa học');

      const data = await response.json();
      setCourses(data.data?.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourse = (courseId: string) => {
    const newSet = new Set(expandedCourses);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setExpandedCourses(newSet);
  };

  const toggleChapter = (chapterId: string) => {
    const newSet = new Set(expandedChapters);
    if (newSet.has(chapterId)) {
      newSet.delete(chapterId);
    } else {
      newSet.add(chapterId);
    }
    setExpandedChapters(newSet);
  };

  const hasContent = (lesson: Lesson) => lesson.content && lesson.content.trim().length > 0;

  // Chờ auth check xong
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">Bạn không có quyền truy cập trang này</p>
          <p className="text-gray-400 text-sm mb-6">Chỉ admin hoặc teacher mới có thể chỉnh sửa nội dung</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-800/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold text-white">Quản lý nội dung khóa học</h1>
              {user && (
                <p className="text-gray-400 text-sm mt-1">
                  Xin chào, {user.full_name} ({user.role})
                </p>
              )}
            </div>
          </div>
          <p className="text-gray-400 mt-2">
            Chỉnh sửa markdown content cho từng bài học
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Không có khóa học nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-800 rounded-lg overflow-hidden"
              >
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full px-6 py-4 bg-gray-800/50 hover:bg-gray-800 transition flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    {expandedCourses.has(course.id) ? (
                      <ChevronDown className="w-5 h-5 text-orange-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-400">{course.slug}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {course.chapters?.length || 0} chương
                  </div>
                </button>

                {/* Chapters */}
                {expandedCourses.has(course.id) && (
                  <div className="border-t border-gray-800 divide-y divide-gray-800">
                    {course.chapters?.map((chapter) => (
                      <div key={chapter.id}>
                        {/* Chapter Header */}
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full px-6 py-3 bg-gray-900 hover:bg-gray-800/50 transition flex items-center justify-between text-left ml-4"
                        >
                          <div className="flex items-center gap-3">
                            {expandedChapters.has(chapter.id) ? (
                              <ChevronDown className="w-4 h-4 text-blue-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500" />
                            )}
                            <div>
                              <h3 className="text-base font-medium text-gray-200">
                                {chapter.title}
                              </h3>
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            {chapter.lessons?.length || 0} bài
                          </div>
                        </button>

                        {/* Lessons */}
                        {expandedChapters.has(chapter.id) && (
                          <div className="bg-gray-900/50 divide-y divide-gray-800">
                            {chapter.lessons?.map((lesson) => (
                              <Link
                                key={lesson.id}
                                href={`/admin/lessons/${lesson.id}/edit`}
                                className="px-6 py-3 ml-8 flex items-center justify-between hover:bg-gray-800/50 transition group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <span
                                    className={`inline-block w-2 h-2 rounded-full ${
                                      hasContent(lesson)
                                        ? 'bg-green-500'
                                        : 'bg-gray-600'
                                    }`}
                                  />
                                  <div>
                                    <p className="text-sm text-gray-300 group-hover:text-white transition">
                                      {lesson.title}
                                    </p>
                                    {hasContent(lesson) && (
                                      <p className="text-xs text-green-400 mt-0.5">
                                        ✓ Có nội dung
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <Edit className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
