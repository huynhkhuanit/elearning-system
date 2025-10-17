import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  full_name: string;
}

/**
 * Hook để kiểm tra xem user có phải admin/teacher không
 * Không redirect, chỉ trả về hasAccess status
 * Component sẽ hiển thị lock icon nếu user không có quyền
 */
export function useAdminAccess() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        // Chưa đăng nhập - redirect về login
        router.replace('/auth/login');
        setLoading(false);
        return;
      }

      const responseData = await response.json();
      const userData = responseData.data?.user;
      
      if (!userData) {
        // Không có user data - redirect về login
        router.replace('/auth/login');
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      const userRole = userData.role?.toLowerCase();

      // Chỉ admin hoặc teacher mới có access
      if (userRole === 'admin' || userRole === 'teacher') {
        setUser(userData);
        setHasAccess(true);
      } else {
        // User đã đăng nhập nhưng không có quyền - vẫn hiển thị trang với lock icon
        setUser(userData);
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.replace('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, hasAccess, isAuthenticated };
}
