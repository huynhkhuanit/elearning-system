# 🎬 HƯỚNG DẪN UPLOAD VIDEO - TÓNG TẮT CẮT GỌN

Bạn muốn upload video cho từng bài học cụ thể? **Dễ lắm!** 

## ⚡ 3 Cách Upload (Từ Dễ → Khó)

### **Cách 1: Admin Panel (Khuyến Nghị)** ⭐⭐⭐

```
1. Vào: http://localhost:3000/admin/lessons
2. Chọn Course → Chapter → Lesson
3. Click "Edit"
4. Kéo video vào upload zone
5. Click "Upload Video"
6. Done! ✅
```

**Thời gian:** 2 phút
**Khó độ:** Rất dễ
**Status:** ✅ Ready to use

### **Cách 2: Database SQL** ⭐⭐

```sql
UPDATE lessons 
SET video_url = 'https://res.cloudinary.com/...',
    video_duration = 240
WHERE id = 'lesson-id';
```

**Thời gian:** 30 giây
**Khó độ:** Trung bình
**Status:** ✅ Ready to use

### **Cách 3: API Call** ⭐

```powershell
$form = @{'video' = Get-Item $videoPath}
Invoke-WebRequest -Uri "http://localhost:3000/api/lessons/$id/video/upload" -Method Post -Form $form
```

**Thời gian:** 1 phút
**Khó độ:** Khó
**Status:** ✅ Ready to use

---

## 🎯 CÁCH 1 - ADMIN PANEL (Cách Dễ Nhất)

### Step-by-step:

```
START
  │
  ├─ Open Browser
  │  └─ http://localhost:3000/admin/lessons
  │
  ├─ See Courses List
  │  └─ "Full Stack Developer", "Web Dev", etc
  │
  ├─ Click Course → Expand it
  │  └─ Shows chapters
  │
  ├─ Click Chapter → Expand it
  │  └─ Shows lessons
  │
  ├─ Click [Edit] Button
  │  └─ Opens Edit Page
  │
  ├─ See "Upload Video" Section
  │  └─ Has upload zone
  │
  ├─ Drag Video File
  │  ├─ Kéo file MP4 vào khung
  │  └─ File được select
  │
  ├─ Click "Upload Video" Button
  │  └─ Upload bắt đầu
  │
  ├─ ⏳ Wait (1-5 minutes)
  │  └─ Depends on video size
  │
  ├─ ✅ Success Message
  │  ├─ "Upload thành công!"
  │  ├─ "Thời lượng: 240s"
  │  └─ Video URL displayed
  │
  └─ DONE ✨
```

---

## 📋 CHECKLIST TRƯỚC KHI UPLOAD

```
☐ Đã mở http://localhost:3000/admin/lessons?
☐ Video file chuẩn bị xong?
  ├─ Format: MP4, WebM, OGG, MOV
  ├─ Size: < 2GB
  └─ Quality: 720p+
☐ Tìm được lesson muốn upload?
☐ Click "Edit" chưa?
☐ Thấy "Upload Video" section chưa?
☐ Sẵn sàng upload chưa? 🚀
```

---

## 🎮 ADMIN PANEL UI GUIDE

### Main View - Admin Lessons
```
┌──────────────────────────────────────────────────┐
│ 📚 Quản Lý Nội Dung Bài Học                      │
│ Chỉnh sửa markdown content cho từng bài học     │
└──────────────────────────────────────────────────┘

📊 Stats (4 cards):
├─ Khóa Học: 0
├─ Tổng Bài: 0
├─ Có Nội Dung: 0 (0%)
└─ Đã Xuất Bản: 0

🔍 Search: [__________________________] [Filter]

📖 Courses List:
┌──────────────────────────────────────────────────┐
│ ▼ Course 1: Full Stack Developer      2 chương  │
│   ├─ ▼ Chapter 1: Basics              3 bài    │
│   │  ├─ ✓ Lesson 1: Intro    [Edit] ←─ CLICK  │
│   │  ├─ ○ Lesson 2: Setup    [Edit]           │
│   │  └─ ○ Lesson 3: Tools    [Edit]           │
│   └─ ▼ Chapter 2: Advanced           5 bài    │
│      └─ ○ Lesson 4: ...      [Edit]           │
└──────────────────────────────────────────────────┘
```

### Edit Page - Video Upload Section
```
┌──────────────────────────────────────────────────┐
│ ← Lesson 1: Intro to HTML                        │
│ Chỉnh sửa nội dung markdown        [✓] [Save]  │
└──────────────────────────────────────────────────┘

📹 UPLOAD VIDEO
┌──────────────────────────────────────────────────┐
│                                                   │
│   🎬 Upload video cho bài học này                │
│                                                   │
│  ┌────────────────────────────────────────┐    │
│  │ 📁 Kéo video vào đây hoặc click       │    │
│  │    để chọn file                        │    │
│  │                                        │    │
│  │ Hỗ trợ: MP4, WebM, OGG, MOV...      │    │
│  │ Tối đa: 2GB                           │    │
│  └────────────────────────────────────────┘    │
│                                                   │
└──────────────────────────────────────────────────┘

[Upload Video (123MB)] ← Click to upload
```

