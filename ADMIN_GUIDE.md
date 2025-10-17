# Admin Dashboard - Hướng Dẫn Sử Dụng

## 📋 Giới Thiệu

Admin Dashboard là giao diện quản lý nội dung toàn bộ hệ thống DHV LearnX. Nó cung cấp các công cụ để quản lý khóa học, chương, bài học và nội dung markdown.

## 🎨 Thiết Kế & UX

- **Dark Mode**: Giao diện tối được thiết kế theo xu hướng modern admin dashboard (tham khảo GitHub, VS Code, Vercel)
- **Sidebar Navigation**: Điều hướng dễ dàng với sidebar có thể thu gọn
- **Responsive**: Hoạt động tốt trên desktop và tablet
- **Color Scheme**: Màu chính Indigo (#6366f1) kết hợp với các màu phụ (Blue, Purple, Pink, Green, Emerald)

## 📖 Các Tính Năng

### 1. Dashboard (`/admin`)
- **Thống kê tổng quan**: Số khóa học, chương, bài học
- **Tiến độ**: Tỷ lệ nội dung hoàn thành
- **Quick Actions**: Phím tắt đến các chức năng chính

### 2. Quản Lý Bài Học (`/admin/lessons`)
- **Danh sách khóa học**: Xem tất cả khóa học
- **Cấu trúc phân cấp**: Khóa học → Chương → Bài học
- **Tìm kiếm**: Tìm kiếm nhanh bài học
- **Trạng thái**: Hiển thị bài học có nội dung, đã xuất bản
- **Chỉnh sửa**: Nhấp vào bài học để chỉnh sửa nội dung markdown

### 3. Cài Đặt (`/admin/settings`)
- **Thông báo**: Quản lý thông báo hệ thống
- **Bảo mật**: Cài đặt 2FA, đăng nhập an toàn
- **Nội dung**: Cấu hình Markdown renderer
- **Hiệu suất**: Tối ưu cache, kích thước file

## 🔐 Quyền Truy Cập

Chỉ những người dùng có role **Admin** hoặc **Teacher** mới có thể truy cập admin dashboard.

### Kiểm tra quyền:
```typescript
const userRole = user?.role?.toLowerCase();
const hasAccess = userRole === 'admin' || userRole === 'teacher';
```

## 🗂️ Cấu Trúc File

```
src/app/admin/
├── layout.tsx              # Admin layout chính
├── page.tsx                # Dashboard
├── lessons/
│   ├── page.tsx            # Danh sách bài học
│   └── [lessonId]/
│       └── edit/
│           └── page.tsx    # Chỉnh sửa bài học
└── settings/
    └── page.tsx            # Cài đặt
```

## 🎯 Component Chính

### 1. AdminLayout (`layout.tsx`)
- Sidebar navigation
- Top bar
- User section
- Responsive design

### 2. Dashboard (`page.tsx`)
- Stats cards
- Quick actions
- Info box

### 3. LessonsPage (`lessons/page.tsx`)
- Course list
- Chapter/lesson hierarchy
- Search & filter
- Status indicators
- Direct edit links

### 4. Settings (`settings/page.tsx`)
- Notification settings
- Security options
- Content configuration
- Performance tuning

## 🎨 Color Palette

| Màu | Hex Code | Sử Dụng |
|-----|----------|--------|
| Primary | #6366f1 | Indigo - Highlight, Links |
| Blue | #3B82F6 | Courses |
| Purple | #A855F7 | Chapters |
| Pink | #EC4899 | Lessons |
| Green | #10B981 | Active/Success |
| Emerald | #059669 | Published |
| Slate | #0F172A | Background |

## 🔧 Tùy Chỉnh

### Thêm Menu Item Mới
Chỉnh sửa `layout.tsx`:
```typescript
const navigationItems = [
  // ... existing items
  {
    id: 'new-item',
    label: 'Mục Mới',
    href: '/admin/new-page',
    icon: IconComponent,
  },
];
```

### Thay Đổi Màu Chủ Đề
- Chỉnh sửa color classes trong Tailwind
- Color prefix: `bg-indigo-*`, `text-indigo-*`, etc.

## 📱 Responsive Design

- **Mobile**: Sidebar ẩn mặc định, có toggle button
- **Tablet**: Sidebar có thể toggleOnEvent
- **Desktop**: Sidebar luôn hiển thị

## 🚀 Performance

- **Lazy Loading**: Các component load on-demand
- **Code Splitting**: Admin pages tách riêng từ main site
- **Caching**: Dữ liệu được cache để giảm request

## 🛠️ Development

### Chạy Development Server
```bash
npm run dev
# or
pnpm dev
```

### Build Production
```bash
npm run build
npm start
```

## 📝 Notes

- Admin dashboard hoàn toàn tách biệt khỏi main layout (không có Header, Menu, Footer)
- Dark mode được thiết kế riêng cho admin
- Mobile-first responsive design
- Accessibility tối ưu (semantic HTML, ARIA labels)

---

**Phiên Bản**: 1.0.0  
**Cập Nhật Lần Cuối**: October 2025
