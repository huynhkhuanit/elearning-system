"use client";

import { ActivityDay } from "@/types/profile";
import { useState } from "react";

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
    year = new Date().getFullYear(),
}: ActivityHeatmapProps) {
    const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Create activity map for quick lookup
    const activityMap = new Map<string, ActivityDay>();
    activities.forEach((activity) => {
        activityMap.set(activity.date, activity);
    });

    // Calculate date range (last 12 months)
    const today = new Date();
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 12);
    startDate.setDate(startDate.getDate() + 1); // Start from 12 months ago + 1 day

    // Find the Sunday before start date (GitHub starts weeks on Sunday)
    const firstSunday = new Date(startDate);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

    // Build weeks array (7 days per week, Sunday to Saturday)
    const weeks: (ActivityDay | null)[][] = [];
    let currentWeek: (ActivityDay | null)[] = [];
    let currentDate = new Date(firstSunday);

    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const activity = activityMap.get(dateStr);

        // Only add activities within our date range
        if (currentDate >= startDate && currentDate <= endDate) {
            if (activity) {
                currentWeek.push(activity);
            } else {
                // Create a default activity with 0 count
                currentWeek.push({
                    date: dateStr,
                    count: 0,
                    level: 0,
                });
            }
        } else {
            currentWeek.push(null); // Outside range
        }

        // If Saturday (end of week), push week and start new one
        if (currentDate.getDay() === 6) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Push remaining days if any
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    // Get color based on activity level - GitHub green palette
    const getColor = (level: number): string => {
        const colors = {
            0: "#ebedf0", // No activity
            1: "#9be9a8", // Low
            2: "#40c463", // Medium
            3: "#30a14e", // High
            4: "#216e39", // Very high
        };
        return colors[level as keyof typeof colors] || colors[0];
    };

    const handleMouseEnter = (
        activity: ActivityDay,
        event: React.MouseEvent
    ) => {
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

    // Month labels
    const months = [
        "Th1",
        "Th2",
        "Th3",
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
    ];

    // Get month labels positioned correctly
    const getMonthLabels = () => {
        const labels: { month: string; weekIndex: number }[] = [];
        let lastMonth = -1;

        weeks.forEach((week, weekIndex) => {
            const firstDay = week.find((day) => day !== null);
            if (firstDay) {
                const date = new Date(firstDay.date);
                const month = date.getMonth();

                // Only show if it's a new month and we have at least 2 weeks visible
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-900">
                    <span className="bg-gradient-to-r font-[900] from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {totalCount}
                    </span>{" "}
                    hoạt động trong{" "}
                    <span className="bg-gradient-to-r font-[900] from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        12
                    </span>{" "}
                    tháng qua
                </h3>
            </div>

            {/* Grid container with overflow scroll */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Month labels */}
                    <div
                        className="relative mb-2"
                        style={{ paddingLeft: "30px", height: "15px" }}
                    >
                        {monthLabels.map(({ month, weekIndex }) => (
                            <span
                                key={`${month}-${weekIndex}`}
                                className="absolute text-xs text-gray-600"
                                style={{
                                    left: `${weekIndex * 13 + 30}px`,
                                }}
                            >
                                {month}
                            </span>
                        ))}
                    </div>

                    {/* Grid with day labels and activity cells */}
                    <div className="flex gap-1">
                        {/* Day labels on the left */}
                        <div
                            className="flex flex-col justify-around text-xs text-gray-600 pr-1"
                            style={{ width: "28px" }}
                        >
                            <div style={{ height: "10px" }}></div> {/* Sun */}
                            <div>T2</div>
                            <div style={{ height: "10px" }}></div> {/* Tue */}
                            <div>T4</div>
                            <div style={{ height: "10px" }}></div> {/* Thu */}
                            <div>T6</div>
                            <div style={{ height: "10px" }}></div> {/* Sat */}
                        </div>

                        {/* Activity cells grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, weekIndex) => (
                                <div
                                    key={weekIndex}
                                    className="flex flex-col gap-[3px]"
                                >
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={`rounded-sm transition-all ${
                                                day
                                                    ? "cursor-pointer hover:ring-2 hover:ring-gray-400"
                                                    : ""
                                            }`}
                                            style={{
                                                width: "10px",
                                                height: "10px",
                                                backgroundColor: day
                                                    ? getColor(day.level)
                                                    : "#ebedf0",
                                                opacity: day === null ? 0 : 1,
                                            }}
                                            onMouseEnter={(e) =>
                                                day && handleMouseEnter(day, e)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs">
                <div className="text-gray-600">
                    <span className="font-semibold text-orange-600">
                        🔥 {currentStreak} ngày
                    </span>{" "}
                    chuỗi học tập
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 text-gray-600">
                    <span>Ít</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className="rounded-sm"
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: getColor(level),
                                }}
                            />
                        ))}
                    </div>
                    <span>Nhiều</span>
                </div>
            </div>

            {/* Tooltip */}
            {hoveredDay && (
                <div
                    className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-md shadow-lg pointer-events-none whitespace-nowrap"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: "translate(-50%, -100%)",
                    }}
                >
                    <div className="text-xs font-semibold mb-0.5">
                        {hoveredDay.count} hoạt động
                    </div>
                    <div className="text-xs text-gray-300">
                        {new Date(hoveredDay.date).toLocaleDateString("vi-VN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
