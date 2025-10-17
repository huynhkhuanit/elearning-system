'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Save, ArrowLeft, Loader, Check, AlertCircle, Eye, Code } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

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

  // Chờ auth check xong
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Đang xác thực quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền access
  if (!hasAccess) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-100 mb-6 font-medium">Không tìm thấy bài học</p>
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
    <div className="min-h-screen bg-slate-950" data-color-mode="dark">
      {/* Editor Header */}
      <div className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-slate-200 flex-shrink-0"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-100 truncate">{lesson.title}</h2>
              <p className="text-slate-400 text-sm mt-1">
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
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
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
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded-lg transition disabled:cursor-not-allowed font-medium"
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
      <div className="p-6">
        <div className="rounded-lg border border-slate-700 overflow-hidden shadow-2xl bg-slate-900">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={true}
            height={700}
            className="bg-slate-900 text-slate-100"
            textareaProps={{
              disabled: saving,
              style: {
                backgroundColor: '#111827',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
              }
            }}
            style={{
              backgroundColor: '#111827',
              color: '#f1f5f9',
            }}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Tips */}
          <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-lg hover:border-indigo-500/50 transition">
            <h3 className="font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              💡 Mẹo Markdown
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max"># Tiêu đề</span>
                <span className="text-slate-400">Dùng # h1, ## h2, ### h3</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max">Code block</span>
                <span className="text-slate-400">Bao bằng ``` (backticks)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max">**Bold**</span>
                <span className="text-slate-400">Dùng ** hoặc __ xung quanh</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max">*Italic*</span>
                <span className="text-slate-400">Dùng * hoặc _ xung quanh</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max">- List items</span>
                <span className="text-slate-400">Dùng - hoặc * hoặc 1.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-indigo-400 font-semibold min-w-max">Ctrl+S</span>
                <span className="text-slate-400">Lưu nội dung nhanh</span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition">
            <h3 className="font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              ℹ️ Thông Tin Bài Học
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400">ID:</p>
                <code className="bg-slate-900 text-green-400 px-2 py-1 rounded text-xs font-mono">{lesson.id}</code>
              </div>
              <div>
                <p className="text-slate-400">Chương ID:</p>
                <code className="bg-slate-900 text-blue-400 px-2 py-1 rounded text-xs font-mono">{lesson.chapter_id}</code>
              </div>
              <div>
                <p className="text-slate-400">Cập nhật lần cuối:</p>
                <p className="text-slate-300 font-mono text-xs">{new Date(lesson.updated_at).toLocaleString('vi-VN')}</p>
              </div>
              <div className="pt-3 border-t border-slate-700">
                <p className="text-slate-300 font-medium">
                  {content.trim().length > 0 ? (
                    <span className="text-green-400">✓ Có nội dung</span>
                  ) : (
                    <span className="text-amber-400">⚠ Nội dung trống</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
