# DHV LearnX - Nền tảng học lập trình hiện đại

>Dự án này là hệ thống elearning được phát triển bởi [huynhkhuanit](https://github.com/huynhkhuanit) với mục tiêu giúp mọi người học lập trình bài bản, thực tiễn và dễ dàng tiếp cận công nghệ mới.

## 🚀 Công nghệ sử dụng

- **Frontend**: Next.js 15 (App Router)
- **Ngôn ngữ**: TypeScript
- **UI**: Tailwind CSS, Lucide React Icons
- **Font**: System UI
- **Thiết kế**: Gradient, shadow, responsive, tối ưu cho mọi thiết bị

## 🗺️ Routing & Pages

| Đường dẫn      | Chức năng                |
|---------------|--------------------------|
| `/`           | Trang chủ (Hero + Courses)|
| `/roadmap`    | Lộ trình học lập trình    |
| `/articles`   | Danh sách bài viết       |
| `/qa`         | Hỏi đáp cộng đồng        |

## 📦 Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx        # Layout chung, navigation, header, footer
│   ├── page.tsx          # Trang chủ (HeroSection, CoursesSection)
│   ├── roadmap/
│   │   └── page.tsx      # Trang lộ trình học tập
│   ├── articles/
│   │   └── page.tsx      # Trang bài viết
│   ├── qa/
│   │   └── page.tsx      # Trang hỏi đáp
│   └── globals.css       # Global styles
└── components/
     ├── Header.tsx        # Header hiện đại, sticky, responsive
     ├── Menu.tsx          # Sidebar navigation
     ├── Footer.tsx        # Footer thông tin, social
     ├── HeroSection.tsx   # Banner quảng cáo khóa học
     ├── CoursesSection.tsx# Card các khóa học nổi bật
     ├── Badge.tsx         # Badge UI
     └── Modal.tsx         # Modal UI
```

## ⚡ Tính năng nổi bật

- 🎯 **Lộ trình học rõ ràng**: Từ cơ bản đến nâng cao
- � **Thực hành dự án thực tế**
- 👥 **Cộng đồng hỏi đáp, chia sẻ**
- 🏆 **Chứng chỉ giá trị**
- 📱 **Responsive Design**
- ⚡ **Navigation Sidebar**
- 🎨 **Giao diện hiện đại, gradient, animation**
- 🔎 **Search, filter, sort**

## 🛠️ Hướng dẫn cài đặt & chạy

1. Clone repository:
    ```bash
    git clone https://github.com/huynhkhuanit/elearning-system.git
    cd elearning-system/src/dhvlearnx
    ```
2. Cài đặt dependencies:
    ```bash
    npm install
    # hoặc dùng pnpm nếu có
    pnpm install
    ```
3. Chạy development server:
    ```bash
    npm run dev
    # hoặc pnpm run dev
    ```
4. Truy cập [http://localhost:3000](http://localhost:3000)

## 📝 Đóng góp & liên hệ

- GitHub: [huynhkhuanit](https://github.com/huynhkhuanit)
- Email: huynhkhuanit@gmail.com
- Website: [https://github.com/huynhkhuanit](https://github.com/huynhkhuanit)

## 📄 License

MIT © [huynhkhuanit](https://github.com/huynhkhuanit)