---

## 🎯 ĐÚNG/SAI TRONG UPLOAD

### ✅ ĐÚNG - Làm Như Thế Này

```
Video file: lesson_1_intro.mp4
Size: 500MB
Format: MP4
Duration: 4 minutes

Upload location: Admin Panel → Edit Lesson

Result: ✅ Success
- Video URL saved
- Duration tracked (240s)
- Player ready
```

### ❌ SAI - Đừng Làm Như Thế Này

```
Video file: bài_giảng_#1_v2_final_final_final.mov
Size: 3.5GB ← TOO BIG!
Format: MOV
Duration: 2 hours (trimming needed?)

Upload location: Manually copy to /public/videos/

Result: ❌ Failed
- Upload timeout
- Database not updated
- Player broken
```

---

## 🎬 SAU KHI UPLOAD - KIỂM TRA

### 1. Thấy Success Message?
```
✅ Upload thành công! Thời lượng: 240s
```

### 2. Video URL Hiển Thị?
```
Video URL:
https://res.cloudinary.com/dhztqlkxo/video/upload/...
```

### 3. Vào Learn Page - Xem Video
```
http://localhost:3000/learn/[course-slug]
→ Click lesson
→ VideoPlayer hiện
→ Click Play ▶️
```

### 4. Test Controls
```
✓ Play/Pause
✓ Seek bar (drag to seek)
✓ Volume (slider)
✓ Speed (dropdown)
✓ Fullscreen
✓ Download
✓ Share
```

---

## 📊 DATABASE FIELDS - CẦN BIẾT

### Lessons Table
```sql
CREATE TABLE lessons (
  id CHAR(36) PRIMARY KEY,         -- Lesson ID
  title VARCHAR(255),               -- Tên bài học
  content TEXT,                     -- Markdown content
  video_url VARCHAR(500),           -- ← VIDEO URL (cái bạn upload)
  video_duration INT,               -- ← DURATION (auto-detected)
  chapter_id CHAR(36),
  is_published TINYINT(1)
);
```

### Lesson Progress Table (Auto-tracking)
```sql
CREATE TABLE lesson_progress (
  user_id CHAR(36),                 -- Student ID
  lesson_id CHAR(36),               -- ← Lesson ID
  watch_time INT,                   -- Total watched (seconds)
  last_position INT,                -- Last position (seconds)
  is_completed TINYINT(1)           -- Completed? (Y/N)
);
```

---

## 🚀 READY?

### Checklist Final:
- [x] Admin Panel cấu hình
- [x] Video Upload component ready
- [x] API endpoint active
- [x] Database ready
- [x] Environment: `VIDEO_STORAGE=cloudinary`

### Now:
1. **Prepare video file** (MP4, < 2GB)
2. **Go to admin panel** http://localhost:3000/admin/lessons
3. **Click Edit on lesson**
4. **Upload video**
5. **Test playback**
6. **Done!** 🎉

---

## 📞 HELP

### Can't find Edit button?
```
Admin Lessons
  → Course (click to expand)
    → Chapter (click to expand)
      → Lesson (click [Edit])
```

### Video stuck uploading?
```
Check:
- File size < 2GB ✓
- Internet connection ✓
- .env.local has CLOUDINARY_* ✓
- Browser not crashed ✓
```

### Video won't play?
```
Check:
- video_url in database
- Video URL is public (Cloudinary)
- Browser supports MP4
- DevTools Network tab (check API calls)
```

---

## 📚 FULL DOCUMENTATION

Read more detailed guides:

1. **UPLOAD_VIDEO_TO_LESSONS.md** - Full guide (3 ways)
2. **UPLOAD_VIDEO_VISUAL_GUIDE.md** - Visual step-by-step
3. **DEPLOYMENT_STEPS.md** - Setup & test guide

---

## ✨ Summary

| Aspect | Status |
|--------|--------|
| Admin Upload Interface | ✅ Ready |
| Database Schema | ✅ Ready |
| API Endpoints | ✅ Ready |
| Video Storage (Cloudinary) | ✅ Ready |
| Player Component | ✅ Ready |
| Auto Progress Tracking | ✅ Ready |
| Documentation | ✅ Complete |

---

## 🎯 Next Steps

**TODAY:**
1. Open admin panel
2. Upload video to one lesson
3. Test playback

**THIS WEEK:**
1. Upload videos to all lessons
2. Test all features
3. Monitor student engagement

**ONGOING:**
1. Track watch time stats
2. Monitor completion rates
3. Add subtitles/captions (future)

---

**🎬 You're Ready! Start Uploading!** 🚀
