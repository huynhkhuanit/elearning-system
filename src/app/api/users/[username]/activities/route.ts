import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { ActivityData, ActivityDay } from '@/types/profile';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Get user ID from username
    const users = await query<RowDataPacket[]>(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy người dùng',
        },
        { status: 404 }
      );
    }

    const userId = users[0].id;

    // Get activities from the last 12 months
    const activities = await query<RowDataPacket[]>(
      `SELECT 
        activity_date,
        lessons_completed,
        quizzes_completed,
        study_time
       FROM learning_activities
       WHERE user_id = ? 
         AND activity_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       ORDER BY activity_date ASC`,
      [userId]
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
    activities.forEach((activity) => {
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
