# 🧪 Hướng dẫn Test Bug Fix - Settings Page

## ✅ Bug đã khắc phục

**Vấn đề:** Khi user đã đăng nhập, vào trang `/settings` và nhấn F5 (refresh), trang bị redirect về `/auth/login`.

**Nguyên nhân:** useEffect không check `isLoading` trước khi redirect, gây race condition khi refresh page.

**Giải pháp:** Thêm check `authLoading` vào logic redirect + hiển thị loading UI.

---

## 🚀 Hướng dẫn chạy và test

### Bước 1: Chạy development server

```powershell
cd e:\DHV\school_year_4\semester_1\04097_DoAnChuyenNganh\src\dhvlearnx
pnpm dev
```

### Bước 2: Test case chính - Refresh settings page

1. Mở trình duyệt: http://localhost:3000
2. Đăng nhập với tài khoản hợp lệ
3. Vào Settings: Click avatar → "Cài đặt" hoặc truy cập `/settings`
4. **Nhấn F5 để refresh trang**

**Kết quả mong đợi:**
- ✅ Thấy loading spinner trong 0.5-1 giây
- ✅ Trang settings load bình thường
- ✅ KHÔNG bị redirect về `/auth/login`
- ✅ Form hiển thị đầy đủ thông tin user

**Kết quả trước khi fix:**
- ❌ Redirect về `/auth/login`
- ❌ Sau đó back về trang chủ
- ❌ Không thể vào settings

### Bước 3: Test các edge cases

#### Test 3.1: Mạng chậm
1. Mở Chrome DevTools (F12)
2. Chọn tab Network
3. Chọn "Slow 3G" từ dropdown
4. Refresh trang settings
5. Kiểm tra: Loading spinner hiển thị lâu hơn nhưng vẫn không redirect

#### Test 3.2: Chưa đăng nhập
1. Logout khỏi hệ thống
2. Truy cập trực tiếp: http://localhost:3000/settings
3. Kiểm tra: Redirect về `/auth/login` (đúng hành vi)

#### Test 3.3: Token hết hạn
1. Đăng nhập bình thường
2. Xóa cookie `auth_token` (DevTools → Application → Cookies)
3. Refresh trang settings
4. Kiểm tra: Redirect về `/auth/login` (đúng hành vi)

---

## 📝 Checklist Test

```
[ ] Test 1: Refresh settings page khi đã đăng nhập
    [ ] Thấy loading spinner
    [ ] Không bị redirect
    [ ] Data load đầy đủ

[ ] Test 2: Truy cập settings khi chưa đăng nhập
    [ ] Redirect về login đúng cách

[ ] Test 3: Test với mạng chậm
    [ ] Loading spinner hoạt động
    [ ] Không có race condition

[ ] Test 4: Token hết hạn
    [ ] Redirect về login

[ ] Test 5: Các tab trong settings
    [ ] Tất cả tabs hoạt động bình thường
    [ ] Form submit không bị lỗi
```

---

## 🔧 Nếu gặp vấn đề

### Vấn đề 1: "Cannot connect to database"
**Giải pháp:** Đảm bảo MySQL đang chạy và file `.env` có cấu hình đúng.

### Vấn đề 2: Vẫn bị redirect sau khi fix
**Giải pháp:** 
1. Clear browser cache
2. Restart dev server
3. Kiểm tra lại code trong `src/app/settings/page.tsx`

### Vấn đề 3: Loading spinner không hiện
**Giải pháp:** Check console log, có thể auth check quá nhanh (< 100ms).

---

## 📊 So sánh code

### BEFORE (BUG):
```typescript
const { user, isAuthenticated } = useAuth(); // ❌ Thiếu isLoading

useEffect(() => {
  if (!isAuthenticated) {  // ❌ Không check loading
    router.push('/auth/login');
    return;
  }
}, [user?.username, isAuthenticated, router]);

if (!user) {
  return null; // ❌ Không có loading UI
}
```

### AFTER (FIXED):
```typescript
const { user, isAuthenticated, isLoading: authLoading } = useAuth(); // ✅

useEffect(() => {
  if (!authLoading && !isAuthenticated) {  // ✅ Check loading first
    router.push('/auth/login');
    return;
  }
}, [user?.username, isAuthenticated, authLoading, router]); // ✅

if (authLoading) {  // ✅ Loading UI
  return <LoadingSpinner />;
}

if (!user) {
  return null;
}
```

---

## 📌 Files đã thay đổi

1. `src/app/settings/page.tsx` - Main fix
2. `BUG_FIX_SUMMARY.md` - Báo cáo chi tiết
3. `TESTING_GUIDE.md` - File này

---

**Status:** ✅ FIXED  
**Test:** Chờ bạn test  
**Next:** Có thể áp dụng pattern này cho các protected pages khác nếu cần
