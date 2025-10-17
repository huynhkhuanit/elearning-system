'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Save, ArrowLeft, Loader, Check, AlertCircle, Lock } from 'lucide-react';
import { useAdminAccess } from '@/lib/hooks/useAdminAccess';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface LessonData {
  id: string;
  title: string;
  content: string;
  chapter_id: string;
  updated_at: string;
}

export default function LessonContentEditor() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.lessonId as string;
  const { user, loading: authLoading, hasAccess } = useAdminAccess();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Fetch lesson data
  useEffect(() => {
    if (!authLoading && hasAccess) {
      fetchLesson();
    }
  }, [lessonId, authLoading, hasAccess]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Không tìm thấy bài học');

      const data: LessonData = await response.json();
      setLesson(data);
      setContent(data.content || '');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Lỗi khi tải bài học');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = useCallback(async () => {
    if (!lessonId || !content.trim()) {
      setStatus('error');
      setMessage('Nội dung không được để trống');
      return;
    }

    try {
      setSaving(true);
      setStatus('idle');

      const response = await fetch(`/api/lessons/${lessonId}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lưu nội dung');
      }

      const result = await response.json();
      setStatus('success');
      setMessage(result.message || 'Lưu nội dung thành công');
      
      // Update lesson data
      if (result.data) {
        setLesson(result.data);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Lỗi khi lưu nội dung');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [lessonId, content]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const hasContent = (lesson: LessonData) => lesson.content && lesson.content.trim().length > 0;

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
          <p className="text-gray-300">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">Không tìm thấy bài học</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900" data-color-mode="dark">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
              <p className="text-gray-400 text-sm mt-1">
                Chỉnh sửa nội dung markdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Message */}
            {status !== 'idle' && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  status === 'success'
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-red-900/30 text-red-300'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white rounded-lg transition disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Đang lưu...' : 'Lưu (Ctrl+S)'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="rounded-lg border border-gray-800 overflow-hidden shadow-xl">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={true}
            height={600}
            className="bg-gray-800"
            textareaProps={{
              disabled: saving,
            }}
          />
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-300 text-sm">
          <p className="font-semibold mb-2">💡 Mẹo sử dụng:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Sử dụng <code className="bg-black/30 px-2 py-1 rounded">#</code> cho tiêu đề (h1, h2, h3...)</li>
            <li>Sử dụng <code className="bg-black/30 px-2 py-1 rounded">```</code> cho code blocks</li>
            <li>Sử dụng <code className="bg-black/30 px-2 py-1 rounded">**text**</code> cho bold, <code className="bg-black/30 px-2 py-1 rounded">*text*</code> cho italic</li>
            <li>Nhấn <code className="bg-black/30 px-2 py-1 rounded">Ctrl+S</code> hoặc click nút "Lưu" để lưu thay đổi</li>
          </ul>
        </div>

        {/* Last Updated Info */}
        <div className="mt-4 text-gray-400 text-sm">
          Cập nhật lần cuối:{' '}
          {new Date(lesson.updated_at).toLocaleString('vi-VN')}
        </div>
      </div>
    </div>
  );
}
