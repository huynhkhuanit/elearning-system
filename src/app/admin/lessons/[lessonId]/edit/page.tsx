'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import { Save, ArrowLeft, Loader, Check, AlertCircle, Eye, Code, Lightbulb, Info, CheckCircle, AlertTriangle, Upload, Play, Trash2, X } from 'lucide-react';
import { useAdminAccess } from '@/lib/hooks/useAdminAccess';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface LessonData {
  id: string;
  title: string;
  content: string;
  chapter_id: string;
  video_url?: string;
  video_duration?: number;
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
  
  // Video upload states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

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

  // Video upload handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        setUploadStatus('error');
        setUploadMessage('Vui lòng chọn file video');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        setUploadStatus('error');
        setUploadMessage('Vui lòng chọn file video');
      }
    }
  };

  const handleUploadVideo = async () => {
    if (!videoFile || !lessonId) {
      setUploadStatus('error');
      setUploadMessage('Vui lòng chọn file video');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('idle');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('video', videoFile);

      const response = await fetch(`/api/lessons/${lessonId}/video/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi khi upload video');
      }

      const result = await response.json();
      setUploadStatus('success');
      setUploadMessage(`Upload thành công! Thời lượng: ${Math.round(result.videoDuration)}s`);
      setVideoFile(null);

      // Update lesson
      setLesson({
        ...lesson!,
        video_url: result.videoUrl,
        video_duration: result.videoDuration,
      });

      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Lỗi khi upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!lessonId) return;

    try {
      setIsUploading(true);
      const response = await fetch(`/api/lessons/${lessonId}/video/upload`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Lỗi khi xóa video');

      setLesson({
        ...lesson!,
        video_url: undefined,
        video_duration: undefined,
      });

      setUploadStatus('success');
      setUploadMessage('Xóa video thành công');
      setTimeout(() => setUploadStatus('idle'), 2000);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Lỗi khi xóa video');
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="p-6 space-y-6">
        {/* Video Upload Section */}
        <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-900">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Upload Video
            </h3>
            <p className="text-sm text-slate-400 mt-1">Upload video cho bài học này</p>
          </div>

          <div className="p-6 space-y-4">
            {/* Upload Area */}
            {!lesson?.video_url ? (
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-slate-500 mb-3" />
                  <p className="text-slate-200 font-medium mb-1">
                    {videoFile ? videoFile.name : isDragging ? 'Thả file video ở đây' : 'Kéo video vào đây hoặc click để chọn'}
                  </p>
                  <p className="text-sm text-slate-400">
                    Hỗ trợ: MP4, WebM, OGG, MOV... (Tối đa 2GB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Play className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-300 font-medium">Video đã upload</p>
                      <p className="text-sm text-green-400/70">
                        Thời lượng: {Math.round(lesson.video_duration || 0)}s
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteVideo}
                    disabled={isUploading}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded transition disabled:opacity-50"
                    title="Xóa video"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Upload Status */}
            {uploadStatus !== 'idle' && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition text-sm font-medium ${
                  uploadStatus === 'success'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {uploadStatus === 'success' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{uploadMessage}</span>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Đang upload...</span>
                  <span className="text-indigo-400 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            {videoFile && !lesson?.video_url && (
              <button
                onClick={handleUploadVideo}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white rounded-lg transition disabled:cursor-not-allowed font-medium"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Video ({Math.round(videoFile.size / 1024 / 1024)}MB)
                  </>
                )}
              </button>
            )}

            {/* Video URL Display */}
            {lesson?.video_url && (
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-400 mb-1">Video URL:</p>
                <code className="text-xs text-green-400 break-all">{lesson.video_url}</code>
              </div>
            )}
          </div>
        </div>

        {/* Markdown Editor */}
        <div className="rounded-lg border border-slate-700 overflow-hidden shadow-2xl" data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={true}
            height={700}
            textareaProps={{
              disabled: saving,
              style: {
                backgroundColor: '#111827',
                color: '#f1f5f9',
                fontSize: '14px',
                fontFamily: "'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace",
                lineHeight: '1.6',
              }
            }}
          />
        </div>

        {/* Help Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Tips */}
          <div className="p-6 bg-slate-800/50 border border-indigo-500/30 rounded-lg hover:border-indigo-500/50 transition">
            <h3 className="font-bold text-indigo-300 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Mẹo Markdown
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
              <Info className="w-5 h-5" />
              Thông Tin Bài Học
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
                <p className="text-slate-300 font-medium flex items-center gap-2">
                  {content.trim().length > 0 ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Có nội dung</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400">Nội dung trống</span>
                    </>
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
