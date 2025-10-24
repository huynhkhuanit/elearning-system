/**
 * Video Utilities - Generate mock/placeholder videos cho testing & FREE courses
 */

export interface VideoSource {
  type: 'mock' | 'youtube' | 'vimeo' | 'file' | 'streamable';
  url: string;
  title: string;
  duration?: number;
}

/**
 * Generate mock video blob (placeholder)
 * Không cần quay video thực, dùng để test UI
 */
export async function generateMockVideo(
  duration: number = 300, // 5 minutes default
  title: string = 'Bài học mẫu'
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1f2937');
  gradient.addColorStop(1, '#111827');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add title
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 60);

  // Add duration info
  ctx.font = '32px Arial';
  ctx.fillStyle = '#f97316';
  ctx.fillText(`Thời lượng: ${duration}s`, canvas.width / 2, canvas.height / 2 + 60);

  // Add placeholder text
  ctx.font = '24px Arial';
  ctx.fillStyle = '#d1d5db';
  ctx.fillText('🎬 Placeholder Video - Dùng để testing', canvas.width / 2, canvas.height / 2 + 120);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, 'video/mp4');
  });
}

/**
 * Generate mock video URL (data URL)
 * Nhanh hơn, không cần blob
 */
export function generateMockVideoDataUrl(title: string = 'Bài học mẫu'): string {
  // Create a simple SVG video thumbnail
  const svg = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#grad)"/>
      <circle cx="640" cy="360" r="80" fill="#f97316" opacity="0.2"/>
      <polygon points="620,320 620,400 700,360" fill="#f97316"/>
      <text x="640" y="500" font-size="48" font-weight="bold" text-anchor="middle" fill="white">${title}</text>
      <text x="640" y="560" font-size="24" text-anchor="middle" fill="#d1d5db">🎬 Placeholder Video</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Convert YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url: string): string {
  // Extract video ID
  let videoId = '';

  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0] || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }

  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
}

/**
 * Convert Vimeo URL to embed URL
 */
export function getVimeoEmbedUrl(url: string): string {
  const videoId = url.split('/').pop()?.split('?')[0] || '';
  if (!videoId) return '';
  return `https://player.vimeo.com/video/${videoId}`;
}

/**
 * Get video duration from URL (if possible)
 */
export async function getVideoDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.addEventListener('loadedmetadata', () => {
      resolve(video.duration);
    });
    video.addEventListener('error', () => {
      resolve(0); // Default if error
    });
    video.src = url;
    video.load();
  });
}

/**
 * Determine video source type
 */
export function detectVideoSourceType(url: string): VideoSource['type'] {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('streamable.com')) return 'streamable';
  if (url.startsWith('data:')) return 'mock';
  return 'file';
}

/**
 * Convert any video URL to playable format
 */
export function normalizeVideoUrl(
  url: string,
  options: { asMock?: boolean; asEmbed?: boolean } = {}
): string {
  if (options.asMock) {
    return generateMockVideoDataUrl();
  }

  const type = detectVideoSourceType(url);

  switch (type) {
    case 'youtube':
      return options.asEmbed ? getYouTubeEmbedUrl(url) : url;
    case 'vimeo':
      return options.asEmbed ? getVimeoEmbedUrl(url) : url;
    case 'streamable':
      return url.replace('streamable.com/', 'streamable.com/e/');
    default:
      return url;
  }
}

/**
 * Check if URL is external video (YouTube, Vimeo, etc)
 */
export function isExternalVideo(url: string): boolean {
  return ['youtube', 'vimeo', 'streamable'].includes(detectVideoSourceType(url));
}

/**
 * Get fallback video URL if primary fails
 */
export function getFallbackVideoUrl(
  primaryUrl: string,
  options: { useMock?: boolean; usePlaceholder?: boolean } = {}
): string {
  if (options.useMock) {
    return generateMockVideoDataUrl('Video tạm thời');
  }

  if (options.usePlaceholder) {
    return 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc2gtaXNvMXZjMWk='; // Minimal MP4
  }

  return primaryUrl;
}

/**
 * Create video object with all variants
 */
export function createVideoObject(
  baseUrl: string,
  title: string = 'Bài học',
  duration?: number
): {
  primary: string;
  embed?: string;
  fallback: string;
  mock: string;
  type: VideoSource['type'];
  title: string;
  duration: number;
} {
  const type = detectVideoSourceType(baseUrl);
  const mockUrl = generateMockVideoDataUrl(title);

  return {
    primary: baseUrl,
    embed: type === 'youtube' ? getYouTubeEmbedUrl(baseUrl) : 
           type === 'vimeo' ? getVimeoEmbedUrl(baseUrl) : undefined,
    fallback: mockUrl,
    mock: mockUrl,
    type,
    title,
    duration: duration || 300,
  };
}
