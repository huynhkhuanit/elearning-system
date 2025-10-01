# DHV LearnX - Nền tảng học lập trình trực tuyến hiện đại

>Dự án này là hệ thống e-learning chuyên về lập trình, được phát triển bởi **Huỳnh Văn Khuân** (MSSV: 2205CT0035, lớp CT06PM, Khoa Kỹ thuật Công nghệ, Trường Đại học Hùng Vương TP. Hồ Chí Minh) dưới sự hướng dẫn của **ThS. Nguyễn Thanh Tiến**. Mục tiêu là giúp mọi người học lập trình bài bản, thực tiễn và dễ dàng tiếp cận công nghệ mới thông qua giao diện thân thiện, lộ trình cá nhân hóa và cộng đồng tương tác.

## 🎯 Mục tiêu dự án
- Xây dựng nền tảng học lập trình trực tuyến hoàn chỉnh, hỗ trợ từ cơ bản đến nâng cao.
- Tạo trải nghiệm học tập tương tác, cá nhân hóa bằng AI, với video streaming, quiz và roadmap dạng cây.
- Xây dựng cộng đồng chia sẻ kiến thức, tăng động lực học qua lịch sử và streak hoạt động.
- Đảm bảo responsive, hiện đại, dễ sử dụng trên mọi thiết bị.
- Hoàn thành phần mềm trong 6 tuần, triển khai trên VPS/domain (dự kiến), và báo cáo đầy đủ trong 8 tuần.

## 🚀 Công nghệ sử dụng
### Frontend
- **Framework**: ReactJS 18 với TypeScript (sử dụng Next.js 15 App Router cho routing tối ưu).
- **State Management**: Redux Toolkit + RTK Query.
- **Styling**: Tailwind CSS + Styled Components.
- **UI Components**: Ant Design hoặc Material-UI, Lucide React Icons.
- **Video Player**: Video.js hoặc React Player.
- **Code Editor**: Monaco Editor (VS Code editor).
- **Build Tool**: Vite.
- **Font & Design**: System UI, gradient, shadow, responsive, animation.

### Backend
- **Runtime**: Node.js với Express.js.
- **Language**: TypeScript hoặc JavaScript.
- **Authentication**: JWT + Passport.js.
- **File Upload**: Multer + Cloudinary.
- **Video Processing**: FFmpeg.
- **Real-time**: Socket.IO (cho comments, notifications).
- **Validation**: Joi hoặc Zod.
- **API Documentation**: Swagger.

### Database
- **PostgreSQL** (với ERD thiết kế mối quan hệ giữa các bảng).

### Third-party Services
- **Payment**: Stripe, PayPal, Momo.
- **Video Storage**: AWS S3 + CloudFront.
- **Email**: SendGrid.
- **Google**: Firebase + Firestore.

## ✨ Tính năng nổi bật
### Hệ thống học tập
- Video streaming bài học (upload video bài giảng riêng).
- Điều khiển video: pause, next, chọn chất lượng, chỉnh tốc độ.
- Thanh tiến độ hiển thị % hoàn thành khóa học.
- Ghi chú (note) dạng WYSIWYG và highlight.
- Flashcard cho mỗi chương giúp ôn tập.
- Quiz / bài tập kiểm tra cuối mỗi chương.

### Quản lý khóa học
- Đăng ký khóa học theo user (Free / Pro).
- Thanh toán và xử lý membership.
- Gợi ý khóa học liên quan (AI gợi ý lộ trình học).
- Xây dựng roadmap theo mục tiêu cá nhân, roadmap cơ bản và Roadmap nâng cao theo dạng cây.

### Tương tác & Cộng đồng
- Lưu lịch sử học, resume từ bài đang học dở.
- Hệ thống bình luận dưới mỗi bài học.
- Forum / Discussion board (nâng cao) [Dự kiến].
- Theo dõi tiến độ hoạt động như commit streak (tạo động lực học tập) [Dự kiến].
- Cộng đồng hỏi đáp, chia sẻ (trang QA).

### Giao diện & Trải nghiệm người dùng
- Giao diện trang chủ hiện đại, thân thiện (Hero + Courses).
- Responsive design hỗ trợ mọi thiết bị.
- Tìm kiếm khóa học, lọc theo chủ đề / level.
- Lộ trình học rõ ràng: Từ cơ bản đến nâng cao.
- Thực hành dự án thực tế.
- Chứng chỉ giá trị sau hoàn thành.
- Navigation Sidebar, search, filter, sort.
- Giao diện hồ sơ cá nhân: Tiến độ học, hoạt động hàng ngày.

## 🗺️ Routing & Pages
| Đường dẫn      | Chức năng                          |
|---------------|------------------------------------|
| `/`           | Trang chủ (Hero + Courses)         |
| `/roadmap`    | Lộ trình học lập trình (roadmap cây)|
| `/articles`   | Danh sách bài viết                 |
| `/qa`         | Hỏi đáp cộng đồng                  |
| `/course/[id]`| Chi tiết khóa học (video, quiz, notes) [Dự kiến] |
| `/profile`    | Hồ sơ cá nhân (tiến độ, streak)    |

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
│   ├── course/           # [Dự kiến] Chi tiết khóa học
│   │   └── [id]/page.tsx
│   ├── profile/          # [Dự kiến] Hồ sơ cá nhân
│   │   └── page.tsx
│   └── globals.css       # Global styles
└── components/
├── Header.tsx        # Header hiện đại, sticky, responsive
├── Menu.tsx          # Sidebar navigation
├── Footer.tsx        # Footer thông tin, social
├── HeroSection.tsx   # Banner quảng cáo khóa học
├── CoursesSection.tsx# Card các khóa học nổi bật
├── VideoPlayer.tsx   # [Dự kiến] Player video với controls
├── NotesEditor.tsx   # [Dự kiến] WYSIWYG notes
├── QuizComponent.tsx # [Dự kiến] Quiz và flashcard
├── Badge.tsx         # Badge UI
└── Modal.tsx         # Modal UI
```

## ⏰ Tiến độ thực hiện dự kiến
- **Tuần 1-2**: Phân tích yêu cầu, thiết kế flow hệ thống, database, UI; xây dựng front-end (React/Next.js) cho các trang hiện hành.
- **Tuần 3-4**: Xây dựng Backend (Node.js + Express.js), vẽ sơ đồ ERD; Database: PostgreSQL.
- **Tuần 5-6**: Tích hợp Frontend - Backend, xử lý video streaming, notes, hệ thống hoạt động (activity) và chức năng đăng bài lên forums [Dự kiến]; fix bug, push lên GitHub/GitLab, triển khai trên VPS, trỏ domain [Dự kiến].
- **Hoàn thành**: Phần mềm tuần 6 (chỉnh sửa theo GVHD); Báo cáo tuần 8 (tài liệu yêu cầu, thiết kế, use case).

Mỗi tuần viết báo cáo chi tiết về task hoàn thành và kế hoạch tiếp theo.

## 🛠️ Hướng dẫn cài đặt & chạy
1. Clone repository:
    ```bash
    git clone https://github.com/huynhkhuanit/elearning-system.git
    cd elearning-system/src/dhvlearnx
    ```
2. Cài đặt dependencies
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
4. Truy cập http://localhost:3000
    > **Lưu ý**: Để chạy backend, cần thiết lập PostgreSQL và các biến môi trường (JWT, Cloudinary, etc.) riêng

## 📝 Đóng góp & liên hệ
GitHub: huynhkhuanit
Email: huynhkhuanit@gmail.com

## 📄 License
MIT © Huỳnh Văn Khuân