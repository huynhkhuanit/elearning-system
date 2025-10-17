'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  AlertCircle,
  Loader,
  Lightbulb,
} from 'lucide-react';
import { useAdminAccess } from '@/lib/hooks/useAdminAccess';
import Link from 'next/link';

interface Stats {
  totalCourses: number;
  totalChapters: number;
  totalLessons: number;
  lessonsWithContent: number;
  publishedLessons: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'lesson' | 'course' | 'chapter';
  action: string;
  title: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading, hasAccess } = useAdminAccess();
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalChapters: 0,
    totalLessons: 0,
    lessonsWithContent: 0,
    publishedLessons: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && hasAccess) {
      fetchStats();
    }
  }, [authLoading, hasAccess]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/courses-full');
      if (!response.ok) throw new Error('Không tải được dữ liệu');

      const data = await response.json();
      const courses = data.data?.courses || [];

      let totalChapters = 0;
      let totalLessons = 0;
      let lessonsWithContent = 0;
      let publishedLessons = 0;

      courses.forEach((course: any) => {
        course.chapters?.forEach((chapter: any) => {
          totalChapters++;
          chapter.lessons?.forEach((lesson: any) => {
            totalLessons++;
            if (lesson.content && lesson.content.trim().length > 0) lessonsWithContent++;
            if (lesson.is_published) publishedLessons++;
          });
        });
      });

      setStats({
        totalCourses: courses.length,
        totalChapters,
        totalLessons,
        lessonsWithContent,
        publishedLessons,
        completionRate: totalLessons > 0 ? Math.round((lessonsWithContent / totalLessons) * 100) : 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard Quản Trị</h1>
        <p className="text-slate-400">Xin chào, {user?.full_name}!</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-300 font-medium">Lỗi khi tải dữ liệu</p>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Courses */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Khóa Học</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-100">{loading ? '-' : stats.totalCourses}</p>
            <p className="text-sm text-slate-400">Tổng số khóa học</p>
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Chương</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-100">{loading ? '-' : stats.totalChapters}</p>
            <p className="text-sm text-slate-400">Tổng số chương</p>
          </div>
        </div>

        {/* Lessons */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-500/20 rounded-lg group-hover:bg-pink-500/30 transition">
              <Zap className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bài Học</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-100">{loading ? '-' : stats.totalLessons}</p>
            <p className="text-sm text-slate-400">Tổng số bài học</p>
          </div>
        </div>

        {/* Content Progress */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Nội Dung</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-100">
              {loading ? '-' : `${stats.lessonsWithContent}/${stats.totalLessons}`}
            </p>
            <p className="text-sm text-slate-400">Bài học có nội dung</p>
          </div>
        </div>

        {/* Published */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Xuất Bản</span>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold text-slate-100">{loading ? '-' : stats.publishedLessons}</p>
            <p className="text-sm text-slate-400">Bài học đã xuất bản</p>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Hoàn Thành</span>
          </div>
          <div className="space-y-3">
            <p className="text-4xl font-bold text-slate-100">{loading ? '-' : `${stats.completionRate}%`}</p>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">Tỷ lệ nội dung hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/lessons"
          className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-indigo-500/50 transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-100">Quản Lý Bài Học</h3>
            <BookOpen className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition" />
          </div>
          <p className="text-sm text-slate-400">Chỉnh sửa nội dung markdown cho bài học</p>
        </Link>

        <button
          onClick={() => alert('Tính năng sắp ra mắt')}
          className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 group opacity-50 cursor-not-allowed"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-100">Người Dùng & Tiến Độ</h3>
            <Users className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">Xem thống kê người dùng và tiến độ học tập</p>
        </button>
      </div>

      {/* Info Box */}
      <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-lg flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-1">Mẹo</h3>
            <p className="text-sm text-indigo-200">
              Hãy đảm bảo tất cả các bài học đều có nội dung markdown chi tiết để cung cấp trải nghiệm học tập tốt nhất cho sinh viên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
