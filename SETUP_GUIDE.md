# 🚀 Hướng dẫn Setup Database và Test Authentication

## Bước 1: Cấu hình `.env.local`

Mở file `.env.local` và cập nhật thông tin database MySQL của bạn:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=learning_platform_db

# JWT Secret (Tạo một chuỗi ngẫu nhiên dài ít nhất 32 ký tự)
JWT_SECRET=dhvlearnx-super-secret-jwt-key-2025-change-in-production
JWT_EXPIRES_IN=7d

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Bước 2: Test Database Connection

Tạo một test user để kiểm tra:

### Option 1: Sử dụng UI (Khuyến nghị)

1. Chạy dev server:
```bash
pnpm dev
```

2. Mở trình duyệt: `http://localhost:3000/auth/register`

3. Đăng ký tài khoản mới với thông tin:
   - Họ và tên: `Nguyễn Văn A`
   - Tên đăng nhập: `nguyenvana`
   - Email: `test@dhvlearnx.com`
   - Mật khẩu: `Test123456` (phải có chữ hoa, chữ thường, số)

4. Sau khi đăng ký thành công, đăng nhập tại: `http://localhost:3000/auth/login`

### Option 2: Sử dụng API trực tiếp

**Test Register API:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dhvlearnx.com",
    "password": "Test123456",
    "username": "testuser",
    "full_name": "Test User"
  }'
```

**Test Login API:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@dhvlearnx.com",
    "password": "Test123456"
  }'
```

## Bước 3: Kiểm tra Database

Vào MySQL và kiểm tra user đã được tạo:

```sql
USE learning_platform_db;

-- Xem tất cả users
SELECT id, email, username, full_name, membership_type, is_active, created_at 
FROM users;

-- Kiểm tra user vừa tạo
SELECT * FROM users WHERE email = 'test@dhvlearnx.com';
```

## Bước 4: Test Authentication Flow

### 1. Đăng ký (Register)
- ✅ Validate email format
- ✅ Validate password strength (min 6 chars, uppercase, lowercase, number)
- ✅ Validate username (min 3 chars, alphanumeric + underscore)
- ✅ Check email/username đã tồn tại
- ✅ Hash password với bcrypt
- ✅ Insert vào database

### 2. Đăng nhập (Login)
- ✅ Validate credentials
- ✅ Check account is_active
- ✅ Compare password hash
- ✅ Generate JWT token
- ✅ Set HTTP-only cookie
- ✅ Return user data

### 3. Get Current User
- ✅ Verify JWT token
- ✅ Get user from database
- ✅ Return user data

### 4. Logout
- ✅ Clear auth cookie
- ✅ Redirect to home

## Bước 5: Test Protected Routes (Sắp tới)

Sau này khi implement protected routes:

```tsx
// Example: Protected Course Page
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function CoursePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Course Content</div>;
}
```

## 🎯 Checklist Test

- [ ] Database connection thành công
- [ ] Đăng ký user mới thành công
- [ ] Email/Username duplicate được validate
- [ ] Password được hash trong database
- [ ] Đăng nhập thành công
- [ ] JWT token được tạo
- [ ] Cookie được set
- [ ] User info hiển thị trong Header
- [ ] Dropdown menu user hoạt động
- [ ] Logout thành công
- [ ] Cookie được xóa sau logout

## 🐛 Common Issues

### 1. Database Connection Failed
```
Error: ER_ACCESS_DENIED_ERROR
```
**Solution:** Kiểm tra lại username/password MySQL trong `.env.local`

### 2. Database Not Found
```
Error: ER_BAD_DB_ERROR
```
**Solution:** Đảm bảo database `learning_platform_db` đã được tạo từ SQL schema

### 3. JWT Token Invalid
```
Error: Token verification failed
```
**Solution:** Kiểm tra `JWT_SECRET` trong `.env.local` phải giống nhau

### 4. CORS Error
```
Error: CORS policy blocked
```
**Solution:** Đảm bảo `NEXT_PUBLIC_APP_URL` đúng trong `.env.local`

## 📊 Database Schema Summary

**users table fields:**
- `id`: UUID primary key
- `email`: Unique, indexed
- `password_hash`: Bcrypt hashed password
- `username`: Unique username
- `full_name`: User's full name
- `membership_type`: FREE or PRO
- `is_active`: Account status
- `is_verified`: Email verification status
- `learning_streak`: Consecutive learning days
- `total_study_time`: Total minutes studied

## 🔐 Security Features

✅ **Password Hashing**: bcrypt with salt rounds  
✅ **JWT Tokens**: Signed tokens with expiration  
✅ **HTTP-Only Cookies**: Prevent XSS attacks  
✅ **Input Validation**: Zod schema validation  
✅ **SQL Injection Prevention**: Parameterized queries  
✅ **CSRF Protection**: SameSite cookie attribute  

## 📈 Next Steps

1. ✅ ~~Setup Database Connection~~
2. ✅ ~~Implement Authentication~~
3. 🔄 Test all flows thoroughly
4. ⏭️ Implement Email Verification
5. ⏭️ Add Forgot Password
6. ⏭️ Create User Profile Page
7. ⏭️ Implement Protected Routes
8. ⏭️ Add Course Enrollment System

---

**Congratulations!** 🎉 Authentication system đã sẵn sàng!
