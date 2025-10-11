"use client";

import { Search, X, Sun, Moon, User, LogOut, FileText, Bookmark, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng menu khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    toast.success("Đăng xuất thành công! Hẹn gặp lại bạn.");
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b border-border sticky top-0 z-50" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto px-[28px] h-[66px] flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center transition-all duration-200 cursor-pointer">
            <img 
              src="/assets/img/logo.png" 
              alt="DHV LearnX Logo" 
              width={38}
              height={38}
              style={{ objectFit: 'contain' }}
              className="w-[38px] h-[38px] rounded-lg"
            />
          </Link>
          <div className="hidden sm:block">
            <Link href="/" className="text-2xl font-[900] text-foreground transition-colors duration-200 hover:text-primary">
              LearnX
            </Link>
            <p className="text-small text-muted-foreground">Nền tảng học lập trình trực tuyến</p>
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
          <Link href="/search" className="lg:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted transition-all duration-200 cursor-pointer">
            <Search className="h-5 w-5" />
          </Link>

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
            {isLoading ? (
              // Loading skeleton - tránh flash
              <div className="flex items-center gap-2">
                <div className="w-32 h-10 bg-gray-100 rounded-full animate-pulse"></div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User Info Header - 2 Columns */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-start gap-3">
                          {/* Avatar Column */}
                          <div className="flex-shrink-0 relative">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                {user.full_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {user.membership_type === 'PRO' && (
                              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold border-2 border-white">
                                PRO
                              </div>
                            )}
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</p>
                            <p style={{ fontSize: '14px' }} className="text-gray-500 truncate">@{user.username}</p>
                          </div>
                        </div>
                      </div>

                      {/* Main Menu Items */}
                      <div className="py-1">
                        <Link
                          href={`/${user.username}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Trang cá nhân</span>
                        </Link>
                        <Link
                          href="/write"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Viết blog</span>
                        </Link>
                        <Link
                          href="/my-posts"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FileText className="w-4 h-4" />
                          <span>Bài viết của tôi</span>
                        </Link>
                        <Link
                          href="/saved"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Bài viết đã lưu</span>
                        </Link>
                      </div>

                      {/* Settings & Logout */}
                      <div className="border-t border-gray-100 py-1">
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 rounded-full cursor-pointer"
                >
                  Đăng ký
                </button>

                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg cursor-pointer"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
}