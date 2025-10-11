# 📸 Hướng dẫn Setup Cloudinary cho Upload Avatar

## 🎯 Tổng quan

Cloudinary là dịch vụ quản lý ảnh/video trên cloud với CDN toàn cầu, hỗ trợ:
- ✅ Free tier: 25GB storage + 25,000 transformations/tháng
- ✅ CDN tự động với tốc độ cao
- ✅ Image transformation (resize, crop, format) ngay trên URL
- ✅ Easy integration với Next.js

---

## 🚀 Bước 1: Đăng ký tài khoản Cloudinary (FREE)

### 1.1. Truy cập và đăng ký
```
URL: https://cloudinary.com/users/register/free
```

1. Điền thông tin:
   - Email: huynhkhuanit@gmail.com
   - Password: (mật khẩu của bạn)
   - Cloud name: `dhvlearnx` (hoặc tên khác)
   
2. Xác nhận email

3. Sau khi đăng nhập, vào **Dashboard**

### 1.2. Lấy thông tin cấu hình

Tại Dashboard, bạn sẽ thấy:

```
Cloud name: dhvlearnx
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz12345
```

**⚠️ LƯU Ý:** API Secret phải giữ bí mật, KHÔNG commit lên Git!

---

## 🔧 Bước 2: Cài đặt dependencies

```bash
cd e:\DHV\school_year_4\semester_1\04097_DoAnChuyenNganh\src\dhvlearnx
pnpm add cloudinary
```

---

## ⚙️ Bước 3: Cấu hình environment variables

### 3.1. Tạo file `.env.local` (không commit lên Git)

```bash
# Copy từ .env.example
cp .env.example .env.local
```

### 3.2. Điền thông tin Cloudinary vào `.env.local`

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dhvlearnx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12345
```

**Thay thế các giá trị trên bằng thông tin thực tế từ Cloudinary Dashboard của bạn!**

---

## 📦 Bước 4: Cài đặt Cloudinary trong project

Các file đã được tạo sẵn:
- ✅ `src/lib/cloudinary.ts` - Cloudinary configuration
- ✅ `src/app/api/upload/avatar/route.ts` - API upload avatar
- ✅ `src/app/settings/page.tsx` - Frontend đã tích hợp upload

---

## 🧪 Bước 5: Test upload

### 5.1. Chạy dev server

```powershell
pnpm dev
```

### 5.2. Test upload

1. Đăng nhập vào hệ thống: http://localhost:3000
2. Vào Settings (click avatar → "Cài đặt")
3. Click vào avatar → Chọn ảnh từ máy
4. Chờ upload (sẽ có loading indicator)
5. Click "Lưu thay đổi"
6. **Refresh trang** → Avatar mới vẫn còn ✅

### 5.3. Kiểm tra Cloudinary Dashboard

1. Vào https://console.cloudinary.com/console/media_library
2. Thấy ảnh vừa upload trong folder `dhvlearnx/avatars/`
3. URL format: `https://res.cloudinary.com/dhvlearnx/image/upload/v1234567890/dhvlearnx/avatars/abc123.jpg`

---

## 🎨 Bước 6: Image Transformation (Optional)

Cloudinary cho phép transform ảnh ngay trên URL:

### Resize to 200x200
```
https://res.cloudinary.com/dhvlearnx/image/upload/w_200,h_200,c_fill/dhvlearnx/avatars/abc123.jpg
```

### Crop to circle
```
https://res.cloudinary.com/dhvlearnx/image/upload/w_200,h_200,c_fill,r_max/dhvlearnx/avatars/abc123.jpg
```

### Auto format & quality
```
https://res.cloudinary.com/dhvlearnx/image/upload/q_auto,f_auto/dhvlearnx/avatars/abc123.jpg
```

### Combine multiple transformations
```
https://res.cloudinary.com/dhvlearnx/image/upload/w_200,h_200,c_fill,r_max,q_auto,f_auto/dhvlearnx/avatars/abc123.jpg
```

---

## 📊 Giám sát usage

Theo dõi quota tại: https://console.cloudinary.com/console/usage

**Free tier limits:**
- Storage: 25 GB
- Bandwidth: 25 GB/month
- Transformations: 25,000/month
- Requests: 25,000/month

Đủ cho hàng nghìn users!

---

## 🔒 Bảo mật

### Các điểm quan trọng:

1. ✅ **API Secret phải bí mật**: Chỉ dùng ở server-side (API routes)
2. ✅ **Validate file type**: Chỉ cho phép ảnh (jpg, png, webp, gif)
3. ✅ **Giới hạn file size**: Max 5MB
4. ✅ **Signed uploads**: URL có chữ ký, không thể fake
5. ✅ **Rate limiting**: Tránh abuse (có thể thêm sau)

### Không nên:
- ❌ Expose API Secret ở client
- ❌ Không validate file
- ❌ Cho phép upload file quá lớn
- ❌ Không có rate limiting

---

## 🚨 Troubleshooting

### Lỗi: "Cloudinary credentials not configured"
**Nguyên nhân:** Thiếu env vars  
**Giải pháp:** Kiểm tra `.env.local` có đủ 3 biến: CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET

### Lỗi: "Invalid signature"
**Nguyên nhân:** API_SECRET sai  
**Giải pháp:** Copy lại chính xác từ Cloudinary Dashboard

### Lỗi: "File too large"
**Nguyên nhân:** File > 5MB  
**Giải pháp:** Chọn ảnh nhỏ hơn hoặc tăng limit trong `route.ts`

### Upload chậm
**Nguyên nhân:** Kết nối internet chậm hoặc file lớn  
**Giải pháp:** Nén ảnh trước khi upload (có thể dùng client-side compression)

---

## 📚 Tài liệu tham khảo

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API](https://cloudinary.com/documentation/upload_images)

---

## ✅ Checklist hoàn thành

```
[ ] Đăng ký Cloudinary (free tier)
[ ] Lấy Cloud name, API Key, API Secret
[ ] Tạo .env.local với thông tin Cloudinary
[ ] Cài đặt: pnpm add cloudinary
[ ] Chạy dev server: pnpm dev
[ ] Test upload avatar
[ ] Refresh trang và kiểm tra avatar vẫn còn
[ ] Kiểm tra Media Library trên Cloudinary Dashboard
```

---

**Status:** ✅ Ready for production  
**Cost:** $0 (Free tier)  
**Scalability:** Hỗ trợ hàng nghìn users  
**Performance:** CDN global, tốc độ cao

---

**Người hướng dẫn:** GitHub Copilot AI Assistant  
**Ngày:** 12/10/2025
