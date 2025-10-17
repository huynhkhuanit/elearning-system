# 🎯 UPLOAD VIDEO - QUICK VISUAL GUIDE

## 3 Cách Upload Video

```
┌────────────────────────────────────────────────────────────┐
│           UPLOAD VIDEO CHO BÀI HỌC                         │
└────────────────────────────────────────────────────────────┘

┌─ Cách 1: Admin Panel (EZ) ─────────────────────────────────┐
│                                                             │
│  1. http://localhost:3000/admin/lessons                    │
│  2. Chọn Course → Chapter → Lesson                         │
│  3. Click "Edit"                                           │
│  4. Kéo video vào upload zone                              │
│  5. Click "Upload Video"                                   │
│  6. Wait & Done! ✅                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ Cách 2: Database SQL (Fast) ─────────────────────────────┐
│                                                             │
│  UPDATE lessons                                            │
│  SET video_url = 'https://cloudinary.../video.mp4',       │
│      video_duration = 240                                  │
│  WHERE id = 'lesson-id';                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─ Cách 3: API (Pro) ──────────────────────────────────────┐
│                                                             │
│  POST /api/lessons/[id]/video/upload                      │
│  Content-Type: multipart/form-data                        │
│  Body: { video: File }                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Admin Panel - Step by Step

### Screen 1: Admin Lessons List
```
┌─────────────────────────────────────────────────────────┐
│ 📚 Quản Lý Nội Dung Bài Học                             │
└─────────────────────────────────────────────────────────┘

📊 Stats:
┌─────────┬─────────┬──────────┬───────────┐
│ Khóa    │ Tổng    │ Có       │ Đã        │
│ Học     │ Bài     │ Nội      │ Xuất      │
│ 0       │ 0       │ Dung 0   │ Bản 0     │
└─────────┴─────────┴──────────┴───────────┘

🔍 Search: [________________] [Filter]

📖 Courses:
┌─────────────────────────────────────────────┐
│ ▼ Full Stack Developer           2 chương  │
│   ├─ ▼ Chapter 1: Basics        5 bài    │
│   │  ├─ ✓ Lesson 1: Intro       [EDIT]    │
│   │  ├─ ○ Lesson 2: Setup       [EDIT]    │
│   │  └─ ○ Lesson 3: Tools       [EDIT]    │
│   └─ ▼ Chapter 2: Advanced      3 bài    │
│      ├─ ○ Lesson 4: ...         [EDIT]    │
└─────────────────────────────────────────────┘
       ↑
    Click Edit
```

### Screen 2: Edit Lesson
```
┌──────────────────────────────────────────────────┐
│ ← Lesson 1: Introduction to HTML                 │
│ Chỉnh sửa nội dung markdown      [✓] [Save]    │
└──────────────────────────────────────────────────┘

┌─ Upload Video ─────────────────────────────────┐
│                                                 │
│   📁 Kéo video vào đây hoặc click để chọn     │
│                                                 │
│   Hỗ trợ: MP4, WebM, OGG, MOV...             │
│   Tối đa: 2GB                                  │
│                                                 │
└─────────────────────────────────────────────────┘

┌─ Markdown Editor ──────────────────────────────┐
│                                                 │
│ # Introduction                                  │
│ This is a lesson about...                      │
│                                                 │
└─────────────────────────────────────────────────┘

┌─ Mẹo Markdown ────────┬─ Thông Tin Bài Học ──┐
│ # Tiêu đề             │ ID: ccf55f7c-...     │
│ **Bold**              │ Chapter: ch-123-...  │
│ *Italic*              │ Updated: 2025-10-18  │
│ - List items          │ ✓ Có nội dung        │
└──────────────────────┴──────────────────────┘
```

### Screen 3: Upload in Progress
```
┌─────────────────────────────────────────────┐
│ ⏳ Đang upload...                          │
│                                              │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░  45%                   │
│                                              │
└─────────────────────────────────────────────┘
```

### Screen 4: Upload Success
```
┌─────────────────────────────────────────────┐
│ ✅ Upload thành công! Thời lượng: 240s      │
│                                              │
│ ✓ Video đã upload                          │
│   Thời lượng: 240s                         │
│                                         [🗑️] │
│                                              │
│ Video URL:                                  │
│ https://res.cloudinary.com/dhztqlkxo/...  │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Flow Chart: Upload Video

```
START
  │
  ├─ Admin Panel
  │  │
  │  ├─ Open http://localhost:3000/admin/lessons
  │  │
  │  ├─ Click Course
  │  │  │
  │  │  ├─ Click Chapter
  │  │  │  │
  │  │  │  ├─ Click Lesson
  │  │  │  │  │
  │  │  │  │  ├─ Click "Edit"
  │  │  │  │  │  │
  │  │  │  │  │  ├─ See "Upload Video" Section
  │  │  │  │  │  │  │
  │  │  │  │  │  │  ├─ Drag & Drop Video
  │  │  │  │  │  │  │  │
  │  │  │  │  │  │  │  └─ File Selected ✓
  │  │  │  │  │  │  │
  │  │  │  │  │  │  ├─ Click "Upload Video"
  │  │  │  │  │  │  │  │
  │  │  │  │  │  │  │  ├─ ⏳ Uploading...
  │  │  │  │  │  │  │  │
  │  │  │  │  │  │  │  └─ ✅ Success!
  │  │  │  │  │  │  │
  │  │  │  │  │  │  └─ Video URL Displayed
  │  │  │  │  │  │
  │  │  │  │  │  └─ Close Edit Page
  │  │  │  │  │
  │  │  │  │  └─ Go to Learn Page
  │  │  │  │     │
  │  │  │  │     └─ Video Player Loaded ▶️
  │  │  │  │
  │  │  │  └─ Play, Seek, Enjoy! 🎬
  │  │  │
  │  │  └─ DONE
  │  │
  │  └─ SUCCESS ✅
  │
  └─ END
```

