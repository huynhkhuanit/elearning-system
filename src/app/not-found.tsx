"use client";

import { Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

export default function NotFound() {
  // Reset scroll position khi vào trang 404
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Clear any search params nếu có
    if (window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Image - Kích thước tối ưu */}
          <div className="relative w-full max-w-md mx-auto mb-6">
            <Image
              src="/assets/img/not_found_img.jpg"
              alt="404 Error - Page Not Found"
              width={400}
              height={300}
              className="w-full h-auto rounded-xl shadow-lg"
              priority
            />
          </div>

          {/* Error Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-[900] text-gray-900 mb-3"
          >
            Oops! Trang không tồn tại
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed"
          >
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </motion.p>

          {/* Action Buttons - Kích thước vừa phải */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
            >
              <Home className="w-4 h-4" />
              Về trang chủ
            </Link>

            <Link
              href="/roadmap"
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Link>
          </motion.div>

          {/* Helpful Links - Đơn giản hơn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-6 border-t border-gray-200"
          >
            <p className="text-xs text-gray-500 mb-3">
              Có thể bạn đang tìm kiếm:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/roadmap"
                className="px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-xs font-medium"
              >
                Lộ trình học tập
              </Link>
              <Link
                href="/articles"
                className="px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-xs font-medium"
              >
                Bài viết
              </Link>
              <Link
                href="/qa"
                className="px-4 py-1.5 bg-gray-50 text-gray-700 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-xs font-medium"
              >
                Hỏi đáp
              </Link>
            </div>
          </motion.div>

          {/* Contact Support - Nhỏ gọn */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-xs text-gray-400">
              Cần hỗ trợ?{" "}
              <a
                href="mailto:huynhkhuanit@gmail.com"
                className="text-indigo-600 hover:text-indigo-700 font-medium underline"
              >
                Liên hệ với chúng tôi
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
