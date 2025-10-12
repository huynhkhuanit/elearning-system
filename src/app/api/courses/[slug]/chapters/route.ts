import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get course ID from slug
    const [courseRows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM courses WHERE slug = ? AND is_published = 1",
      [slug]
    );

    if (courseRows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }

    const courseId = courseRows[0].id;

    // Get chapters with lessons
    const [chapters] = await pool.query<RowDataPacket[]>(
      `SELECT 
        c.id,
        c.title,
        c.description,
        c.sort_order,
        c.is_published
      FROM chapters c
      WHERE c.course_id = ? AND c.is_published = 1
      ORDER BY c.sort_order ASC`,
      [courseId]
    );

    // Get all lessons for these chapters
    const chapterIds = chapters.map(c => c.id);
    
    if (chapterIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          chapters: [],
          totalLessons: 0
        }
      });
    }

    const [lessons] = await pool.query<RowDataPacket[]>(
      `SELECT 
        l.id,
        l.chapter_id,
        l.title,
        l.content,
        l.video_url,
        l.video_duration,
        l.sort_order,
        l.is_preview,
        l.is_published
      FROM lessons l
      WHERE l.chapter_id IN (?) AND l.is_published = 1
      ORDER BY l.sort_order ASC`,
      [chapterIds]
    );

    // Format duration from seconds to mm:ss
    const formatDuration = (seconds: number | null): string => {
      if (!seconds) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate total duration for each chapter
    const chaptersWithLessons = chapters.map(chapter => {
      const chapterLessons = lessons.filter(l => l.chapter_id === chapter.id);
      const totalSeconds = chapterLessons.reduce((sum, l) => sum + (l.video_duration || 0), 0);
      const totalMinutes = Math.floor(totalSeconds / 60);
      
      let durationText = "";
      if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        durationText = `${hours} giờ ${mins > 0 ? mins + ' phút' : ''}`;
      } else {
        durationText = `${totalMinutes} phút`;
      }

      return {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        duration: durationText.trim(),
        order: chapter.sort_order,
        lessons: chapterLessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          duration: formatDuration(lesson.video_duration),
          type: lesson.video_url ? "video" : "reading",
          isFree: lesson.is_preview === 1,
          isPreview: lesson.is_preview === 1,
          order: lesson.sort_order,
          videoUrl: lesson.video_url,
          content: lesson.content
        }))
      };
    });

    const totalLessons = lessons.length;

    return NextResponse.json({
      success: true,
      data: {
        chapters: chaptersWithLessons,
        totalLessons
      }
    });

  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

