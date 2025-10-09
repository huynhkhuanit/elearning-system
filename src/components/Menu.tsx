"use client";

import { Home, BookOpen, MessageCircle, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    id: "home",
    icon: Home,
    label: "Trang chủ",
    href: "/",
  },
  {
    id: "roadmap",
    icon: MenuIcon,
    label: "Lộ trình",
    href: "/roadmap",
  },
  {
    id: "articles",
    icon: BookOpen,
    label: "Bài viết",
    href: "/articles",
  },
  {
    id: "qa",
    icon: MessageCircle,
    label: "Hỏi đáp",
    href: "/qa",
  },
];

export default function Menu() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  // Placeholder avatar for non-authenticated users
  const avatarUrl = user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col items-center justify-start pt-20 px-2 border-r border-gray-200"
      style={{
        backgroundColor: '#ffffff',
        width: '96px',
        zIndex: 40,
      }}
    >
      {/* User Avatar Section - Simple display only */}
      <div className="w-full flex flex-col items-center mb-6">
        <Link
          href={isAuthenticated && user ? `/${user.username}` : "/auth/login"}
          className="relative group cursor-pointer"
          title={user ? user.full_name : "Đăng nhập"}
        >
          <div className="relative">
            <img
              src={avatarUrl}
              alt={user?.full_name || "User Avatar"}
              className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-primary transition-all duration-200 object-cover"
            />
            {user?.membership_type === 'PRO' && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                ⭐
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col items-start space-y-2 w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group flex flex-col items-center justify-center w-full py-3 px-2 rounded-lg
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }
              `}
              title={item.label}
            >
              <Icon
                className={`
                  h-5 w-5 mb-1 transition-colors duration-200 flex-shrink-0
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                  }
                `}
              />
              <span
                className={`
                  text-xs font-medium transition-colors duration-200 text-center leading-tight
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground'
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
