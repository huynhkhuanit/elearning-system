import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Học tập - DHV LearnX",
  description: "Nền tảng học lập trình trực tuyến",
};

export default function LearnCourseLayout({ children }: { children: ReactNode }) {
  // Layout cho trang học tập - không cần html/body vì đã có ở root layout
  // LayoutWrapper sẽ xử lý việc ẩn Menu, Header, Footer
  return <>{children}</>;
}
