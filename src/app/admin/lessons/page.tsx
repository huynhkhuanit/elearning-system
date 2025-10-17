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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Không tải được danh sách khóa học');

      const data = await response.json();
      // API trả về { success: true, data: { courses: [], pagination: {...} } }
      const coursesList = data.data?.courses || [];
      
      const coursesWithDetails = await Promise.all(
        coursesList.map(async (course: any) => {
          const chaptersResponse = await fetch(
            `/api/courses/${course.slug}/chapters`
          );
          const chaptersData = await chaptersResponse.json();
          // API trả về { success: true, data: { chapters: [], totalLessons } }
          const chaptersList = chaptersData.data?.chapters || [];

          const chaptersWithLessons = await Promise.all(
            chaptersList.map(async (chapter: any) => {
              const lessonsResponse = await fetch(
                `/api/chapters/${chapter.id}/lessons`
              );
              const lessonsData = await lessonsResponse.json();
              // API có thể trả về mảng trực tiếp hoặc object
              const lessons = Array.isArray(lessonsData) ? lessonsData : (lessonsData?.data || []);
              return { 
                id: chapter.id,
                title: chapter.title,
                sort_order: chapter.order,
                lessons 
              };
            })
          );

          return { 
            id: course.id,
            title: course.title,
            slug: course.slug,
            chapters: chaptersWithLessons 
          };
        })
      );

      setCourses(coursesWithDetails);
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
            <h1 className="text-3xl font-bold text-white">Quản lý nội dung khóa học</h1>
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
