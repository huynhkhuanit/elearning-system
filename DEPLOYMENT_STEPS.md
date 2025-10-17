# 🚀 HƯỚNG DẪN TRIỂN KHAI VIDEO STREAMING

## ✅ Bước 1: Kiểm Tra Cấu Hình (Đã Xong)

`.env.local` của bạn:
```env
VIDEO_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=dhztqlkxo
CLOUDINARY_API_KEY=235478398431113
CLOUDINARY_API_SECRET=8fHrpRS4B2UGffHKMlU9ZJBOTT0
```

✅ **Cloudinary credentials có sẵn** → Sẵn sàng upload!

---

## ✅ Bước 2: Kiểm Tra API Endpoints

### Streaming API
```
GET /api/lessons/[lessonId]/video
```
- Stream video từ Cloudinary
- Support HTTP Range requests (seek/fast-forward)

### Upload API
```
POST /api/lessons/[lessonId]/video/upload
```
- Upload video lên Cloudinary
- Max 2GB file size
- Tự động detect MIME type

### Progress API
```
POST /api/lessons/[lessonId]/video/progress
```
- Auto-save watch position mỗi 10 giây
- Lưu vào `lesson_progress` table

---

## 🧪 Bước 3: Test Upload Video (Cách 1 - Postman)

### 3.1 Mở Postman
```
https://www.postman.com
```

### 3.2 Tạo Request
- **Method**: POST
- **URL**: `http://localhost:3000/api/lessons/test-lesson/video/upload`
- **Body**: 
  - Type: `form-data`
  - Key: `video`
  - Value: Chọn file video (MP4, WebM, OGG)

### 3.3 Click Send
```
Response:
{
  "success": true,
  "videoUrl": "https://res.cloudinary.com/...",
  "videoDuration": 240,
  "lessonId": "test-lesson"
}
```

✅ **Lưu lại `videoUrl`** để test playback

---

## 🧪 Bước 3: Test Upload Video (Cách 2 - cURL)

```bash
# Windows PowerShell
$filePath = "C:\path\to\video.mp4"
$lessonId = "test-lesson"

$form = @{
    'video' = Get-Item $filePath
}

Invoke-WebRequest `
  -Uri "http://localhost:3000/api/lessons/$lessonId/video/upload" `
  -Method Post `
  -Form $form `
  -OutFile response.json

# Xem kết quả
cat response.json
```

---

## 🎬 Bước 4: Test Playback - 2 Cách

### Cách 1: Qua Learn Page (Tự Động)

1. **Start dev server**
```bash
npm run dev
```

2. **Mở browser**
```
http://localhost:3000
```

3. **Tìm một course và lesson**
```
Courses → Chọn course → Chọn lesson
```

4. **VideoPlayer tự động hiện**
```
- Click Play
- Test seek bar
- Adjust volume
- Change speed (1.5x, 2x, etc)
- Click Fullscreen
```

✅ **Nếu video không xuất hiện:**
- Kiểm tra `lesson.video_url` có giá trị không
- Check DevTools Console (F12 → Console)
- Xem Network tab để debug

### Cách 2: Update Lesson với Video URL

**Step 1: Lấy Video URL**
```bash
# Từ response upload ở Bước 3
videoUrl = "https://res.cloudinary.com/..."
```

**Step 2: Update Database**
```sql
UPDATE lessons 
SET video_url = 'https://res.cloudinary.com/...',
    video_duration = 240
WHERE id = 'lesson-id';
```

**Step 3: Refresh Page**
```
F5 hoặc Ctrl+Shift+R
```

**Step 4: Play Video**
```
VideoPlayer sẽ hiện + tự động play
```

---

## 📊 Bước 5: Kiểm Tra DevTools

### 5.1 Network Tab
1. **F12** → **Network**
2. **Reload page** → **Xem requests:**

```
✅ GET /api/lessons/*/video          (Streaming)
✅ POST /api/lessons/*/video/progress (Auto-save every 10s)
```

### 5.2 Console Tab
1. **F12** → **Console**
2. **Play video** → **Xem logs:**

```javascript
// Auto-save progress logs
[VideoPlayer] Saving progress: {
  position: 45.2,
  watchedDuration: 45.2
}
```

### 5.3 Application Tab
1. **F12** → **Application** → **IndexedDB** (nếu cache)
2. Kiểm tra cached video data

---

## ✨ Bước 6: Kiểm Tra Features

### Player Controls
- [ ] ▶️ Play button hoạt động
- [ ] ⏸️ Pause button hoạt động
- [ ] ⏩ Seek bar có thể drag
- [ ] 🔊 Volume slider hoạt động
- [ ] 🔇 Mute button hoạt động
- [ ] ⚙️ Speed dropdown có options
- [ ] ⛶ Fullscreen mode hoạt động
- [ ] 💾 Download button hoạt động
- [ ] 📤 Share button hoạt động
- [ ] ⏱️ Time display chính xác

