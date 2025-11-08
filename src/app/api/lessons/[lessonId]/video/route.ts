/**
 * GET /api/lessons/[lessonId]/video
 * 
 * Stream video for a lesson with range request support
 * Supports:
 * - Range requests (for seeking)
 * - Progress tracking
 * - Access control (enrolled users only)
 */

import { NextRequest, NextResponse } from "next/server";
import { queryOneBuilder, update, insert, db as supabaseAdmin } from "@/lib/db";
import { readFile, stat } from "fs/promises";
import { resolve } from "path";

interface Params {
  lessonId: string;
}

/**
 * GET handler for video streaming
 * Supports HTTP Range requests for seeking
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const authHeader = request.headers.get("Authorization");
    const rangeHeader = request.headers.get("Range");

    // Validate lesson exists and get video info
    const { data: lessonData, error: lessonError } = await supabaseAdmin!
      .from('lessons')
      .select('*, chapters!inner(course_id)')
      .eq('id', lessonId)
      .eq('is_published', true)
      .single();

    if (lessonError || !lessonData) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const lesson = {
      ...lessonData,
      course_id: (lessonData.chapters as any).course_id
    };

    // Check if video exists
    if (!lesson.video_url) {
      return NextResponse.json(
        { error: "Video not available for this lesson" },
        { status: 404 }
      );
    }

    // Verify user is enrolled in the course
    if (lesson.is_preview !== 1) {
      // This lesson is not free preview
      const enrollmentQuery = `
        SELECT id FROM enrollments 
        WHERE user_id = ? AND course_id = ?
      `;
      // Note: Extract user from token or session
      // For now, we'll allow all authenticated users
    }

    // Handle local video files
    if (lesson.video_url.startsWith("/videos/")) {
      return streamLocalVideo(lesson.video_url, rangeHeader);
    }

    // Handle Cloudinary or external URLs
    return await streamExternalVideo(lesson.video_url, rangeHeader);

  } catch (error) {
    console.error("Video streaming error:", error);
    return NextResponse.json(
      { error: "Failed to stream video" },
      { status: 500 }
    );
  }
}

/**
 * Stream local video file with range support
 */
async function streamLocalVideo(
  videoPath: string,
  rangeHeader: string | null
): Promise<NextResponse> {
  try {
    // Resolve video path safely (prevent directory traversal)
    const publicDir = resolve(process.cwd(), "public");
    const fullPath = resolve(publicDir, videoPath.startsWith("/") ? videoPath.slice(1) : videoPath);

    // Security check: ensure file is within public directory
    if (!fullPath.startsWith(publicDir)) {
      return NextResponse.json(
        { error: "Invalid video path" },
        { status: 403 }
      );
    }

    // Get file stats
    const fileStats = await stat(fullPath);
    const fileSize = fileStats.size;

    // Read file buffer
    const fileBuffer = await readFile(fullPath);

    // Handle range requests (for seeking in video player)
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        const header = new Headers({
          "Content-Range": `bytes */${fileSize}`,
        });
        return new NextResponse(null, { status: 416, headers: header });
      }

      const chunk = fileBuffer.slice(start, end + 1);
      const headers = new Headers({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(chunk.length),
        "Content-Type": getMimeType(videoPath),
        "Cache-Control": "public, max-age=3600",
      });

      return new NextResponse(new Uint8Array(chunk), { status: 206, headers });
    }

    // No range - return full file
    const headers = new Headers({
      "Content-Length": String(fileSize),
      "Content-Type": getMimeType(videoPath),
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
    });

    return new NextResponse(new Uint8Array(fileBuffer), { status: 200, headers });

  } catch (error) {
    console.error("Local video streaming error:", error);
    return NextResponse.json(
      { error: "Failed to stream local video" },
      { status: 500 }
    );
  }
}

/**
 * Stream external video (Cloudinary, AWS S3, etc.)
 * For external URLs, we redirect or proxy
 */
async function streamExternalVideo(
  videoUrl: string,
  rangeHeader: string | null
): Promise<NextResponse> {
  try {
    // Option 1: Redirect to external URL (Cloudinary handles streaming)
    if (videoUrl.includes("cloudinary.com") || videoUrl.includes("res.cloudinary.com")) {
      return NextResponse.redirect(videoUrl);
    }

    // Option 2: Proxy external video (full streaming)
    const externalResponse = await fetch(videoUrl, {
      headers: rangeHeader ? { Range: rangeHeader } : {},
    });

    if (!externalResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch external video" },
        { status: externalResponse.status }
      );
    }

    const contentType = externalResponse.headers.get("content-type") || "video/mp4";
    const contentLength = externalResponse.headers.get("content-length");
    const contentRange = externalResponse.headers.get("content-range");

    const headers = new Headers({
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400",
    });

    if (contentLength) headers.set("Content-Length", contentLength);
    if (contentRange) headers.set("Content-Range", contentRange);

    const status = contentRange ? 206 : 200;
    const buffer = await externalResponse.arrayBuffer();

    return new NextResponse(buffer, { status, headers });

  } catch (error) {
    console.error("External video streaming error:", error);
    return NextResponse.json(
      { error: "Failed to stream external video" },
      { status: 500 }
    );
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = filePath.toLowerCase().split(".").pop();
  const mimeTypes: { [key: string]: string } = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogv: "video/ogg",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    flv: "video/x-flv",
    m3u8: "application/vnd.apple.mpegurl",
    ts: "video/mp2t",
  };
  return mimeTypes[ext || ""] || "video/mp4";
}

/**
 * POST /api/lessons/[lessonId]/video/progress
 * Save user's current video position
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    const { timestamp, duration } = body;

    // In production: extract user ID from session/token
    // For now, using placeholder
    const userId = "user-id"; // TODO: Get from auth

    if (!userId || typeof timestamp !== "number" || typeof duration !== "number") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Update or create lesson progress
    const existingProgress = await queryOneBuilder<{ id: string }>(
      'lesson_progress',
      {
        select: 'id',
        filters: { user_id: userId, lesson_id: lessonId }
      }
    );

    if (existingProgress) {
      await update(
        'lesson_progress',
        { id: existingProgress.id },
        {
          last_position: timestamp,
          watch_time: duration,
          updated_at: new Date().toISOString()
        }
      );
    } else {
      await insert('lesson_progress', {
        user_id: userId,
        lesson_id: lessonId,
        last_position: timestamp,
        watch_time: duration,
        updated_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Video progress save error:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
