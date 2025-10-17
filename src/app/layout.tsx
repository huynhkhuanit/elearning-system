import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DHV LearnX - Nền tảng học lập trình trực tuyến",
  description: "Nền tảng học lập trình hiện đại với giao diện tối ưu và trải nghiệm người dùng tuyệt vời",
  keywords: ["học lập trình", "lập trình trực tuyến", "khóa học lập trình", "react", "nextjs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ToastProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              forcedTheme="light"
              enableSystem={false}
              enableColorScheme={false}
            >
              <LayoutWrapper>{children}</LayoutWrapper>
            </ThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
