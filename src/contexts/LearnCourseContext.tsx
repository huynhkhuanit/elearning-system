"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LearnCourseContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  course: any;
  setCourse: (course: any) => void;
  currentLesson: any;
  setCurrentLesson: (lesson: any) => void;
  expandedSections: Set<string>;
  setExpandedSections: (sections: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  toggleSection: (sectionId: string) => void;
  handleLessonClick: (lesson: any) => void;
  isFree: boolean;
  setIsFree: (isFree: boolean) => void;
}

const LearnCourseContext = createContext<LearnCourseContextType | undefined>(undefined);

export function LearnCourseProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isFree, setIsFree] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson(lesson);
    // Sidebar will remain open - only closes when user clicks close button or toggle icon
  };

  return (
    <LearnCourseContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        course,
        setCourse,
        currentLesson,
        setCurrentLesson,
        expandedSections,
        setExpandedSections,
        toggleSection,
        handleLessonClick,
        isFree,
        setIsFree,
      }}
    >
      {children}
    </LearnCourseContext.Provider>
  );
}

export function useLearnCourse() {
  const context = useContext(LearnCourseContext);
  if (context === undefined) {
    throw new Error("useLearnCourse must be used within a LearnCourseProvider");
  }
  return context;
}

