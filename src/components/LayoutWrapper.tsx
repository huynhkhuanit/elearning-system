"use client";

import { usePathname } from "next/navigation";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Kiểm tra nếu đang ở trang học tập (/learn/*)
  const isLearningPage = pathname?.startsWith("/learn/");
  
  // Kiểm tra nếu đang ở trang admin (/admin/*)
  const isAdminPage = pathname?.startsWith("/admin/");

  // Nếu là trang học tập hoặc admin, không hiển thị Menu, Header, Footer
  if (isLearningPage || isAdminPage) {
    return (
      <div className="bg-gray-900 min-h-screen">
        {children}
      </div>
    );
  }

  // Các trang khác hiển thị layout bình thường
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Menu />
      <Header />
      <main style={{ backgroundColor: '#ffffff', marginLeft: '96px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