### Progress Tracking
- [ ] Watch video 30+ giây
- [ ] Check Network tab → POST requests mỗi 10s
- [ ] Reload page → Video resume từ position cũ
- [ ] Xem database → `lesson_progress.last_position` được update

---

## 🔧 Troubleshooting

### ❌ Video Not Playing

**Problem: VideoPlayer không xuất hiện**

Solution:
```bash
# 1. Kiểm tra lesson có video_url
SELECT video_url, video_duration FROM lessons LIMIT 1;

# 2. Kiểm tra .env.local
cat .env.local | grep VIDEO_STORAGE

# 3. Kiểm tra DevTools Console
F12 → Console → Xem errors
```

### ❌ Upload Failed

**Problem: Upload API return error**

Solution:
```bash
# 1. Kiểm tra file size
# Giới hạn: 2GB max

# 2. Kiểm tra file format
# Supported: MP4, WebM, OGG, MOV, AVI, MKV

# 3. Kiểm tra Cloudinary credentials
# Phải match exactly với .env.local
```

### ❌ Seek Not Working

**Problem: Progress bar không drag được**

Solution:
```bash
# 1. API phải return Content-Range header
curl -H "Range: bytes=0-1024" http://localhost:3000/api/lessons/*/video

# 2. Check response headers
# Phải có: Content-Range, Content-Length

# 3. Kiểm tra video format
# Phải là valid video (MP4, WebM, etc)
```

### ❌ Progress Not Saving

**Problem: Auto-save không work**

Solution:
```bash
# 1. DevTools Network tab
# Kiểm tra POST /api/lessons/*/video/progress

# 2. Kiểm tra user authentication
# Progress API cần authenticated user

# 3. Database connection
# Kiểm tra lesson_progress table tồn tại
```

---

## 📝 Admin Panel - Upload Video

### Thêm VideoUpload Component vào Admin

**File: `src/app/admin/lessons/[lessonId]/edit/page.tsx`**

```tsx
'use client';

import VideoUpload from '@/components/VideoUpload';

export default function EditLessonPage({ params }: { params: { lessonId: string } }) {
  const [lesson, setLesson] = useState<any>(null);

  const handleVideoUpload = (videoUrl: string, duration: number) => {
    // Update lesson
    setLesson({
      ...lesson,
      videoUrl,
      videoDuration: duration
    });
    
    // Save to database
    fetch(`/api/lessons/${lesson.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        videoUrl,
        videoDuration: duration
      })
    });
  };

  return (
    <div>
      <h1>Edit Lesson</h1>
      
      {/* Existing lesson form */}
      
      {/* Add VideoUpload component */}
      <VideoUpload 
        lessonId={lesson?.id}
        currentVideoUrl={lesson?.videoUrl}
        onUploadComplete={handleVideoUpload}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
```

---

## 🎯 Tóm Tắt Các Bước

| Bước | Hành Động | Status |
|------|----------|--------|
| 1 | Cấu hình `.env.local` | ✅ Done |
| 2 | Tạo `/public/videos/` | ✅ Done |
| 3 | Upload test video qua API | ⏳ To Do |
| 4 | Test playback trên Learn page | ⏳ To Do |
| 5 | Kiểm tra DevTools | ⏳ To Do |
| 6 | Verify all player controls | ⏳ To Do |
| 7 | Add VideoUpload to Admin | ⏳ Optional |

---

## 🚀 Sẵn Sàng Chưa?

```bash
# 1. Start dev server
npm run dev

# 2. Mở browser
http://localhost:3000

# 3. Upload video
# Dùng Postman hoặc cURL (Bước 3)

# 4. Test playback
# Vào Learn page, click lesson

# 5. Enjoy! 🎬
```

---

## 📚 Tài Liệu Tham Khảo

| File | Mục Đích |
|------|----------|
| `README_VIDEO_STREAMING.md` | Index & navigation |
| `VIDEO_QUICK_START.md` | 5-minute setup |
| `STREAMING_COMPLETE.md` | Full reference |
| `SOLUTION_OVERVIEW.md` | Executive summary |
| `scripts/check-video-implementation.js` | Diagnostic tool |

---

## ✅ Checklist Cuối Cùng

- [ ] `.env.local` có `VIDEO_STORAGE=cloudinary`
- [ ] `/public/videos/` directory tồn tại
- [ ] `npm run dev` chạy không lỗi
- [ ] Upload test video thành công
- [ ] Learn page hiện VideoPlayer
- [ ] Play button hoạt động
- [ ] Seek bar có thể drag
- [ ] Speed control hoạt động
- [ ] Fullscreen hoạt động
- [ ] Progress auto-save mỗi 10s

---

**Status: 🟢 READY TO DEPLOY**

Bạn đã sẵn sàng! Hãy bắt đầu từ Bước 3 - Upload test video. 🎯
