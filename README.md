# F8 - Học Lập Trình Để Đi Làm

F8 là nền tảng học lập trình hàng đầu Việt Nam, được thiết kế để giúp học viên trở thành developer chuyên nghiệp với lộ trình học tập bài bản và thực tiễn.

## Công nghệ sử dụng

- **Frontend Framework**: Next.js 15 với App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS với thiết kế hiện đại
- **Icons**: Lucide React
- **Fonts**: System UI (font hệ thống)
- **Primary Color**: Indigo-500 (#6366f1)

## Tính năng nổi bật

- 🎯 **Lộ trình học rõ ràng**: Từ cơ bản đến nâng cao
- 💻 **Thực hành ngay**: 80% thời gian thực hành với dự án thực tế
- 👥 **Cộng đồng lớn mạnh**: Kết nối với hàng nghìn developer
- 🏆 **Chứng chỉ giá trị**: Được các doanh nghiệp lớn công nhận
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị
- 🌙 **Dark Mode**: Chuyển đổi mượt mà giữa chế độ sáng/tối
- ⚡ **Header Modern**: Component tái sử dụng với hiệu ứng đẹp mắt
- 🎨 **Giao diện hiện đại**: Thiết kế gradient với system-ui font

## Cài đặt và chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

## Cấu trúc Project

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout với system-ui font
│   ├── page.tsx           # Homepage với Header component
│   └── globals.css        # Global styles với indigo theme & smooth transitions
└── components/            # Reusable components
    └── Header.tsx         # Clean header với buttons bo tròn & hover effects
```

## Trạng thái hiện tại

- ✅ **Header hoàn chỉnh**: Logo gradient, search interactive, buttons bo tròn, modern animations
- ✅ **System UI Font**: Font hệ thống cho hiệu suất tối ưu
- ✅ **Modern Design**: Gradient backgrounds, shadows, smooth transitions
- ✅ **Responsive Design**: Mobile-first với breakpoints tối ưu
- ✅ **Clean Codebase**: Loại bỏ dark mode, tập trung vào thiết kế header
- 🔄 **Sẵn sàng thiết kế**: Content sections đơn giản, dễ mở rộng

## Đặc điểm Header

- **Background**: Màu trắng thuần với border dưới
- **Logo DHV LearnX**: Gradient background từ indigo-500 đến purple-600 với shadow effects
- **Search Bar**: Interactive với focus states, clear button, và smooth transitions
- **Buttons**: Tất cả button đều có cursor pointer và border-radius 999px (fully rounded)
- **Auth Buttons**: Gradient backgrounds, scale animations, và smooth hover effects
- **Mobile Responsive**: Mobile-first design với menu và search riêng cho từng breakpoint
- **Sticky Header**: Cố định với smooth transitions
- **Reusable Component**: Hoàn toàn độc lập, có thể sử dụng ở mọi trang
- **Modern Design**: Gradient backgrounds, rounded corners, và modern typography

## Kế hoạch tiếp theo

1. **Sidebar Navigation**: Menu điều hướng bên trái
2. **Hero Section**: Banner quảng cáo khóa học chính
3. **Course Cards**: Hiển thị các khóa học nổi bật
4. **Footer**: Thông tin liên hệ và links hữu ích

## Đội ngũ phát triển

F8 được phát triển bởi các chuyên gia lập trình hàng đầu Việt Nam với nhiều năm kinh nghiệm trong ngành công nghệ.

## Liên hệ

- Website: [https://f8.edu.vn](https://f8.edu.vn)
- Email: contact@f8.edu.vn
- Hotline: 1900-xxxx
