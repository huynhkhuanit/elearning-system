import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";

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
      <body className="antialiased" style={{ backgroundColor: '#ffffff' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          enableColorScheme={false}
        >
          <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}