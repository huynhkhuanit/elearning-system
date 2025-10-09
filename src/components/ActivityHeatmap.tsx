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

  // Group activities by week
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];
  
  activities.forEach((activity, index) => {
    const date = new Date(activity.date);
    const dayOfWeek = date.getDay();
    
    currentWeek.push(activity);
    
    // Start new week on Sunday or at the end
    if (dayOfWeek === 6 || index === activities.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get color based on activity level
  const getColor = (level: number): string => {
    const colors = {
      0: '#ebedf0', // No activity
      1: '#9be9a8', // Low
      2: '#40c463', // Medium
      3: '#30a14e', // High
      4: '#216e39', // Very high
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

  const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Get month labels for the timeline
  const getMonthLabels = () => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {totalCount} hoạt động trong 12 tháng qua
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Chuỗi học tập hiện tại: <span className="font-semibold text-primary">{currentStreak} ngày</span>
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Ít hơn</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(level) }}
              title={`Level ${level}`}
            />
          ))}
          <span>Nhiều hơn</span>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="relative overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 ml-6">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="text-xs text-gray-600"
                style={{
                  position: 'absolute',
                  left: `${weekIndex * 14 + 24}px`,
                }}
              >
                {month}
              </div>
            ))}
          </div>

          {/* Grid container */}
          <div className="flex gap-1 mt-6">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2 text-xs text-gray-600">
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className="h-[10px] flex items-center"
                  style={{ opacity: index % 2 === 1 ? 1 : 0 }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Activity cells */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const activity = week.find((a) => {
                      const date = new Date(a.date);
                      return date.getDay() === dayIndex;
                    });

                    return (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="w-[10px] h-[10px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-gray-400"
                        style={{
                          backgroundColor: activity ? getColor(activity.level) : '#ebedf0',
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

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-semibold">
            {new Date(hoveredDay.date).toLocaleDateString('vi-VN', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className="mt-1">
            {hoveredDay.count > 0 ? (
              <span>{hoveredDay.count} hoạt động</span>
            ) : (
              <span>Chưa có hoạt động</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
