"use client"

import { MessageCircleQuestion } from "lucide-react"
import { useState } from "react"

interface LessonQAButtonProps {
  onClick: () => void
  unreadCount?: number
}

export default function LessonQAButton({ onClick, unreadCount = 0 }: LessonQAButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-6 bottom-6 z-50 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl shadow-indigo-500/30 transition-all duration-300 transform hover:scale-110 group"
      aria-label="Mở hỏi đáp"
    >
      <div className="relative">
        <MessageCircleQuestion className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* Tooltip */}
      <div
        className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-xl transition-all duration-200 border border-slate-700 ${
          isHovered ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        Hỏi & Đáp
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-800"></div>
      </div>
    </button>
  )
}
