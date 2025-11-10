"use client";

import { ReactNode } from "react";
import { LearnCourseProvider } from "@/contexts/LearnCourseContext";

export default function LearnCourseLayout({ children }: { children: ReactNode }) {
  return (
    <LearnCourseProvider>
      {children}
    </LearnCourseProvider>
  );
}
