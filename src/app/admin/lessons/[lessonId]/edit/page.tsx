'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Save, ArrowLeft, Loader, Check, AlertCircle } from 'lucide-react';
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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền access
  if (!hasAccess) {
    return null; // Layout sẽ hiển thị access denied
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-700 mb-6 font-medium">Không tìm thấy bài học</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
          >
            Quay Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-white to-slate-100" data-color-mode="light">
      {/* Editor Header */}
      <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-slate-900 flex-shrink-0"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{lesson.title}</h2>
              <p className="text-slate-600 text-sm mt-1">
                Chỉnh sửa nội dung markdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {/* Status Message */}
            {status !== 'idle' && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${
                  status === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg transition disabled:cursor-not-allowed font-medium"
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

      {/* Editor Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-lg border border-slate-200 overflow-hidden shadow-lg bg-white">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={true}
            height={600}
            className="bg-white"
            textareaProps={{
              disabled: saving,
            }}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Tips */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">💡 Mẹo Sử Dụng Markdown</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <code className="bg-blue-100 px-2 py-1 rounded text-xs">#</code> cho tiêu đề (h1, h2, h3...)</li>
              <li>• <code className="bg-blue-100 px-2 py-1 rounded text-xs">```</code> cho code blocks</li>
              <li>• <code className="bg-blue-100 px-2 py-1 rounded text-xs">**text**</code> cho bold, <code className="bg-blue-100 px-2 py-1 rounded text-xs">*text*</code> cho italic</li>
              <li>• <code className="bg-blue-100 px-2 py-1 rounded text-xs">[link](url)</code> cho links</li>
              <li>• Nhấn <code className="bg-blue-100 px-2 py-1 rounded text-xs">Ctrl+S</code> để lưu nhanh</li>
            </ul>
          </div>

          {/* Info */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-slate-900 mb-3">ℹ️ Thông Tin Bài Học</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-medium">ID:</span> <code className="bg-slate-200 px-2 py-1 rounded text-xs">{lesson.id}</code>
              </p>
              <p>
                <span className="font-medium">Chương ID:</span> <code className="bg-slate-200 px-2 py-1 rounded text-xs">{lesson.chapter_id}</code>
              </p>
              <p>
                <span className="font-medium">Cập nhật lần cuối:</span> {new Date(lesson.updated_at).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
