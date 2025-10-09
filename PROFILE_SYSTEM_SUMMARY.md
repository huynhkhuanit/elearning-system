# Tài Liệu Hệ Thống Profile Người Dùng - DHV LearnX

## Tổng Quan
Hệ thống profile người dùng đã được xây dựng hoàn chỉnh với giao diện tương tự GitHub, bao gồm:
- Menu bên trái với avatar người dùng
- Trang profile chi tiết với thông tin cá nhân
- Biểu đồ hoạt động học tập (Activity Heatmap)
- Thống kê học tập đầy đủ

## Cấu Trúc Files Đã Tạo

### 1. Types (src/types/profile.ts)
Định nghĩa các interface cho:
- `UserProfile`: Thông tin đầy đủ người dùng
- `ActivityDay`: Dữ liệu hoạt động theo ngày
- `ActivityData`: Tổng hợp dữ liệu hoạt động
- `EnrolledCourse`: Khóa học đã đăng ký
- `UserArticle`: Bài viết của người dùng
- `ProfileTab`: Tab trong trang profile

### 2. API Routes

#### a) /api/users/[username]/route.ts
**Mục đích**: Lấy thông tin profile người dùng

**Endpoint**: `GET /api/users/[username]`

**Dữ liệu trả về**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "huynhkhuanit",
    "full_name": "Khuân Huỳnh",
    "email": "user@example.com",
    "avatar_url": "url",
    "bio": "Mô tả",
    "membership_type": "PRO",
    "learning_streak": 15,
    "total_study_time": 1200,
    "total_courses_enrolled": 7,
    "total_courses_completed": 3,
    "total_articles_published": 0,
    "total_forum_posts": 0,
    "followers_count": 0,
    "following_count": 0
  }
}
```

**Truy vấn SQL**:
- Join bảng `users` với các bảng liên quan
- Đếm số khóa học đã đăng ký từ `enrollments`
- Đếm số khóa học đã hoàn thành
- Lấy thống kê học tập từ `learning_streak`, `total_study_time`

#### b) /api/users/[username]/activities/route.ts
**Mục đích**: Lấy dữ liệu hoạt động học tập 12 tháng qua

**Endpoint**: `GET /api/users/[username]/activities`

**Dữ liệu trả về**:
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "date": "2024-10-09",
        "count": 5,
        "level": 2
      }
    ],
    "total_count": 2019,
    "current_streak": 15,
    "longest_streak": 45
  }
}
```

**Logic**:
- Lấy dữ liệu từ bảng `learning_activities`
- Tính toán 12 tháng qua
- Tạo map cho tất cả các ngày với giá trị mặc định = 0
- Điền dữ liệu thực tế vào map
- Tính level (0-4) dựa trên số lượng hoạt động:
  - Level 0: 0 hoạt động
  - Level 1: 1-3 hoạt động
  - Level 2: 4-6 hoạt động
  - Level 3: 7-9 hoạt động
  - Level 4: 10+ hoạt động
- Tính current_streak và longest_streak

### 3. Components

#### a) Menu.tsx (Đã cập nhật)
**Tính năng mới**:
- Avatar người dùng ở đầu menu
- Placeholder avatar khi chưa đăng nhập
- Dropdown menu với các tùy chọn:
  - Trang cá nhân
  - Viết blog
  - Bài viết của tôi
  - Bài viết đã lưu
  - Cài đặt
  - Đăng xuất
- Badge PRO cho tài khoản premium
- Click outside để đóng menu

**Giao diện**:
- Avatar tròn 48x48px
- Border thay đổi màu khi hover
- Dropdown hiệu ứng slide-in
- Icon cho mỗi menu item

#### b) ActivityHeatmap.tsx
**Tính năng**:
- Hiển thị 12 tháng hoạt động
- Màu sắc theo 5 level (GitHub style):
  - #ebedf0: Không có hoạt động
  - #9be9a8: Ít (1-3)
  - #40c463: Trung bình (4-6)
  - #30a14e: Nhiều (7-9)
  - #216e39: Rất nhiều (10+)
- Tooltip hiển thị chi tiết khi hover
- Hiển thị tổng số hoạt động
- Hiển thị chuỗi học tập hiện tại
- Legend để giải thích màu sắc

