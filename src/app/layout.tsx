import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

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
      <body className="antialiased bg-background text-foreground">
        <ToastProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
              disableTransitionOnChange={false}
            >
              <div className="bg-background min-h-screen">
                <Menu />
                <Header />
                <main className="bg-background ml-24">
                  {children}
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
