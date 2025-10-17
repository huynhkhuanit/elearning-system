"use client";

import { Home, BookOpen, MessageCircle, Menu as MenuIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const publicMenuItems: MenuItem[] = [
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

const adminMenuItem: MenuItem = {
  id: "admin",
  icon: SettingsIcon,
  label: "Admin",
  href: "/admin/lessons",
};

export default function Menu() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const responseData = await response.json();
          const role = responseData.data?.user?.role;
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const isAdmin = userRole?.toLowerCase() === 'admin' || userRole?.toLowerCase() === 'teacher';
  const menuItems = isAdmin ? [...publicMenuItems, adminMenuItem] : publicMenuItems;

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col items-center justify-start pt-20 px-2 border-r border-gray-200"
      style={{
        backgroundColor: '#ffffff',
        width: '96px',
        zIndex: 40,
      }}
    >
      {/* Navigation Menu */}
      <nav className="flex flex-col items-start space-y-2 w-full">
        {menuItems.map((item: MenuItem) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          // Highlight admin item differently
          const isAdminItem = item.id === 'admin';

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group flex flex-col items-center justify-center w-full py-3 px-2 rounded-lg
                transition-all duration-200 cursor-pointer
                ${isActive
                  ? isAdminItem 
                    ? 'bg-purple-500/15 text-purple-600'
                    : 'bg-primary/10 text-primary'
                  : isAdminItem
                    ? 'text-muted-foreground hover:text-purple-600 hover:bg-purple-500/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }
              `}
              title={item.label}
            >
              <Icon
                className={`
                  h-5 w-5 mb-1 transition-colors duration-200 flex-shrink-0
                  ${isActive
                    ? isAdminItem
                      ? 'text-purple-600'
                      : 'text-primary'
                    : isAdminItem
                      ? 'text-muted-foreground group-hover:text-purple-600'
                      : 'text-muted-foreground group-hover:text-foreground'
                  }
                `}
              />
              <span
                className={`
                  text-xs font-medium transition-colors duration-200 text-center leading-tight
                  ${isActive
                    ? isAdminItem
                      ? 'text-purple-600'
                      : 'text-primary'
                    : isAdminItem
                      ? 'text-muted-foreground group-hover:text-purple-600'
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
