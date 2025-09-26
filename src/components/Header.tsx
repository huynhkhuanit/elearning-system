"use client";

import { Search, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Handle search logic here
      console.log('Searching for:', searchValue);
    } else if (e.key === 'Escape') {
      clearSearch();
    }
  };

  return (
    <header className="border-b border-border sticky top-0 z-50" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <a href="/" className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
            <span className="text-white font-bold text-xl">DHV</span>
          </a>
          <div className="hidden sm:block">
            <a href="/" className="text-2xl font-bold text-foreground transition-colors duration-200 hover:text-primary">
              LearnX
            </a>
            <p className="text-xs text-muted-foreground">Nền tảng học lập trình trực tuyến</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, bài viết, video..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              aria-label="Tìm kiếm"
              className="w-full pl-12 pr-12 py-3 border border-border rounded-full text-card-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              style={{ backgroundColor: '#ffffff' }}
            />
            {searchValue && (
              <span
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={clearSearch}
                title="Xóa tìm kiếm"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-5 w-5" />
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mobile search button */}
          <a href="/" className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted transition-all duration-200 cursor-pointer">
            <Search className="h-5 w-5" />
          </a>

          {/* Theme Toggle - Vô hiệu hóa vì chỉ dùng light mode */}
          <motion.button
            onClick={() => {/* Không làm gì cả */}}
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Light mode"
            title="Light mode"
          >
            <motion.div
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          </motion.button>

          {/* Auth Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <a href="/" className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 rounded-full cursor-pointer">
              Đăng ký
            </a>

            <a href="/" className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg cursor-pointer">
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}