**Layout**:
- Grid 7 hàng x 52 cột (7 ngày x 52 tuần)
- Nhãn tháng ở trên
- Nhãn thứ ở bên trái
- Mỗi ô 10x10px với gap 1px

#### c) ProfileStats.tsx
**Hiển thị 6 thống kê**:
1. **Người theo dõi** (Followers)
   - Icon: Users
   - Màu: Blue
2. **Đang theo dõi** (Following)
   - Icon: UserPlus
   - Màu: Purple
3. **Khóa học đã đăng ký**
   - Icon: BookOpen
   - Màu: Green
4. **Khóa học đã hoàn thành**
   - Icon: Award
   - Màu: Yellow
5. **Bài viết**
   - Icon: FileText
   - Màu: Pink
6. **Bài đăng diễn đàn**
   - Icon: MessageCircle
   - Màu: Indigo

**Layout**:
- Grid responsive: 2 cột (mobile) → 3 cột (tablet) → 6 cột (desktop)
- Card với icon màu, số lớn, và label
- Hover effect với shadow

#### d) @[username]/page.tsx
**Cấu trúc trang**:

1. **Profile Header**:
   - Avatar 128x128px
   - Tên đầy đủ (h1)
   - Username với @ prefix
   - Bio (nếu có)
   - Thông tin bổ sung:
     - Email
     - Ngày tham gia
     - Learning streak với icon lửa
     - Tổng thời gian học
   - Badge PRO (nếu có)
   - Nút "Theo dõi" và "Nhắn tin"

2. **ProfileStats Component**:
   - Grid 6 thống kê

3. **ActivityHeatmap Component**:
   - Biểu đồ hoạt động 12 tháng

4. **Tabs Section**:
   - Khóa học đã đăng ký
   - Khóa học đã hoàn thành
   - Bài viết
   - Bài viết đã lưu
   
   Mỗi tab hiển thị:
   - Empty state với icon và text phù hợp
   - Count badge (nếu có)

**States & Hooks**:
- `profile`: Thông tin người dùng
- `activityData`: Dữ liệu hoạt động
- `loading`: Trạng thái loading
- `error`: Thông báo lỗi
- `activeTab`: Tab đang active

**API Calls**:
```typescript
// Fetch profile
const profileRes = await fetch(`/api/users/${username}`);

// Fetch activities
const activitiesRes = await fetch(`/api/users/${username}/activities`);
```

### 4. Header.tsx (Đã cập nhật)
**Thay đổi**:
- Link "Hồ sơ cá nhân" từ `/profile` → `/@${user.username}`
- Sử dụng dynamic route với username

## Routing

### Dynamic Route Pattern
- URL: `/@username` (ví dụ: `/@huynhkhuanit`)
- File: `src/app/@[username]/page.tsx`
- Next.js tự động handle dynamic segment `[username]`
- Access username qua: `useParams().username`

## Database Schema Sử Dụng

### Bảng Chính:

1. **users**:
   - id, username, full_name, email
   - avatar_url, bio, phone
   - membership_type, membership_expires_at
   - learning_streak, total_study_time
   - is_verified, created_at

2. **learning_activities**:
   - user_id, activity_date
   - lessons_completed, quizzes_completed
   - study_time

3. **enrollments**:
   - user_id, course_id
   - enrolled_at, completed_at
   - progress_percentage
   - is_active

## Tính Năng Đặc Biệt

