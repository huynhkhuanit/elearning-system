# Database Seeding Scripts

Hướng dẫn seed data cho database learning platform.

## Prerequisites

Đảm bảo bạn đã:
1. Cài đặt MySQL và tạo database `learning_platform_db`
2. Chạy file SQL schema: `database/learning_platform_db.sql`
3. Có file `.env.local` với các biến môi trường database

## Thứ tự chạy scripts

### 1. Seed Courses (Nếu chưa có courses)
```bash
node scripts/seed-courses.js
```

Script này sẽ tạo các khóa học mẫu trong database.

### 2. Seed Chapters và Lessons
```bash
node scripts/seed-chapters-lessons.js
```

Script này sẽ:
- Tạo 10 chapters cho mỗi course
- Mỗi chapter có 4-8 lessons
- Tổng cộng ~60 lessons mỗi khóa học
- Tự động cập nhật `total_lessons` trong bảng courses
- Format duration từ seconds sang mm:ss

## Cấu trúc data được seed

### Chapters (10 chapters per course):
1. **Giới thiệu khóa học** - 4 lessons (2 preview)
2. **Kiến thức nền tảng** - 6 lessons
3. **Lập trình nâng cao** - 5 lessons  
4. **Dự án thực tế 1** - 8 lessons
5. **Kiến thức nâng cao** - 6 lessons
6. **Dự án thực tế 2** - 8 lessons
7. **Microservices Architecture** - 6 lessons
8. **DevOps và Cloud** - 6 lessons
9. **Dự án tốt nghiệp** - 6 lessons
10. **Bonus: Career Development** - 5 lessons

### Lesson Types:
- `video`: Bài học video (có video_duration)
- `reading`: Bài đọc văn bản
- `quiz`: Bài kiểm tra

### Preview Lessons:
- 2 lessons đầu tiên của chapter 1 được đánh dấu `is_preview = 1`
- Người dùng chưa đăng ký vẫn có thể xem preview lessons

## Kiểm tra data sau khi seed

```sql
-- Kiểm tra số lượng chapters
SELECT c.title as course_title, COUNT(ch.id) as total_chapters
FROM courses c
LEFT JOIN chapters ch ON c.id = ch.course_id
GROUP BY c.id;

-- Kiểm tra số lượng lessons
SELECT c.title as course_title, COUNT(l.id) as total_lessons
FROM courses c
LEFT JOIN chapters ch ON c.id = ch.course_id
LEFT JOIN lessons l ON ch.id = l.chapter_id
GROUP BY c.id;

-- Kiểm tra tổng thời lượng
SELECT c.title, 
       COUNT(l.id) as lessons,
       SUM(l.video_duration) as total_seconds,
       ROUND(SUM(l.video_duration)/3600, 2) as total_hours
FROM courses c
LEFT JOIN chapters ch ON c.id = ch.course_id
LEFT JOIN lessons l ON ch.id = l.chapter_id
GROUP BY c.id;
```

## Troubleshooting

### Lỗi: "No published courses found"
- Chạy `node scripts/seed-courses.js` trước
- Kiểm tra có courses với `is_published = 1`

### Lỗi: Connection refused
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin kết nối trong `.env.local`

### Lỗi: Foreign key constraint
- Đảm bảo đã chạy schema SQL trước
- Kiểm tra courses đã tồn tại

## Clean up (Xóa data)

Nếu muốn xóa và seed lại:

```sql
-- Xóa tất cả lessons và chapters
DELETE FROM lessons;
DELETE FROM chapters;

-- Reset auto_increment (optional)
ALTER TABLE lessons AUTO_INCREMENT = 1;
ALTER TABLE chapters AUTO_INCREMENT = 1;
```

Sau đó chạy lại script seed.

