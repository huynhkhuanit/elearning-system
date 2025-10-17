import { useEffect, useState } from 'react';

/**
 * Hook để cập nhật title của document
 * @param title - Tiêu đề mới cho trang
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'DHV LearnX';
    };
  }, [title]);
}

/**
 * Hook để lấy nội dung markdown của bài học
 * @param lessonId - ID của bài học
 * @returns Nội dung markdown của bài học
 */
export function useLessonContent(lessonId: string): string | null {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setContent(null);
      return;
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/lessonContent.json');
        if (!response.ok) throw new Error('Failed to load content');
        
        const data = await response.json();
        const lessonData = data.lessons[lessonId];
        setContent(lessonData?.content || null);
      } catch (error) {
        console.error('Error loading lesson content:', error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [lessonId]);

  return content;
}
