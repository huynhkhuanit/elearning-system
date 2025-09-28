"use client";

import { Home, BookOpen, MessageCircle, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col items-start justify-start pt-20 px-2"
      style={{
        backgroundColor: '#ffffff',
        width: '96px',
        zIndex: 40,
      }}
    >
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
                  ? 'bg-primary/10 text-primary border-r-2 border-primary'
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
