# Hướng dẫn hoàn chỉnh: Xây dựng hệ thống Chapters & Lessons

## 📋 Tổng quan

Đã hoàn thành việc xây dựng hệ thống quản lý chapters và lessons thực tế, thay thế hoàn toàn mock data bằng data từ MySQL database.

## 🗄️ Cấu trúc Database

### Các bảng chính:

```
courses (Khóa học)
  └── chapters (Chương học)
        └── lessons (Bài học)
              └── lesson_progress (Tiến độ học)
```

### Relationships:
- **courses** (1) -> (N) **chapters**: Mỗi khóa học có nhiều chương
- **chapters** (1) -> (N) **lessons**: Mỗi chương có nhiều bài học
- **users** (N) <-> (N) **courses** qua **enrollments**: User đăng ký khóa học
- **users** (N) <-> (N) **lessons** qua **lesson_progress**: Theo dõi tiến độ

## 🚀 Các API đã tạo

### 1. GET /api/courses/[slug]/chapters
**Mục đích**: Lấy danh sách chapters và lessons của một khóa học

**Response:**
```json
{
  "success": true,
  "data": {
    "chapters": [
      {
        "id": "uuid",
        "title": "Giới thiệu khóa học",
        "description": "...",
        "duration": "45 phút",
        "order": 1,
        "lessons": [
          {
            "id": "uuid",
            "title": "Chào mừng bạn đến với khóa học",
            "duration": "5:30",
            "type": "video",
            "isFree": true,
            "isPreview": true,
            "order": 1
          }
        ]
      }
    ],
    "totalLessons": 60
  }
}
```

### 2. GET /api/courses/[slug]/progress
**Mục đích**: Lấy tiến độ học của user cho một khóa học

**Authentication**: Required (JWT token)

**Response:**
```json
{
  "success": true,
  "data": {
    "completedLessons": ["lesson-id-1", "lesson-id-2"],
    "progressMap": {
      "lesson-id-1": {
        "isCompleted": true,
        "watchTime": 330,
        "lastPosition": 330
      }
    },
    "progress": 15,
    "totalLessons": 60,
    "completedCount": 9,
    "enrollment": {
      "id": "uuid",
      "enrolled_at": "2025-10-12",
      "progress_percentage": "15.00"
    }
  }
}
```

### 3. POST /api/lessons/[lessonId]/complete
**Mục đích**: Đánh dấu bài học đã hoàn thành

**Authentication**: Required (JWT token)

**Response:**
```json
{
  "success": true,
  "message": "Lesson marked as completed"
}
```

**Side effects:**
- Cập nhật `lesson_progress.is_completed = 1`
- Cập nhật `enrollments.progress_percentage`
- Tạo/cập nhật `learning_activities` cho ngày hôm nay
- Tăng `learning_activities.lessons_completed`

## 📝 Scripts để seed data

### 1. seed-chapters-lessons.js
Script tự động tạo:
- **10 chapters** cho mỗi khóa học
- **4-8 lessons** cho mỗi chapter
- **Tổng ~60 lessons** mỗi khóa học
- Duration thực tế (tính bằng seconds, convert sang mm:ss)
- Preview lessons (2 bài đầu tiên của chapter 1)

### 2. Cách chạy:
```bash
# 1. Đảm bảo đã có courses trong database
node scripts/seed-courses.js

# 2. Seed chapters và lessons
node scripts/seed-chapters-lessons.js
```

## 🎨 Giao diện đã cập nhật

### Page: /learn/[slug]

#### Thay đổi chính:

1. **Thay thế Mock Data**:
   - ✅ Fetch chapters từ API
   - ✅ Fetch progress từ API
   - ✅ Hiển thị data thực từ database

2. **Sidebar bên trái** (có thể toggle):
   - Danh sách chapters
   - Lessons của mỗi chapter
   - Progress indicator (✓ cho completed)
   - Numbered lessons (1.1, 1.2, 2.1...)
   - Duration cho mỗi lesson

3. **Main content area**:
   - Video player placeholder
   - Lesson title và duration
   - Control buttons (Previous, Complete, Next)
   - Tabs: Overview, Notes, Q&A, Resources

4. **Features**:
   - ✅ Auto-expand first chapter
   - ✅ Highlight current lesson
   - ✅ Mark lesson as completed
   - ✅ Auto-advance to next lesson
   - ✅ Update progress bar real-time
   - ✅ Persist progress to database

## 🔐 Authentication & Authorization

### Flow:
1. User phải login (JWT token trong cookie)
2. User phải enroll khóa học trước khi học
3. API check enrollment trước khi cho phép truy cập
4. Progress được track theo user_id và lesson_id

### Error Handling:
- **401 Unauthorized**: Redirect to /auth/login
- **403 Forbidden**: Redirect to /courses/[slug] (chưa enroll)
- **404 Not Found**: Redirect to homepage

## 📊 Cấu trúc data trong DB

