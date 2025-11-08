import { NextRequest, NextResponse } from 'next/server';
import { queryOneBuilder, queryBuilder } from '@/lib/db';
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

    const activities = await queryBuilder<{
      activity_date: string;
      lessons_completed: number;
      quizzes_completed: number;
      study_time: number | null;
    }>(
      'learning_activities',
      {
        select: 'activity_date, lessons_completed, quizzes_completed, study_time',
        filters: { user_id: userId },
        orderBy: { column: 'activity_date', ascending: true }
      }
    );

    // Filter activities from last 12 months
    const filteredActivities = activities.filter(a => 
      new Date(a.activity_date) >= new Date(oneYearAgoStr)
    );

    // Create a map of all days in the last 12 months
    const activityMap = new Map<string, ActivityDay>();
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setMonth(today.getMonth() - 12);

    // Initialize all days with 0 activity
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
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
      const dateStr = new Date(activity.activity_date).toISOString().split('T')[0];
      const count = 
        (activity.lessons_completed || 0) + 
        (activity.quizzes_completed || 0);
      
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
