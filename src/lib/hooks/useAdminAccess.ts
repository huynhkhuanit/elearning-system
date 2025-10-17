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
 * Nếu không, redirect về home
 */
export function useAdminAccess() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        router.replace('/auth/login');
        return;
      }

      const responseData = await response.json();
      const userData = responseData.data?.user;
      
      if (!userData) {
        router.replace('/auth/login');
        return;
      }

      const userRole = userData.role?.toLowerCase();

      // Chỉ admin hoặc teacher mới được phép
      if (userRole === 'admin' || userRole === 'teacher') {
        setUser(userData);
        setHasAccess(true);
      } else {
        console.warn('User role is not admin/teacher:', userRole);
        router.replace('/');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.replace('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, hasAccess };
}
