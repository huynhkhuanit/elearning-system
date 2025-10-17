# 🎬 HƯỚNG DẪN UPLOAD VIDEO CHO TỪNG BÀI HỌC

## 📌 Tóm Tắt

Bạn có **2 cách** để upload video cho từng bài học:

1. **Cách 1: Admin Panel** - Upload trực tiếp từ giao diện admin (Khuyến nghị) ✅
2. **Cách 2: Database SQL** - Update trực tiếp vào database (Nhanh nhất)
3. **Cách 3: API** - Call API endpoint

---

## ✅ CÁCH 1: UPLOAD QUA ADMIN PANEL (Dễ Nhất)

### Step 1: Vào Admin Lessons
```
http://localhost:3000/admin/lessons
```

### Step 2: Chọn Bài Học Cần Upload Video
```
Admin Lessons
  → Click vào Course
    → Click vào Chapter
      → Click vào Lesson
        → Click "Edit"
```

Ví dụ:
```
Full Stack Developer
  → Chapter 1: HTML Basics
    → Lesson 1: Introduction to HTML
      → [Click Edit Button]
```

### Step 3: Upload Video

**Giao diện Edit Lesson:**
```
┌─ Upload Video ─────────────────────┐
│                                     │
│  📁 Kéo video vào đây hoặc click    │
│     để chọn file                   │
│                                     │
│  Hỗ trợ: MP4, WebM, OGG, MOV...   │
│  Tối đa: 2GB                       │
│                                     │
└─────────────────────────────────────┘
```

**Các bước:**
1. Kéo file video vào khung màu xanh
   - HOẶC Click vào khung → Chọn file

2. Chọn file video:
   ```
   C:\Users\YourName\Downloads\lesson.mp4
   ```

3. Click "Upload Video (123MB)"

4. Chờ upload hoàn thành (~1-5 phút)

5. Khi thành công, sẽ hiện:
   ```
   ✅ Upload thành công! Thời lượng: 240s
   ```

### Step 4: Verify Video

Sau khi upload:
- Video URL sẽ hiển thị
- Thời lượng sẽ được lưu
- Bài học sẽ có video player khi học

---

## ✅ CÁCH 2: UPDATE DATABASE TRỰC TIẾP (Cách Nhanh)

Nếu bạn có Cloudinary URL sẵn, update trực tiếp vào database:

### Cách 2A: MySQL Workbench

```sql
-- 1. Tìm lesson ID
SELECT id, title, chapter_id 
FROM lessons 
LIMIT 10;

-- 2. Update video_url và video_duration
UPDATE lessons 
SET 
  video_url = 'https://res.cloudinary.com/...',
  video_duration = 240
WHERE id = 'lesson-id-from-step-1';

-- 3. Verify
SELECT id, title, video_url, video_duration 
FROM lessons 
WHERE id = 'lesson-id-from-step-1';
```

### Cách 2B: Nếu đã upload qua Admin

```sql
-- Check video đã upload
SELECT id, title, video_url, video_duration 
FROM lessons 
WHERE video_url IS NOT NULL;
```

### Database Fields Cần Update:
```
Table: lessons
- id: UUID (khóa chính - đừng sửa)
- video_url: VARCHAR(500) - URL video
- video_duration: INT - Thời lượng video (giây)

Table: lesson_progress (tự động tracking)
- last_position: INT - Vị trí xem lần cuối
- watch_time: INT - Thời gian xem
```

---

## ✅ CÁCH 3: CALL API ENDPOINT

### Upload Video qua API

```bash
# PowerShell
$videoPath = "C:\Users\huynh\Downloads\ThayGiaoBa.mp4"
$lessonId = "lesson-id"

$form = @{
    'video' = Get-Item $videoPath
}

$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/lessons/$lessonId/video/upload" `
  -Method Post `
  -Form $form

$response.Content | ConvertFrom-Json
```

**Response:**
```json
{
  "success": true,
  "videoUrl": "https://res.cloudinary.com/dhztqlkxo/video/upload/...",
  "videoDuration": 240,
  "lessonId": "lesson-id"
}
```

### Delete Video

```bash
# Xóa video từ lesson
Invoke-WebRequest `
  -Uri "http://localhost:3000/api/lessons/$lessonId/video/upload" `
  -Method Delete
```

