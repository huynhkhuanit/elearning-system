/**
 * POST /api/lessons/[lessonId]/video/progress
 * 
 * Save user's current video watch position
 * Tracks: current time, duration, watch history
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken, extractTokenFromHeader } from "@/lib/auth";

interface Params {
  lessonId: string;
}

/**
 * POST handler - Save video progress
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    const { timestamp, duration } = body;

    // Validate inputs
    if (typeof timestamp !== "number" || typeof duration !== "number") {
      return NextResponse.json(
        { 
          error: "Invalid request body. Need: timestamp (number), duration (number)" 
        },
        { status: 400 }
      );
    }

    if (timestamp < 0 || duration < 0) {
      return NextResponse.json(
        { error: "Timestamp and duration must be positive" },
        { status: 400 }
      );
    }

    // Extract user ID from JWT token
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      // No auth token - save as anonymous (skip progress saving)
      return NextResponse.json({ 
        success: true,
        message: "Video playing (not saving progress - anonymous user)",
      });
    }

    const payload = verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    // Save progress to database
    await query(
      `INSERT INTO lesson_progress 
       (user_id, lesson_id, last_position, watch_time, updated_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
       last_position = VALUES(last_position),
       watch_time = VALUES(watch_time),
       updated_at = NOW()`,
      [userId, lessonId, Math.round(timestamp), Math.round(duration)]
    );

    return NextResponse.json({ 
      success: true,
      message: "Progress saved",
      data: {
        lessonId,
        timestamp: Math.round(timestamp),
        duration: Math.round(duration),
      }
    });

  } catch (error) {
    console.error("Video progress error:", error);
    return NextResponse.json(
      { error: "Failed to save video progress" },
      { status: 500 }
    );
  }
}
