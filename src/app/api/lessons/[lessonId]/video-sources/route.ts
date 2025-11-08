import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder } from '@/lib/db';

interface VideoSourceResponse {
  primary: string | null;
  embed?: string;
  isMock: boolean;
  type: 'file' | 'youtube' | 'vimeo' | 'mock' | 'unknown';
  fallback?: string;
}

/**
 * Detect video source type from URL
 */
function detectVideoType(url: string): string {
  if (!url) return 'unknown';
  if (url.includes('MOCK_PLACEHOLDER:')) return 'mock';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('streamable.com')) return 'streamable';
  return 'file';
}

/**
 * Convert YouTube URL to embed format
 */
function getYouTubeEmbedUrl(url: string): string {
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
}

/**
 * Convert Vimeo URL to embed format
 */
function getVimeoEmbedUrl(url: string): string {
  const videoId = url.split('/').pop()?.split('?')[0];
  return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1` : '';
}

/**
 * GET /api/lessons/[lessonId]/video-sources
 * 
 * Returns multiple video source options with fallbacks.
 * Allows VideoPlayer to choose best format for current platform.
 * 
 * Response includes:
 * - primary: Direct playable URL (file, YouTube watch, or mock)
 * - embed: Embedded iframe URL (YouTube embed, Vimeo embed)
 * - type: Source type for UI indicators
 * - isMock: Whether this is a placeholder video
 * - fallback: Alternative URL if primary fails
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const lesson = await queryOneBuilder<{
      id: string;
      title: string;
      video_url: string | null;
      video_duration: number | null;
    }>(
      'lessons',
      {
        select: 'id, title, video_url, video_duration',
        filters: { id: lessonId }
      }
    );

    if (!lesson) {
      return NextResponse.json(
        { error: 'Bài học không tìm thấy' },
        { status: 404 }
      );
    }

    const videoUrl = lesson.video_url;
    const videoType = detectVideoType(videoUrl || '');
    
    let response: VideoSourceResponse = {
      primary: null,
      isMock: false,
      type: 'unknown',
    };

    if (!videoUrl) {
      // No video - return mock placeholder
      response = {
        primary: `MOCK_PLACEHOLDER:${lesson.title}`,
        isMock: true,
        type: 'mock',
        embed: undefined,
        fallback: undefined,
      };
    } else if (videoType === 'mock') {
      // Already a mock placeholder
      response = {
        primary: videoUrl,
        isMock: true,
        type: 'mock',
      };
    } else if (videoType === 'youtube') {
      // YouTube URL - provide both direct and embed versions
      response = {
        primary: videoUrl,
        embed: getYouTubeEmbedUrl(videoUrl),
        type: 'youtube',
        isMock: false,
        fallback: 'https://www.youtube.com/embed/placeholder', // Generic fallback
      };
    } else if (videoType === 'vimeo') {
      // Vimeo URL - provide both direct and embed versions
      response = {
        primary: videoUrl,
        embed: getVimeoEmbedUrl(videoUrl),
        type: 'vimeo',
        isMock: false,
      };
    } else {
      // File or unknown - serve directly
      response = {
        primary: videoUrl,
        type: videoType as 'file' | 'unknown',
        isMock: false,
      };
    }

    return NextResponse.json({
      success: true,
      data: response,
      metadata: {
        lessonTitle: lesson.title,
        duration: lesson.video_duration,
        sourceType: videoType,
      }
    });

  } catch (error) {
    console.error('Error fetching video sources:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy nguồn video' },
      { status: 500 }
    );
  }
}
