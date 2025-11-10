"use client";

import { ChevronDown, ChevronRight, BookOpen, Clock, X, CheckCircle, FileText, Flag, PlayCircle } from "lucide-react";

interface LearnCourseSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  currentLesson: any;
  expandedSections: Set<string>;
  toggleSection: (sectionId: string) => void;
  handleLessonClick: (lesson: any) => void;
  isFree: boolean;
  codePlaygroundOpen?: boolean;
}

export default function LearnCourseSidebar({
  isOpen,
  onClose,
  course,
  currentLesson,
  expandedSections,
  toggleSection,
  handleLessonClick,
  isFree,
  codePlaygroundOpen = false,
}: LearnCourseSidebarProps) {
  const isDarkTheme = !isFree;
  const sidebarBgClass = isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <Flag className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  if (!course) return null;

  return (
    <aside
      className={`learn-course-sidebar ${sidebarBgClass} border-l ${isOpen ? "open" : ""} ${codePlaygroundOpen ? "code-playground-open" : ""}`}
    >
        <div className={`learn-course-sidebar-content p-5 border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"} flex-shrink-0`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${isDarkTheme ? "text-gray-200" : "text-gray-900"}`}>
              Nội dung khoá học
            </h2>
            <button
              onClick={onClose}
              className={`transition-colors ${isDarkTheme ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-900"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex items-center space-x-4 text-sm ${isDarkTheme ? "text-gray-500" : "text-gray-600"}`}>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLessons} bài học</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.totalDuration}</span>
            </div>
          </div>
        </div>

        {/* Sections & Lessons */}
        <div className="learn-course-sidebar-content flex-1 overflow-y-auto custom-scrollbar">
          {course.sections.map((section: any, sectionIndex: number) => (
            <div key={section.id} className={`border-b ${isDarkTheme ? "border-gray-700" : "border-gray-200"}`}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-5 py-4 flex items-center justify-between transition-colors ${
                  isDarkTheme ? "hover:bg-gray-700/50" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full ${
                      isDarkTheme ? "bg-gray-700 text-orange-400" : "bg-indigo-100 text-indigo-600"
                    } flex items-center justify-center text-sm font-bold`}
                  >
                    {sectionIndex + 1}
                  </span>
                  <div className="text-left">
                    <h3 className={`font-semibold text-sm ${isDarkTheme ? "text-gray-200" : "text-gray-900"}`}>
                      {section.title}
                    </h3>
                    <p className={`text-xs ${isDarkTheme ? "text-gray-500" : "text-gray-500"}`}>
                      {section.lessons.length} bài học • {section.duration}
                    </p>
                  </div>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`} />
                ) : (
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`} />
                )}
              </button>

              {expandedSections.has(section.id) && (
                <div className={isDarkTheme ? "bg-gray-900/50" : "bg-gray-50"}>
                  {section.lessons.map((lesson: any, lessonIndex: number) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full px-5 py-3 flex items-center space-x-3 transition-colors border-r-4 ${
                        currentLesson?.id === lesson.id
                          ? isDarkTheme
                            ? "bg-orange-500/10 border-orange-500"
                            : "bg-indigo-50 border-indigo-600"
                          : `${isDarkTheme ? "hover:bg-gray-700/30 border-transparent" : "hover:bg-gray-100 border-transparent"}`
                      }`}
                    >
                      <span className={`flex-shrink-0 text-xs font-medium w-6 ${isDarkTheme ? "text-gray-500" : "text-gray-600"}`}>
                        {sectionIndex + 1}.{lessonIndex + 1}
                      </span>
                      <div className="flex-shrink-0">
                        {lesson.isCompleted ? (
                          <CheckCircle className={`w-5 h-5 ${isDarkTheme ? "text-green-400" : "text-emerald-500"}`} />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${isDarkTheme ? "border-gray-600" : "border-gray-400"}`}></div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className={`text-sm font-medium ${
                            currentLesson?.id === lesson.id
                              ? isDarkTheme
                                ? "text-orange-400"
                                : "text-indigo-600"
                              : isDarkTheme
                                ? "text-gray-400"
                                : "text-gray-700"
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <div className={isDarkTheme ? "text-gray-600" : "text-gray-500"}>{getLessonIcon(lesson.type)}</div>
                          <span className={`text-xs ${isDarkTheme ? "text-gray-600" : "text-gray-600"}`}>{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
  );
}

