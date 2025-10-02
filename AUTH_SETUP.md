# Authentication System Setup Guide

## 🔐 Hệ thống Authentication đã được cài đặt thành công!

### ✅ Các tính năng đã implement:

1. **Database Connection**
   - MySQL 2 connection pool
   - Query helpers (query, queryOne, transaction)
   - Error handling

2. **API Routes**
   - `POST /api/auth/register` - Đăng ký tài khoản mới
   - `POST /api/auth/login` - Đăng nhập
   - `POST /api/auth/logout` - Đăng xuất
   - `GET /api/auth/me` - Lấy thông tin user hiện tại

3. **Security**
   - Password hashing với bcrypt
   - JWT token authentication
   - HTTP-only cookies
   - Input validation với Zod

4. **Frontend**
   - Auth Context Provider
   - Login Page (`/auth/login`)
   - Register Page (`/auth/register`)
   - Protected routes
   - User menu trong Header

---

## 📝 Hướng dẫn Setup

### 1. Cấu hình Database

Cập nhật file `.env.local` với thông tin MySQL của bạn:

\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=learning_platform_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d
\`\`\`

### 2. Import Database Schema

Chạy SQL schema đã được cung cấp trong MySQL:

\`\`\`bash
mysql -u root -p learning_platform_db < database_schema.sql
\`\`\`

### 3. Chạy Development Server

\`\`\`bash
pnpm dev
\`\`\`

---

## 🧪 Test Authentication

### Test Register API:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "username": "testuser",
    "full_name": "Test User"
  }'
\`\`\`

### Test Login API:
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
\`\`\`

### Test Get User API:
\`\`\`bash
curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  --cookie "auth_token=YOUR_TOKEN_HERE"
\`\`\`

---

## 📚 Sử dụng Auth trong Components

\`\`\`tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
\`\`\`

---

## 🔒 Security Best Practices

1. **Thay đổi JWT_SECRET** trong production
2. **Sử dụng HTTPS** khi deploy
3. **Enable CORS** chỉ cho trusted domains
4. **Rate limiting** cho API endpoints
5. **Email verification** cho user mới (TODO)
6. **2FA** cho security cao hơn (TODO)

---

## 🚀 Next Steps

- [ ] Implement email verification
- [ ] Add forgot password functionality
- [ ] Add social login (Google, Facebook)
- [ ] Add 2FA
- [ ] Add rate limiting
- [ ] Add user profile edit
- [ ] Add password change
- [ ] Add account deletion

---

## 📖 API Documentation

### POST /api/auth/register

**Request Body:**
\`\`\`json
{
  "email": "string",
  "password": "string (min 6 chars, with uppercase, lowercase, number)",
  "username": "string (min 3 chars, alphanumeric + underscore)",
  "full_name": "string (min 2 chars)"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng đăng nhập.",
  "data": {
    "user": { ... }
  }
}
\`\`\`

### POST /api/auth/login

**Request Body:**
\`\`\`json
{
  "email": "string",
  "password": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": { ... },
    "token": "jwt_token"
  }
}
\`\`\`

**Cookies:**
- `auth_token`: HTTP-only cookie với JWT token

---

## 🐛 Troubleshooting

### Database Connection Error
- Kiểm tra MySQL service đang chạy
- Kiểm tra credentials trong `.env.local`
- Kiểm tra database `learning_platform_db` đã được tạo

### JWT Token Error
- Kiểm tra `JWT_SECRET` đã được set
- Kiểm tra token chưa expire

### CORS Error
- Kiểm tra `NEXT_PUBLIC_APP_URL` trong `.env.local`

---

## 📞 Support

Nếu có vấn đề, vui lòng liên hệ:
- Email: huynhkhuanit@gmail.com
- GitHub: huynhkhuanit
