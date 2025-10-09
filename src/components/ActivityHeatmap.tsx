"use client";

import { ActivityDay } from '@/types/profile';
import { useState } from 'react';

interface ActivityHeatmapProps {
  activities: ActivityDay[];
  totalCount: number;
  currentStreak: number;
  year?: number;
}

export default function ActivityHeatmap({ 
  activities, 
  totalCount, 
  currentStreak,
  year = new Date().getFullYear() 
}: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Group activities by week (starting from Sunday)
  const weeks: (ActivityDay | null)[][] = [];
  
  // Get the first and last date
  const firstDate = activities.length > 0 ? new Date(activities[0].date) : new Date();
  const lastDate = activities.length > 0 ? new Date(activities[activities.length - 1].date) : new Date();
  
  // Start from the Sunday of the week containing the first date
  const startDate = new Date(firstDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Create a map for quick lookup
  const activityMap = new Map<string, ActivityDay>();
  activities.forEach(activity => {
    activityMap.set(activity.date, activity);
  });
  
  // Build weeks array
  let currentDate = new Date(startDate);
  let currentWeek: (ActivityDay | null)[] = [];
  
  while (currentDate <= lastDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const activity = activityMap.get(dateStr);
    
    if (activity) {
      currentWeek.push(activity);
    } else {
      currentWeek.push(null);
    }
    
    // If Sunday (end of week) or last date, push week
    if (currentDate.getDay() === 6) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Push remaining days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Get color based on activity level - GitHub style
  const getColor = (level: number): string => {
    const colors = {
      0: '#ebedf0', // No activity - light gray
      1: '#9be9a8', // Low - light green
      2: '#40c463', // Medium - medium green
      3: '#30a14e', // High - dark green
      4: '#216e39', // Very high - very dark green
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  const handleMouseEnter = (activity: ActivityDay, event: React.MouseEvent) => {
    setHoveredDay(activity);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const daysOfWeek = ['Mon', 'Wed', 'Fri'];

  // Get month labels for the timeline
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(day => day !== null);
      if (firstDayOfWeek) {
        const date = new Date(firstDayOfWeek.date);
        const month = date.getMonth();
        if (month !== lastMonth && weekIndex > 0) {
          labels.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-5">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {totalCount} hoạt động trong năm qua
        </h3>
      </div>

      {/* Activity Grid */}
      <div className="relative">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex mb-1 ml-7" style={{ height: '15px' }}>
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="text-xs text-gray-600 font-normal"
                style={{
                  position: 'absolute',
                  left: `${weekIndex * 13 + 28}px`,
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Grid container */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between pr-2 text-xs text-gray-600" style={{ width: '25px', height: `${7 * 11}px` }}>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="leading-none"
                  style={{ height: '11px', display: 'flex', alignItems: 'center' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Activity cells */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((activity, dayIndex) => {
                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="rounded-sm cursor-pointer transition-all"
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: activity ? getColor(activity.level) : '#ebedf0',
                          outline: hoveredDay === activity ? '2px solid rgba(0,0,0,0.3)' : 'none',
                          outlineOffset: '2px',
                        }}
                        onMouseEnter={(e) => activity && handleMouseEnter(activity, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with legend and streak */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <span className="font-semibold text-orange-600">🔥 {currentStreak} ngày</span> streak hiện tại
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Ít</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="rounded-sm"
              style={{ 
                width: '10px', 
                height: '10px',
                backgroundColor: getColor(level) 
              }}
              title={`Level ${level}`}
            />
          ))}
          <span>Nhiều</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium mb-0.5">
            {hoveredDay.count > 0 ? (
              <span>{hoveredDay.count} hoạt động</span>
            ) : (
              <span>Không có hoạt động</span>
            )}
          </div>
          <div className="text-gray-300">
            {new Date(hoveredDay.date).toLocaleDateString('vi-VN', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      )}
    </div>
  );
}