---

## 📋 QUY TRÌNH UPLOAD VIDEO ĐẦY ĐỦ

### Bước 1: Chuẩn Bị Video
```
✅ Video format: MP4 (khuyến nghị), WebM, OGG, MOV
✅ File size: < 2GB
✅ Chất lượng: 720p - 1080p (tối ưu)
✅ Tên file: không có ký tự lạ

Ví dụ tên file tốt:
- lesson_1_intro.mp4
- HTML_Basics.mp4
- Ch1_Part1_video.mp4
```

### Bước 2: Tìm Lesson ID
**Cách A: Từ Admin Panel**
```
Admin → Lessons → Chọn lesson
→ Copy ID từ URL
Ví dụ: /admin/lessons/[LESSON_ID]/edit
```

**Cách B: Từ Database**
```sql
SELECT id, title FROM lessons WHERE title LIKE '%HTML%' LIMIT 1;
```

### Bước 3: Upload
```
1. Vào admin edit page
2. Kéo video vào upload zone
3. Click "Upload Video"
4. Chờ hoàn thành
```

### Bước 4: Xác Nhận
```
✅ Video URL hiển thị
✅ Thời lượng được ghi nhận
✅ Lesson progress tracking active
✅ Learn page hiên video player
```

### Bước 5: Test Playback
```
1. Vào learn page
   http://localhost:3000/learn/[course-slug]

2. Click vào lesson có video

3. VideoPlayer hiện lên
4. Click Play button
5. Test các controls:
   - Play/Pause ▶️
   - Seek bar ⏱️
   - Volume 🔊
   - Speed ⚙️
   - Fullscreen ⛶
```

---

## 🎯 DANH SÁCH LESSON ID

Hãy tìm lesson ID của bạn:

```sql
-- View tất cả lessons
SELECT 
  l.id,
  l.title,
  c.title as chapter,
  co.title as course,
  l.video_url
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
JOIN courses co ON c.course_id = co.id
ORDER BY co.title, c.sort_order, l.sort_order;
```

**Output sẽ giống:**
```
id                                  | title              | chapter  | course               | video_url
ccf55f7c-...                       | Intro to HTML      | Ch 1     | Web Development      | NULL
ccf55f7d-...                       | HTML Structure     | Ch 1     | Web Development      | NULL
ccf55f7e-...                       | HTML Forms         | Ch 2     | Web Development      | NULL
...
```

---

## 🔧 TROUBLESHOOTING

### ❌ Upload Thất Bại - "Không tìm thấy file"

**Nguyên nhân:**
- File không tồn tại
- Đường dẫn file sai
- Thiếu quyền truy cập

**Giải pháp:**
```powershell
# Kiểm tra file tồn tại
Test-Path "C:\path\to\video.mp4"

# Hoặc copy toàn bộ đường dẫn
Get-ChildItem "C:\Users\huynh\Downloads\" -Filter "*.mp4"
```

### ❌ Upload Thất Bại - "File quá lớn"

**Nguyên nhân:**
- Video > 2GB
- Bandwidth có hạn

**Giải pháp:**
```bash
# Nén video (optional)
ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4

# Hoặc cắt video
ffmpeg -i input.mp4 -t 300 -c copy output.mp4  # Cắt 5 phút đầu
```

### ❌ Video Không Phát - "404 Not Found"

**Nguyên nhân:**
- Video URL không đúng
- Cloudinary credentials sai
- Network error

**Giải pháp:**
```bash
# 1. Kiểm tra .env.local
cat .env.local | grep VIDEO_STORAGE
# Output: VIDEO_STORAGE=cloudinary

# 2. Kiểm tra Cloudinary credentials
cat .env.local | grep CLOUDINARY
# Phải match với Cloudinary account

# 3. Test direct URL
curl -I "https://res.cloudinary.com/.../video.mp4"
# Phải return 200 OK
```

### ❌ Video Phát Lại Nhưng Seek Không Hoạt Động

**Nguyên nhân:**
- Server không support HTTP Range
- CDN caching issue

**Giải pháp:**
```bash
# Test Range requests
curl -I -H "Range: bytes=0-1024" \
  http://localhost:3000/api/lessons/[id]/video

# Kiểm tra Response headers:
# HTTP/1.1 206 Partial Content
# Content-Range: bytes 0-1024/[total]
```