### 1. Avatar System
- Sử dụng `avatar_url` từ database
- Fallback về DiceBear API nếu không có avatar
- Format: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`

### 2. Membership System
- FREE vs PRO badges
- PRO badge hiển thị ở:
  - Menu dropdown
  - Profile avatar
  - Profile header
- Màu gradient: Yellow → Orange

### 3. Activity Tracking
- Tự động đếm từ `learning_activities`
- Tính level màu tự động
- Streak calculation:
  - Current streak: Đếm ngược từ hôm nay
  - Longest streak: Max consecutive days

### 4. Responsive Design
- Mobile: 1-2 cột
- Tablet: 3 cột
- Desktop: 6 cột (stats)
- Activity heatmap: Scroll ngang trên mobile

## Styling Guidelines

### Colors
- Primary: Tailwind `primary` color
- Background: White (#ffffff)
- Border: Gray-200 (#e5e7eb)
- Text: Gray-900, Gray-700, Gray-600

### Typography
- Heading 1: text-3xl font-bold
- Heading 2: text-2xl font-bold
- Heading 3: text-lg font-semibold
- Body: text-sm, text-base

### Spacing
- Container: max-w-7xl mx-auto
- Padding: p-4, p-6, p-8
- Gap: gap-2, gap-4, gap-6, gap-8

### Shadows & Borders
- Card: border border-gray-200
- Hover: shadow-md
- Dropdown: shadow-xl

## Error Handling

### Loading States
- Spinner with text
- Center screen alignment
- Consistent messaging

### Error States
- 404: "Không tìm thấy người dùng"
- 500: "Đã xảy ra lỗi"
- Empty states cho từng tab

### Validation
- Username required
- Strip @ prefix nếu có
- Check user exists trong database

## Performance Optimization

### API Calls
- Parallel fetch cho profile và activities
- Single query với JOIN để giảm round trips
- Index trên username, user_id, activity_date

### Component Optimization
- Client components chỉ khi cần state
- Server components cho static content
- Lazy loading cho tabs content

### Caching Strategy
- Browser cache cho avatars
- SWR/React Query có thể thêm sau
- Database index optimization

## Testing Checklist

### Functional Tests
- ✅ Load profile với username hợp lệ
- ✅ Handle 404 cho username không tồn tại
- ✅ Display all stats correctly
- ✅ Activity heatmap renders correctly
- ✅ Tabs switching works
- ✅ Dropdown menu works
- ✅ Avatar fallback works
- ✅ PRO badge displays correctly

### UI Tests
- ✅ Responsive trên mobile
- ✅ Responsive trên tablet
- ✅ Responsive trên desktop
- ✅ Hover states work
- ✅ Transitions smooth
- ✅ Loading states display
- ✅ Error states display

### Integration Tests
- ✅ API routes return correct data
- ✅ Database queries work
- ✅ Authentication works
- ✅ Navigation works

## Future Enhancements

### Phase 2
1. **Follow System**:
   - Bảng `user_followers`
   - Follow/Unfollow buttons functional
   - Followers/Following lists

2. **Articles System**:
   - Bảng `articles`
   - Display user's articles
   - Article detail pages

3. **Saved Articles**:
   - Bảng `saved_articles`
   - Bookmark functionality

4. **Direct Messaging**:
   - Real-time chat
   - Notification system

### Phase 3
1. **Course Display**:
   - List enrolled courses with progress
   - Course cards with thumbnails
   - Completion certificates

2. **Forum Integration**:
   - Display user's forum posts
   - Link to forum topics

3. **Advanced Stats**:
   - Learning time by category
   - Skill progress radar chart
   - Achievement badges

4. **Social Features**:
   - Activity feed
   - Recommendations
   - Leaderboards

## Deployment Notes

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Aa123456
DB_NAME=learning_platform_db
JWT_SECRET=your-secret-key
```

### Database Setup
```sql
-- Đã có sẵn schema
-- Cần chạy migrations nếu thêm bảng mới
-- Index recommendations:
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_user_activities ON learning_activities(user_id, activity_date);
CREATE INDEX idx_user_enrollments ON enrollments(user_id, is_active);
```

### Build & Deploy
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **Profile not loading**:
   - Check username exists in database
   - Verify API route is working
   - Check network tab for errors

2. **Activities not showing**:
   - Verify `learning_activities` table has data
   - Check date range calculation
   - Ensure user_id matches

3. **Avatar not displaying**:
   - Check avatar_url in database
   - Verify DiceBear API is accessible
   - Check image CORS settings

4. **Stats showing 0**:
   - Verify foreign keys in enrollments
   - Check JOIN queries
   - Ensure data exists in related tables

## Support & Maintenance

### Code Structure
- Modular components
- Type-safe with TypeScript
- Well-documented
- Easy to extend

### Best Practices
- Follow Next.js 15 conventions
- Use server components by default
- Client components only when needed
- TypeScript strict mode

---

**Phiên bản**: 1.0.0  
**Ngày tạo**: 09/10/2024  
**Tác giả**: DHV LearnX Development Team
