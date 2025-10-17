'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit,
  Loader,
  AlertCircle,
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

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Layout sẽ hiển thị access denied screen
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-700 mb-6 font-medium">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Quản Lý Nội Dung</h2>
            <p className="text-slate-600 mt-1">Chỉnh sửa markdown content cho từng bài học</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-lg border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Không có khóa học nào</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              {/* Course Header */}
              <button
                onClick={() => toggleCourse(course.id)}
                className="w-full px-6 py-4 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition flex items-center justify-between text-left border-b border-slate-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  {expandedCourses.has(course.id) ? (
                    <ChevronDown className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{course.slug}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                  {course.chapters?.length || 0} chương
                </div>
              </button>

              {/* Chapters */}
              {expandedCourses.has(course.id) && (
                <div className="divide-y divide-slate-200">
                  {course.chapters?.map((chapter) => (
                    <div key={chapter.id}>
                      {/* Chapter Header */}
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full px-6 py-3 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                          <h4 className="font-medium text-slate-900">
                            {chapter.title}
                          </h4>
                        </div>
                        <span className="text-xs text-slate-600 bg-slate-200 px-2 py-1 rounded">
                          {chapter.lessons?.length || 0} bài
                        </span>
                      </button>

                      {/* Lessons */}
                      {expandedChapters.has(chapter.id) && (
                        <div className="bg-white divide-y divide-slate-100">
                          {chapter.lessons?.map((lesson) => (
                            <Link
                              key={lesson.id}
                              href={`/admin/lessons/${lesson.id}/edit`}
                              className="px-6 py-3 flex items-center justify-between hover:bg-indigo-50 transition group"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                                    hasContent(lesson)
                                      ? 'bg-green-500'
                                      : 'bg-slate-300'
                                  }`}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm text-slate-900 group-hover:text-indigo-600 transition font-medium truncate">
                                    {lesson.title}
                                  </p>
                                  {hasContent(lesson) && (
                                    <p className="text-xs text-green-600 mt-1">
                                      ✓ Có nội dung
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Edit className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition flex-shrink-0 ml-4" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