### ❌ Upload Mất Kết Nối

**Nguyên nhân:**
- Timeout (file quá lớn)
- Network unstable

**Giải pháp:**
```bash
# Tăng timeout trong .env
NEXTAUTH_URL_INTERNAL=http://localhost:3000
# (next.js tự handle tăng timeout)

# Hoặc upload từ server (nhanh hơn)
# Copy video vào public/videos/
# Rồi update database trực tiếp
```

---

## 💡 MẸO & THỦ THUẬT

### Tip 1: Bulk Upload (Upload Nhiều Video Cùng Lúc)

```sql
-- Update nhiều lessons cùng lúc
-- Chỉ cần biết video URL pattern

UPDATE lessons 
SET video_url = CONCAT(
  'https://res.cloudinary.com/dhztqlkxo/video/upload/v1728942345/',
  SUBSTRING_INDEX(title, ' ', 1),
  '.mp4'
)
WHERE chapter_id = 'chapter-id' 
AND video_url IS NULL;
```

### Tip 2: Get Video Duration Tự Động

```javascript
// Sau khi upload, duration tự động detect
// Từ video metadata (Cloudinary API)
// Không cần manual input
```

### Tip 3: Auto-Convert Video Format

```bash
# Cloudinary auto-convert, nhưng có thể specify:
# Thêm transformation vào URL
# .../video/upload/q_auto,f_auto/video.mp4
```

### Tip 4: Track Video Watch Time

```sql
-- View watch time statistics
SELECT 
  u.username,
  l.title as lesson,
  lp.watch_time,
  lp.last_position,
  lp.is_completed
FROM lesson_progress lp
JOIN users u ON lp.user_id = u.id
JOIN lessons l ON lp.lesson_id = l.id
WHERE lp.watch_time > 0
ORDER BY lp.watch_time DESC;
```

---

## 🎯 CHECKLIST UPLOAD VIDEO

- [ ] Video file chuẩn bị (< 2GB)
- [ ] Format video hỗ trợ (MP4, WebM, OGG)
- [ ] `.env.local` cấu hình `VIDEO_STORAGE=cloudinary`
- [ ] Cloudinary credentials có sẵn
- [ ] Admin panel truy cập được
- [ ] Lesson ID xác định rõ ràng
- [ ] Upload video từ admin panel
- [ ] Video URL hiển thị
- [ ] Thời lượng được ghi nhận
- [ ] Test playback trên learn page
- [ ] Tất cả controls hoạt động (play, seek, volume, speed)
- [ ] DevTools kiểm tra network requests
- [ ] Auto-save progress hoạt động

---

## 📚 THAM KHẢO

### Database Schema
```sql
CREATE TABLE lessons (
  id CHAR(36) PRIMARY KEY,
  chapter_id CHAR(36),
  title VARCHAR(255),
  content TEXT,
  video_url VARCHAR(500),           -- ← URL video
  video_duration INT,                -- ← Thời lượng (giây)
  sort_order INT,
  is_published TINYINT(1),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE lesson_progress (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  lesson_id CHAR(36),
  watch_time INT,                    -- ← Thời gian xem (giây)
  last_position INT,                 -- ← Vị trí xem cuối (giây)
  is_completed TINYINT(1),
  updated_at DATETIME
);
```

### API Endpoints
```
POST   /api/lessons/[lessonId]/video/upload
GET    /api/lessons/[lessonId]/video
DELETE /api/lessons/[lessonId]/video/upload
POST   /api/lessons/[lessonId]/video/progress
```

### Supported Formats
```
✅ MP4 (MPEG-4 H.264) - Khuyến nghị
✅ WebM (VP8/VP9)
✅ OGG (Theora)
✅ MOV (QuickTime)
✅ AVI (MPEG-2)
✅ MKV (Matroska)
```

---

## 🎉 Success!

Khi hoàn thành:
1. Video hiển thị trên learn page ✅
2. Player controls hoạt động ✅
3. Auto-save progress mỗi 10s ✅
4. Users có thể resume video ✅
5. Watch time statistics available ✅

---

**Status: 🟢 READY TO UPLOAD**

Hãy bắt đầu upload video cho bài học của bạn! 🚀
