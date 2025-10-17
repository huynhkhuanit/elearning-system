# Real-Time Authentication Updates

## Problem Solved ✅
Menu component không tự động cập nhật khi user đăng nhập/đăng xuất. Cần phải F5 trang để menu hiển thị admin button.

## Solution
Thay vì fetch role một lần trong Menu component, sử dụng **AuthContext** (React Context) để:
1. **Centralize auth state** - một nguồn sự thật duy nhất
2. **Auto-update** - khi AuthContext thay đổi, tất cả components dùng `useAuth()` sẽ re-render
3. **Real-time sync** - không cần F5 trang

## Changes Made

### 1. **`src/types/auth.ts`** - Thêm role field
```typescript
export interface PublicUser {
  // ... existing fields
  role?: string;  // ← NEW: Support admin/teacher roles
}
```

### 2. **`src/contexts/AuthContext.tsx`** - Enhanced login flow
```typescript
const login = async (email: string, password: string) => {
  // ... login logic
  
  // ← NEW: Refresh to get full user data including role
  await checkAuth();
};
```

**Lợi ích:**
- Login → gọi `checkAuth()` → fetch `/api/auth/me` → lấy full user data kể cả role
- Tất cả subscribers của AuthContext sẽ tự động re-render

### 3. **`src/components/Menu.tsx`** - Use AuthContext
```typescript
export default function Menu() {
  // ← CHANGED: From manual fetch to useAuth hook
  const { user } = useAuth();
  
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'teacher';
  // ...
}
```

**Trước:** Fetch một lần onMount, không update
```typescript
// OLD - Static fetch
useEffect(() => {
  const fetchUserRole = async () => { /* ... */ };
  fetchUserRole();
}, []);
```

**Sau:** Subscribe to AuthContext, auto-update
```typescript
// NEW - Reactive
const { user } = useAuth(); // auto-update khi user thay đổi
```

### 4. **`src/lib/hooks/useAdminAccess.ts`** - Use AuthContext
```typescript
export function useAdminAccess() {
  // ← CHANGED: From manual fetch to useAuth
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
  
  // Sync với AuthContext state
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !authUser) {
      router.replace('/auth/login');
      return;
    }
    // ...
  }, [authLoading, isAuthenticated, authUser]);
}
```

## Flow Diagram

### Before (Static, Manual Fetch)
```
User Login
  ↓
/api/auth/login → Set user in Menu.tsx (local state)
  ↓
Menu component renders once with user
  ↓
User logs out
  ↓
localStorage cleared BUT Menu still shows user (stale)
  ↓
F5 refresh needed ❌
```

### After (Real-time, Context-based)
```
User Login
  ↓
/api/auth/login → AuthContext.login()
  ↓
AuthContext calls checkAuth() → /api/auth/me → Full user with role
  ↓
AuthContext updates user state
  ↓
ALL components using useAuth() re-render automatically ✅
  ├─ Menu: Shows/hides Admin button
  ├─ useAdminAccess hook: Checks access
  └─ Any other component subscribing to auth
  ↓
User logs out
  ↓
AuthContext.logout() → clears user state
  ↓
ALL components re-render with user=null ✅
  ├─ Menu: Admin button disappears
  ├─ Admin pages: redirect to login
  └─ All auth-dependent UI updates instantly
```

## Testing

### ✅ Test Login
1. Trên public page, click "Đăng nhập"
2. Login với `huynhkhuanit` (TEACHER)
3. **Expected:** Admin button xuất hiện ngay trên menu (không cần F5)
4. Click Admin button → Vào trang admin

### ✅ Test Logout
1. Khi đã login, click logout button
2. **Expected:** Admin button biến mất ngay (không cần F5)
3. Menu chỉ hiển thị 4 item: Home, Roadmap, Articles, Q&A

### ✅ Test Non-Admin User
1. Logout
2. Login với `minHun` (USER role)
3. **Expected:** Admin button không xuất hiện
4. Nếu access `/admin/lessons` trực tiếp → Thấy lock icon

### ✅ Test Tab Sync (Bonus)
1. Mở 2 tab cùng 1 trang
2. Tab 1: Logout
3. Tab 2: **Tự động cập nhật** (Admin button biến mất)
   - *(Tùy chọn: Có thể thêm localStorage listener để sync cross-tab)*

## Performance Notes

- ✅ **Efficient**: Menu không fetch riêng, dùng AuthContext cache
- ✅ **Secure**: Role lấy từ `/api/auth/me` (verified by server)
- ✅ **Real-time**: React Context triggers re-render tự động
- ⚠️ **Trade-off**: Extra API call khi login (to get full user data) - nhưng giá trị như nhau

## Future Improvements

1. **Cross-tab sync** - Sync auth state giữa các tabs (localStorage event listener)
2. **Optimistic updates** - Predict admin role locally untuk UX instant
3. **Role caching** - Store role in localStorage với TTL
4. **Provider separation** - Tách AuthProvider ra separate context cho clarity