---

## Lesson ID - Tìm ID

### Method 1: From Admin Panel
```
Admin Lessons
  → Click Edit pada Lesson bất kỳ
  → Xem URL: /admin/lessons/[LESSON_ID]/edit
  → Copy cái trong []

Ví dụ:
URL: /admin/lessons/ccf55f7c-a5d1-11f0-8481-a036bc320b36/edit
ID: ccf55f7c-a5d1-11f0-8481-a036bc320b36 ← Copy cái này
```

### Method 2: From Database
```sql
-- Query tất cả lessons
SELECT 
  l.id,
  l.title,
  c.title as chapter_name,
  co.title as course_name
FROM lessons l
JOIN chapters c ON l.chapter_id = c.id
JOIN courses co ON c.course_id = co.id
LIMIT 20;

-- Output
id                          | title              | chapter_name | course_name
ccf55f7c-...               | Intro to HTML      | Chapter 1    | Web Dev
ccf55f7d-...               | HTML Structure     | Chapter 1    | Web Dev
ccf55f7e-...               | HTML Forms         | Chapter 2    | Web Dev
```

---

## Video Requirements

```
✅ FORMAT (chọn 1)
   ├─ MP4 (Khuyến nghị) - .mp4
   ├─ WebM - .webm
   ├─ OGG - .ogv
   ├─ MOV - .mov
   ├─ AVI - .avi
   └─ MKV - .mkv

✅ SIZE
   └─ Max: 2GB

✅ QUALITY (recommend)
   └─ 720p - 1080p

✅ DURATION
   └─ Unlimited (auto-tracked)

✅ FILENAME
   ├─ Không dấu tiếng Việt
   ├─ Không ký tự lạ
   ├─ Ví dụ tốt:
   │  ├─ lesson_1.mp4
   │  ├─ HTML_Basics.mp4
   │  └─ Ch1_Intro_video.mp4
   └─ Ví dụ xấu:
      ├─ bài học #1.mp4
      ├─ vídeo@2025.mp4
      └─ tập.tin.này.mp4
```

---

## DevTools Verification

```
Step 1: Open DevTools
  └─ F12 on Browser

Step 2: Go to Network Tab
  └─ F12 → Network

Step 3: Play Video
  └─ Go to Learn page → Play lesson video

Step 4: Check Network Requests
  ├─ GET /api/lessons/*/video
  │  └─ Status: 206 (Partial Content) ✓
  │
  └─ POST /api/lessons/*/video/progress
     └─ Every 10 seconds ✓

Step 5: Check Console Tab
  ├─ F12 → Console
  └─ No errors (or only warnings) ✓

SUCCESS ✅
```

---

## Database Update (Advanced)

```sql
-- 1. Find lesson ID first
SELECT id, title FROM lessons WHERE title LIKE '%HTML%';

-- 2. Get Cloudinary URL
-- (From admin upload success message or Cloudinary dashboard)

-- 3. Update database
UPDATE lessons 
SET 
  video_url = 'https://res.cloudinary.com/dhztqlkxo/video/upload/v17289428/lesson1_abc123.mp4',
  video_duration = 240
WHERE id = 'ccf55f7c-a5d1-11f0-8481-a036bc320b36';

-- 4. Verify
SELECT video_url, video_duration FROM lessons 
WHERE id = 'ccf55f7c-a5d1-11f0-8481-a036bc320b36';

-- Result:
-- ✓ video_url updated
-- ✓ video_duration updated
```

---

## Troubleshooting Matrix

```
PROBLEM                    | SOLUTION
──────────────────────────┼─────────────────────────────────
Video won't upload        | • Check file size (< 2GB)
                          | • Check format (MP4, WebM, etc)
                          | • Check network connection
                          | • Retry upload
                          |
Upload takes too long     | • Check internet speed
                          | • Try smaller file
                          | • Try different format
                          |
Video won't play          | • Check video URL in database
                          | • Check browser support
                          | • Clear cache & reload
                          | • Try different browser
                          |
Seek/Fast-forward broken  | • Check server logs
                          | • Verify Range header support
                          | • Check CORS headers
                          |
Progress not saving       | • Check user authentication
                          | • Check database connection
                          | • Check DevTools Network tab
                          | • Check API response
```

---

## After Upload - What's Next

```
✅ AFTER SUCCESSFUL UPLOAD

1. Video URL saved
   ├─ In database: lessons.video_url
   └─ Visible in admin panel

2. Duration auto-detected
   ├─ In database: lessons.video_duration
   └─ Display in player

3. Progress tracking enabled
   ├─ Auto-save every 10 seconds
   ├─ Track watch position
   └─ Track watch time

4. Student experience
   ├─ See video on learn page
   ├─ Play with all controls
   ├─ Resume from last position
   ├─ Track progress
   └─ Complete lesson

📊 ANALYTICS
├─ View watch time per student
├─ See completion rate
├─ Track engagement
└─ Identify at-risk students
```

---

## Success Checklist

```
☐ Video file prepared (< 2GB, MP4/WebM/OGG)
☐ Admin panel accessible
☐ Lesson ID identified
☐ Video dragged to upload zone
☐ Upload started
☐ Upload completed (✅ message)
☐ Video URL displayed
☐ Duration recorded
☐ Go to learn page
☐ Select lesson
☐ VideoPlayer appeared
☐ Play button works
☐ Seek works
☐ Volume works
☐ Speed works
☐ Fullscreen works
☐ DevTools shows API calls
☐ Auto-save every 10s working
☐ Reload page, resume works
```

✅ **ALL DONE!** Your video streaming is ready! 🎬
