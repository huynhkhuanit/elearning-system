/**
 * POST /api/lessons/[lessonId]/video/upload
 * 
 * Upload video for a lesson
 * Supports:
 * - Local file upload
 * - Cloudinary upload
 * - Video validation
 * - Metadata extraction
 */

import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
import { uploadImage } from "@/lib/cloudinary";

interface Params {
  lessonId: string;
}

// Maximum file sizes
const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const ALLOWED_FORMATS = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

/**
 * POST handler for video upload
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const contentType = request.headers.get("content-type") || "";

    // Verify lesson exists and user has admin access
    const lesson = await queryOne(
      `SELECT l.*, c.course_id 
       FROM lessons l 
       JOIN chapters c ON l.chapter_id = c.id 
       WHERE l.id = ?`,
      [lessonId]
    ) as any;

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // TODO: Verify user is course instructor or admin
    // For now, allowing all uploads for testing

    let videoUrl: string;
    let videoDuration: number | null = null;

    // Handle different upload methods
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("video") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No video file provided" },
          { status: 400 }
        );
      }

      // Validate file
      const validation = validateVideoFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Upload to storage
      const uploadMethod = process.env.VIDEO_STORAGE || "local"; // local, cloudinary, s3
      const result = await uploadVideoToStorage(file, lessonId, uploadMethod);
      
      videoUrl = result.url;
      videoDuration = result.duration;

    } else if (contentType.includes("application/json")) {
      // External URL provided (for links to YouTube, Vimeo, etc.)
      const body = await request.json();
      const { videoUrl: externalUrl, duration } = body;

      if (!externalUrl) {
        return NextResponse.json(
          { error: "No video URL provided" },
          { status: 400 }
        );
      }

      videoUrl = externalUrl;
      videoDuration = duration || null;

    } else {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // Update lesson with video URL
    await query(
      `UPDATE lessons 
       SET video_url = ?, video_duration = ?, updated_at = NOW()
       WHERE id = ?`,
      [videoUrl, videoDuration, lessonId]
    );

    return NextResponse.json({
      success: true,
      videoUrl,
      videoDuration,
      lessonId,
    });

  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}

/**
 * Validate video file
 */
function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 2GB, got ${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB`,
    };
  }

  // Check file type
  if (!ALLOWED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid video format. Allowed: ${ALLOWED_FORMATS.join(", ")}, got ${file.type}`,
    };
  }

  // Check file extension
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowedExts = ["mp4", "webm", "ogv", "mov", "avi", "mkv"];
  if (!ext || !allowedExts.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedExts.join(", ")}, got .${ext}`,
    };
  }

  return { valid: true };
}

/**
 * Upload video to storage
 * Supports: local storage, Cloudinary, AWS S3
 */
async function uploadVideoToStorage(
  file: File,
  lessonId: string,
  method: string
): Promise<{ url: string; duration: number | null }> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);

  if (method === "cloudinary") {
    return uploadToCloudinary(uint8Array, lessonId, file.name);
  } else if (method === "s3") {
    return uploadToS3(uint8Array, lessonId, file.name);
  } else {
    // Default: local storage
    return uploadToLocal(uint8Array, lessonId, file.name);
  }
}

/**
 * Upload to local server storage
 */
async function uploadToLocal(
  buffer: Uint8Array,
  lessonId: string,
  fileName: string
): Promise<{ url: string; duration: number | null }> {
  try {
    // Create videos directory if it doesn't exist
    const videosDir = resolve(process.cwd(), "public", "videos");
    await mkdir(videosDir, { recursive: true });

    // Generate filename with timestamp
    const ext = fileName.split(".").pop();
    const timestamp = Date.now();
    const storageName = `${lessonId}-${timestamp}.${ext}`;
    const filePath = resolve(videosDir, storageName);

    // Write file to disk
    await writeFile(filePath, buffer);

    // Generate URL (relative to public folder)
    const videoUrl = `/videos/${storageName}`;

    // For local files, duration should be extracted from video metadata
    // For now, returning null - client will get duration from <video> element
    const duration = null;

    console.log(`✅ Video uploaded locally: ${videoUrl}`);

    return {
      url: videoUrl,
      duration,
    };

  } catch (error) {
    console.error("Local upload error:", error);
    throw new Error("Failed to upload video to local storage");
  }
}

/**
 * Upload to Cloudinary
 */
async function uploadToCloudinary(
  buffer: Uint8Array,
  lessonId: string,
  fileName: string
): Promise<{ url: string; duration: number | null }> {
  try {
    const cloudinaryModule = await import("cloudinary");
    const { v2: cloudinary } = cloudinaryModule;

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "dhvlearnx/videos",
          public_id: `${lessonId}-${Date.now()}`,
          resource_type: "video",
          video_sampling: 5, // Sample every 5 seconds for preview
        },
        (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              duration: result.duration || null,
            });
          } else {
            reject(new Error("Upload failed"));
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(buffer);
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload video to Cloudinary: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Upload to AWS S3
 */
async function uploadToS3(
  buffer: Uint8Array,
  lessonId: string,
  fileName: string
): Promise<{ url: string; duration: number | null }> {
  try {
    // This requires AWS SDK setup
    // Example placeholder:
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    if (!bucketName || !region) {
      throw new Error("AWS credentials not configured");
    }

    // TODO: Implement AWS S3 upload using @aws-sdk/client-s3
    throw new Error("AWS S3 upload not yet implemented");

  } catch (error) {
    console.error("S3 upload error:", error);
    throw error;
  }
}

/**
 * DELETE handler to delete video
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;

    // Verify lesson exists
    const lesson = await queryOne(
      `SELECT video_url FROM lessons WHERE id = ?`,
      [lessonId]
    ) as any;

    if (!lesson || !lesson.video_url) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    // TODO: Delete from storage (local file or Cloudinary)

    // Update lesson to remove video URL
    await query(
      `UPDATE lessons 
       SET video_url = NULL, video_duration = NULL, updated_at = NOW()
       WHERE id = ?`,
      [lessonId]
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
