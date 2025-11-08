"use client";

import { useState, useMemo } from "react";
import type { ActivityDay } from "@/types/profile";

interface ActivityHeatmapProps {
  activities: ActivityDay[];
  totalCount: number;
  currentStreak: number;
}

interface DayCell {
  date: Date;
  count: number;
  month: number;
}

export default function ActivityHeatmap({ activities, totalCount, currentStreak }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: Date; count: number; x: number; y: number } | null>(null);

  // Create a map for quick lookup of activity counts
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activities.forEach((activity) => {
      map.set(activity.date, activity.count);
    });
    return map;
  }, [activities]);

  // Generate data for the heatmap (last 365 days)
  const heatmapData = useMemo(() => {
    const weeks: DayCell[][] = [];
    const today = new Date();
    
    // Calculate the start date (365 days ago)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    
    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    let currentWeek: DayCell[] = [];
    const currentDate = new Date(startDate);
    
    // Generate 53 weeks worth of days
    for (let i = 0; i < 371; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const count = activityMap.get(dateStr) || 0;
      
      currentWeek.push({
        date: new Date(currentDate),
        count,
        month: currentDate.getMonth(),
      });
      
      // If Saturday (end of week), start a new week
      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [activityMap]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; offset: number }[] = [];
    let lastMonth = -1;
    
    heatmapData.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        labels.push({
          month: firstDay.date.toLocaleDateString("vi-VN", { month: "short" }),
          offset: weekIndex,
        });
        lastMonth = firstDay.month;
      }
    });
    
    return labels;
  }, [heatmapData]);

  // Get color based on activity count (GitHub-style green gradient)
  const getColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-emerald-200";
    if (count <= 5) return "bg-emerald-400";
    if (count <= 9) return "bg-emerald-500";
    return "bg-emerald-600";
  };

  const weekDayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {totalCount.toLocaleString("vi-VN")} hoạt động trong năm qua
        </h2>
        {currentStreak > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-orange-500 font-semibold">🔥 {currentStreak} ngày liên tiếp</span>
          </div>
        )}
      </div>

      {/* Heatmap Container - Full width */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="w-full min-w-max">
          {/* Month Labels */}
          <div className="flex gap-[3px] mb-2 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-gray-600"
                style={{
                  marginLeft: index === 0 ? 0 : `${(label.offset - (monthLabels[index - 1]?.offset || 0)) * 11}px`,
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Heatmap Grid - Full width */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] justify-start pr-2 flex-shrink-0">
              {weekDayLabels.map((day, index) => (
                <div
                  key={day}
                  className="text-xs text-gray-600 h-[10px] flex items-center"
                  style={{ visibility: index % 2 === 1 ? "visible" : "hidden" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Activity cells - Full width grid */}
            <div className="flex gap-[3px]">
              {heatmapData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    const isToday = day.date.toDateString() === new Date().toDateString();
                    const isFutureDate = day.date > new Date();
                    
                    return (
                      <div
                        key={dayIndex}
                        className={`
                          w-[10px] h-[10px] rounded-sm cursor-pointer transition-all
                          ${isFutureDate ? "bg-transparent" : getColor(day.count)}
                          ${isToday ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                          hover:ring-2 hover:ring-gray-400 hover:ring-offset-1
                        `}
                        onMouseEnter={(e) => {
                          if (!isFutureDate) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredCell({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">Ít hơn</div>
        <div className="flex items-center gap-1">
          <div className="w-[10px] h-[10px] rounded-sm bg-gray-100"></div>
          <div className="w-[10px] h-[10px] rounded-sm bg-emerald-200"></div>
          <div className="w-[10px] h-[10px] rounded-sm bg-emerald-400"></div>
          <div className="w-[10px] h-[10px] rounded-sm bg-emerald-500"></div>
          <div className="w-[10px] h-[10px] rounded-sm bg-emerald-600"></div>
        </div>
        <div className="text-sm text-gray-600">Nhiều hơn</div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 10,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold">{hoveredCell.count} hoạt động</div>
          <div className="text-gray-300">
            {hoveredCell.date.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      )}
    </div>
  );
}