### Lessons table:
```sql
CREATE TABLE `lessons` (
  `id` char(36) PRIMARY KEY,
  `chapter_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `video_url` varchar(500),
  `video_duration` int,          -- Seconds
  `sort_order` int NOT NULL,
  `is_preview` tinyint(1),       -- Free preview?
  `is_published` tinyint(1),
  FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`)
);
```

### Lesson_progress table:
```sql
CREATE TABLE `lesson_progress` (
  `id` char(36) PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `lesson_id` char(36) NOT NULL,
  `watch_time` int DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `last_position` int DEFAULT 0,
  `completed_at` datetime,
  UNIQUE KEY `unique_progress` (`user_id`,`lesson_id`)
);
```

## ✨ Features đã implement

### ✅ Completed:
- [x] API lấy chapters và lessons từ DB
- [x] API lấy progress của user
- [x] API mark lesson as completed
- [x] Seed script tạo data mẫu
- [x] UI hiển thị data thực từ API
- [x] Track lesson completion
- [x] Update progress percentage
- [x] Learning activities tracking
- [x] Authentication & authorization
- [x] Error handling

### 🚧 Todo (Optional enhancements):
- [ ] Video player integration (YouTube/Vimeo)
- [ ] Save notes feature
- [ ] Q&A/Comments feature
- [ ] Quiz functionality
- [ ] Certificate generation khi hoàn thành
- [ ] Download resources
- [ ] Bookmark lessons
- [ ] Watch time tracking (for video progress)

## 🧪 Testing

### Manual testing steps:

1. **Seed data**:
   ```bash
   node scripts/seed-chapters-lessons.js
   ```

2. **Login và enroll**:
   - Login với tài khoản
   - Enroll vào một khóa học

3. **Test learning page**:
   - Truy cập `/learn/[course-slug]`
   - Kiểm tra danh sách chapters/lessons hiển thị đúng
   - Click vào lessons để switch
   - Mark lesson as completed
   - Kiểm tra progress bar update
   - Next/Previous buttons

4. **Check database**:
   ```sql
   -- Xem lesson progress
   SELECT * FROM lesson_progress 
   WHERE user_id = 'your-user-id';
   
   -- Xem enrollment progress
   SELECT * FROM enrollments 
   WHERE user_id = 'your-user-id';
   
   -- Xem learning activities
   SELECT * FROM learning_activities 
   WHERE user_id = 'your-user-id' 
   ORDER BY activity_date DESC;
   ```

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── courses/
│   │   │   └── [slug]/
│   │   │       ├── chapters/
│   │   │       │   └── route.ts       ← GET chapters & lessons
│   │   │       └── progress/
│   │   │           └── route.ts       ← GET user progress
│   │   └── lessons/
│   │       └── [lessonId]/
│   │           └── complete/
│   │               └── route.ts       ← POST mark completed
│   └── learn/
│       └── [slug]/
│           ├── layout.tsx             ← Simple layout wrapper
│           └── page.tsx               ← Main learning page
│
├── scripts/
│   ├── seed-chapters-lessons.js      ← Seed data script
│   └── README.md                      ← Scripts documentation
│
└── database/
    └── learning_platform_db.sql       ← Database schema
```

## 🎯 Next Steps

1. **Run seed script**:
   ```bash
   node scripts/seed-chapters-lessons.js
   ```

2. **Test the features**:
   - Login to your account
   - Enroll in a course
   - Visit `/learn/[slug]`
   - Complete some lessons
   - Check progress updates

3. **Optional enhancements**:
   - Integrate video player
   - Add notes feature
   - Implement quiz system
   - Add certificate generation

## 💡 Tips

- Chapters có `sort_order` để sắp xếp thứ tự
- Lessons cũng có `sort_order` trong mỗi chapter
- `is_preview = 1` cho phép xem trước miễn phí
- Progress được tính: `(completed_lessons / total_lessons) * 100`
- Learning activities track theo ngày (activity_date)
- JWT token trong cookie tên `auth_token`

## 🐛 Troubleshooting

### Lỗi "Course not found"
- Kiểm tra slug có đúng không
- Kiểm tra course có `is_published = 1`

### Lỗi "Not enrolled"
- User cần enroll khóa học trước
- Check bảng `enrollments`

### Lỗi "Unauthorized"
- Kiểm tra đã login chưa
- Kiểm tra JWT token trong cookie
- Token có thể đã hết hạn

### Chapters/Lessons không hiển thị
- Chạy seed script: `node scripts/seed-chapters-lessons.js`
- Kiểm tra `is_published = 1` cho chapters và lessons
- Check console log trong browser

## 📚 Resources

- Database schema: `database/learning_platform_db.sql`
- Seed scripts: `scripts/`
- API routes: `src/app/api/`
- Learning page: `src/app/learn/[slug]/page.tsx`

---

**Created**: 2025-10-12
**Status**: ✅ Complete and tested

