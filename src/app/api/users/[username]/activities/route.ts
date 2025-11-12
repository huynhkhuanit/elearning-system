import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, queryBuilder } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';
import { ActivityData, ActivityDay } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Get user ID from username
    const user = await queryOneBuilder<{ id: string }>(
      'users',
      {
        select: 'id',
        filters: { username }
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy người dùng',
        },
        { status: 404 }
      );
    }

    const userId = user.id;

    // Get activities from the last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);
    const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

    // Helper function to parse date and convert to YYYY-MM-DD format
    const parseDateToDateString = (dateValue: any): string | null => {
      if (!dateValue) return null;
      
      try {
        let date: Date;
        
        if (typeof dateValue === 'string') {
          // Handle MySQL datetime format (YYYY-MM-DD HH:MM:SS) without timezone
          if (dateValue.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/) && !dateValue.includes('T') && !dateValue.includes('Z')) {
            // MySQL datetime - treat as UTC
            date = new Date(dateValue + 'Z');
          } else if (dateValue.includes('T') && dateValue.includes('Z')) {
            // ISO string with Z - already UTC
            date = new Date(dateValue);
          } else if (dateValue.includes('T') && !dateValue.includes('Z')) {
            // ISO string without Z - add Z to treat as UTC
            date = new Date(dateValue.endsWith('+00:00') || dateValue.endsWith('+0000') ? dateValue : dateValue + 'Z');
          } else {
            // Try parsing as-is
            date = new Date(dateValue);
          }
        } else {
          date = new Date(dateValue);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date value:', dateValue);
          return null;
        }
        
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.warn('Error parsing date:', dateValue, error);
        return null;
      }
    };

    // Collect all activities from multiple sources
    const dateActivityMap = new Map<string, number>();

    // 1. Get completed lessons from lesson_progress
    try {
      const completedLessons = await queryBuilder<{
        completed_at: string | null;
      }>(
        'lesson_progress',
        {
          select: 'completed_at',
          filters: { user_id: userId, is_completed: true },
          orderBy: { column: 'completed_at', ascending: true }
        }
      );

      completedLessons.forEach((lesson) => {
        const dateStr = parseDateToDateString(lesson.completed_at);
        if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
          dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
        }
      });
    } catch (error: any) {
      console.warn('Error fetching lesson progress:', error?.message);
    }

    // 2. Get blog comments
    try {
      const blogComments = await queryBuilder<{
        created_at: string | null;
      }>(
        'blog_comments',
        {
          select: 'created_at',
          filters: { user_id: userId },
          orderBy: { column: 'created_at', ascending: true }
        }
      );

      blogComments.forEach((comment) => {
        const dateStr = parseDateToDateString(comment.created_at);
        if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
          dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
        }
      });
    } catch (error: any) {
      console.warn('Error fetching blog comments:', error?.message);
    }

    // 3. Get lesson comments
    try {
      const lessonComments = await queryBuilder<{
        created_at: string | null;
      }>(
        'comments',
        {
          select: 'created_at',
          filters: { user_id: userId },
          orderBy: { column: 'created_at', ascending: true }
        }
      );

      lessonComments.forEach((comment) => {
        const dateStr = parseDateToDateString(comment.created_at);
        if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
          dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
        }
      });
    } catch (error: any) {
      console.warn('Error fetching lesson comments:', error?.message);
    }

    // 4. Get forum topics (questions/posts)
    try {
      const forumTopics = await queryBuilder<{
        created_at: string | null;
      }>(
        'forum_topics',
        {
          select: 'created_at',
          filters: { user_id: userId },
          orderBy: { column: 'created_at', ascending: true }
        }
      );

      forumTopics.forEach((topic) => {
        const dateStr = parseDateToDateString(topic.created_at);
        if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
          dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
        }
      });
    } catch (error: any) {
      console.warn('Error fetching forum topics:', error?.message);
    }

    // 5. Get forum replies - Use Supabase client directly for better reliability
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client not initialized');
      }

      const { data: forumReplies, error: forumRepliesError } = await supabaseAdmin
        .from('forum_replies')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (forumRepliesError) {
        throw forumRepliesError;
      }

      console.log(`[ACTIVITIES] Found ${forumReplies?.length || 0} forum replies for user ${userId}`);
      
      if (forumReplies) {
        forumReplies.forEach((reply: any) => {
          const dateStr = parseDateToDateString(reply.created_at);
          if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
            dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
          }
        });
      }
    } catch (error: any) {
      console.error('Error fetching forum replies:', error?.message, error);
    }

    // 6. Get lesson questions (questions asked in lessons)
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client not initialized');
      }

      const { data: lessonQuestions, error: lessonQuestionsError } = await supabaseAdmin
        .from('lesson_questions')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (lessonQuestionsError) {
        throw lessonQuestionsError;
      }

      console.log(`[ACTIVITIES] Found ${lessonQuestions?.length || 0} lesson questions for user ${userId}`);
      
      if (lessonQuestions) {
        lessonQuestions.forEach((question: any) => {
          const dateStr = parseDateToDateString(question.created_at);
          if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
            dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
          }
        });
      }
    } catch (error: any) {
      console.error('Error fetching lesson questions:', error?.message, error);
    }

    // 7. Get lesson answers (answers to lesson questions)
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client not initialized');
      }

      const { data: lessonAnswers, error: lessonAnswersError } = await supabaseAdmin
        .from('lesson_answers')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (lessonAnswersError) {
        throw lessonAnswersError;
      }

      console.log(`[ACTIVITIES] Found ${lessonAnswers?.length || 0} lesson answers for user ${userId}`);
      
      if (lessonAnswers) {
        lessonAnswers.forEach((answer: any) => {
          const dateStr = parseDateToDateString(answer.created_at);
          if (dateStr && new Date(dateStr) >= new Date(oneYearAgoStr)) {
            dateActivityMap.set(dateStr, (dateActivityMap.get(dateStr) || 0) + 1);
            console.log(`[ACTIVITIES] Lesson answer date: ${answer.created_at} -> ${dateStr}, added to activity`);
          }
        });
      }
    } catch (error: any) {
      console.error('Error fetching lesson answers:', error?.message, error);
    }

    // Log summary for debugging
    console.log(`[ACTIVITIES] Total unique activity days: ${dateActivityMap.size}`);
    console.log(`[ACTIVITIES] Activity map sample:`, Array.from(dateActivityMap.entries()).slice(0, 5));

    // Convert to activities format
    const filteredActivities = Array.from(dateActivityMap.entries()).map(([date, count]) => ({
      activity_data: date,
      lessons_completed: count,
      quizzes_completed: 0,
      study_time: null,
    }));

    // Create a map of all days in the last 12 months
    const activityMap = new Map<string, ActivityDay>();
    const today = new Date();
    // Reuse oneYearAgo from above, create a copy for iteration
    const oneYearAgoCopy = new Date(oneYearAgo);

    // Initialize all days with 0 activity
    for (let d = new Date(oneYearAgoCopy); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      activityMap.set(dateStr, {
        date: dateStr,
        count: 0,
        level: 0,
      });
    }

    // Fill in actual activity data
    let totalCount = 0;
    filteredActivities.forEach((activity) => {
      const dateStr = new Date(activity.activity_data).toISOString().split('T')[0];
      const count = activity.lessons_completed || 0; // This now includes all activities
      
      totalCount += count;

      // Determine intensity level (0-4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 10) level = 4;
      else if (count >= 7) level = 3;
      else if (count >= 4) level = 2;
      else if (count >= 1) level = 1;

      activityMap.set(dateStr, {
        date: dateStr,
        count,
        level,
      });
    });

    // Calculate streaks
    const sortedDates = Array.from(activityMap.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate from most recent date backwards for current streak
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const activity = activityMap.get(sortedDates[i]);
      if (activity && activity.count > 0) {
        currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        // Stop current streak on first day with no activity
        if (i === sortedDates.length - 1 || currentStreak > 0) {
          break;
        }
      }
    }

    // Calculate longest streak from beginning
    tempStreak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      const activity = activityMap.get(sortedDates[i]);
      if (activity && activity.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    const activityData: ActivityData = {
      activities: Array.from(activityMap.values()),
      total_count: totalCount,
      current_streak: currentStreak,
      longest_streak: longestStreak,
    };

    return NextResponse.json(
      {
        success: true,
        data: activityData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user activities error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi khi lấy thông tin hoạt động',
      },
      { status: 500 }
    );
  }
}
