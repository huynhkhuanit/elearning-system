# Video Streaming & Management Implementation Guide

## 📋 Tổng Quan

Hướng dẫn triển khai hệ thống video streaming cho nền tảng học tập DHV LearnX. Hệ thống này hỗ trợ upload, lưu trữ, streaming, và quản lý video với controls đầy đủ.

---

## 🏗️ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (BROWSER)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  VideoPlayer Component (React)                       │   │
│  │  - Play/Pause/Seek Controls                         │   │
│  │  - Quality Selection (360p/720p/1080p)              │   │
│  │  - Progress Bar                                      │   │
│  │  - Volume Control                                    │   │
│  │  - Fullscreen Mode                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────────────────────────┘
           │ HTTP Range Requests (Stream)
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GET /api/lessons/[lessonId]/video                  │   │
│  │  - Video Streaming with Range Support               │   │
│  │  - Access Control & Authentication                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  POST /api/lessons/[lessonId]/video/upload          │   │
│  │  - Video Upload & Validation                         │   │
│  │  - Transcoding (Optional)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  POST /api/lessons/[lessonId]/video/complete        │   │
│  │  - Mark Lesson as Completed                          │   │
│  │  - Save Video Timestamp                              │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│                    STORAGE & DATABASE                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  OPTION 1: Cloudinary (Recommended)                 │   │
│  │  - Unlimited video storage                          │   │
│  │  - Automatic transcoding                            │   │
│  │  - CDN with global edge cache                        │   │
│  │  - Adaptive bitrate streaming (HLS/DASH)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  OPTION 2: Local Server Storage                      │   │
│  │  - Store in /public/videos/ (Dev)                   │   │
│  │  - External storage in Production                    │   │
│  │  - Manual transcoding required                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  OPTION 3: AWS S3 / Azure Blob Storage               │   │
│  │  - Scalable cloud storage                            │   │
│  │  - With CloudFront/Azure CDN                         │   │
│  │  - Requires manual video processing                  │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  MySQL Database                                       │   │
│  │  - Store video metadata (url, duration, format)     │   │
│  │  - Track user progress (last_position, completed)   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Storage Options Comparison

| Tiêu chí | Cloudinary | AWS S3 | Local Server | Azure Blob |
|---------|-----------|--------|------------|-----------|
| **Setup** | ⚡ Dễ (API key) | 🔧 Phức tạp | ✅ Đơn giản | 🔧 Trung bình |
| **Giá** | 💰 Free tier 10GB | 💵 Pay-as-you-go | 🆓 Server cost | 💵 Pay-as-you-go |
| **Transcoding** | ✅ Tự động | ❌ Manual | ❌ Manual | ⚠️ Lambda |
| **CDN** | ✅ Global CDN | ✅ CloudFront | ❌ Cần tự setup | ✅ Azure CDN |
| **Streaming** | ✅ HLS/DASH | ✅ Supported | ⚠️ Basic HTTP | ✅ Supported |
| **Scala** | ✅ Unlimited | ✅ Unlimited | ❌ Limited | ✅ Unlimited |
| **Phù hợp** | **Sản phẩm** | **Enterprise** | **Learning** | **Enterprise** |

---

## 🗄️ Database Schema Updates

### Current `lessons` Table
```sql
CREATE TABLE `lessons` (
  `id` char(36) PRIMARY KEY,
  `chapter_id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `video_url` varchar(500),          -- ✅ Already exists!
  `video_duration` int,               -- ✅ Already exists!
  `sort_order` int NOT NULL,
  `is_preview` tinyint(1) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` datetime,
  `updated_at` datetime
);
```

### NEW: Video Metadata Table (Optional but Recommended)
```sql
CREATE TABLE `video_metadata` (
  `id` char(36) PRIMARY KEY DEFAULT (uuid()),
  `lesson_id` char(36) NOT NULL UNIQUE,
  `video_url` varchar(500) NOT NULL,
  `thumbnail_url` varchar(500),
  `video_duration` int,              -- Seconds
  `video_format` varchar(50),        -- mp4, webm, hls
  `file_size` bigint,                -- Bytes
  `cloudinary_public_id` varchar(500), -- If using Cloudinary
  `transcoding_status` enum('pending', 'processing', 'completed', 'failed'),
  `quality_variants` json,           -- {"360p": "url", "720p": "url", "1080p": "url"}
  `created_at` datetime,
  `updated_at` datetime,
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  INDEX idx_lesson (lesson_id)
);
```

### Enhanced `lesson_progress` Table
```sql
CREATE TABLE `lesson_progress` (
  `id` char(36) PRIMARY KEY,
  `user_id` char(36) NOT NULL,
  `lesson_id` char(36) NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `progress_percentage` decimal(5,2) DEFAULT 0,
  `last_position` int,               -- Current video timestamp in seconds
  `video_watched_duration` int,      -- Total watched duration
  `completed_at` datetime,
  `updated_at` datetime,
  UNIQUE KEY unique_progress (user_id, lesson_id),
  KEY idx_user (user_id),
  KEY idx_lesson (lesson_id),
  KEY idx_completed (user_id, is_completed),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (lesson_id) REFERENCES lessons (id)
);
```

---

## 🔧 Implementation Approach

### **APPROACH 1: Using Cloudinary (Recommended)**

**Ưu điểm:**
- ✅ Tự động transcoding & CDN
- ✅ Adaptive bitrate streaming (HLS)
- ✅ Quality variants tự động (360p, 720p, 1080p)
- ✅ Analytics & tracking
- ✅ Bạn đã có Cloudinary setup rồi!

**Nhược điểm:**
- 💰 Cần plan cao hơn cho videos (10GB free)
- 🔗 Phụ thuộc vào service bên thứ 3

---

### **APPROACH 2: Local Server Storage (Development)**

**Ưu điểm:**
- 🆓 Hoàn toàn miễn phí
- 🎯 Toàn quyền kiểm soát
- ⚡ Nhanh cho development

**Nhược điểm:**
- ❌ Server storage hạn chế
- ⚠️ Không có CDN
- 🔧 Phải tự xử lý transcoding
- 🚀 Khó scale sản phẩm

---

### **APPROACH 3: Hybrid (Recommended for Production)**

**Cách tiếp cận:**
1. **Development:** Local storage (`/public/videos/`)
2. **Production:** Cloudinary (bạn upload video trong admin panel)
3. **Database:** Luôn lưu trữ `video_url` & `video_duration`

---

## 📦 Cần Cài Đặt

```bash
# Video player library (lightweight & powerful)
pnpm add react-player

# Hoặc sử dụng HTML5 video + custom controls (recommended)
# Không cần cài gì thêm - dùng native HTML5 <video> element

# Cho streaming/upload:
pnpm add fluent-ffmpeg  # (Optional - for transcoding)
```

---

## 🚀 Triển Khai Step-by-Step

### **Bước 1: Database Migration** (1 phút)
```bash
# Chạy script để thêm các cột video vào lessons table
# Hoặc tạo video_metadata table mới
```

### **Bước 2: API Setup** (30 phút)
- ✅ `GET /api/lessons/[lessonId]/video` - Stream video
- ✅ `POST /api/lessons/[lessonId]/video/upload` - Upload video
- ✅ `POST /api/lessons/[lessonId]/video/complete` - Mark as watched

### **Bước 3: Video Player Component** (45 phút)
```tsx
// src/components/VideoPlayer.tsx
<VideoPlayer 
  videoUrl={lesson.videoUrl}
  duration={lesson.videoDuration}
  onProgress={(timestamp) => saveProgress(timestamp)}
  onComplete={() => markLessonComplete()}
/>
```

### **Bước 4: Integrate to Learn Page** (15 phút)
```tsx
// src/app/learn/[slug]/page.tsx
<VideoPlayer videoUrl={currentLesson.videoUrl} />
```

### **Bước 5: Admin Upload Panel** (30 phút)
```tsx
// src/app/admin/lessons/[lessonId]/edit/page.tsx
<VideoUploadForm onUploadComplete={(videoUrl, duration) => {
  updateLesson({ videoUrl, videoDuration: duration })
}}
```

---

## 💡 Giải Pháp Đề Xuất

**CHO DỰ ÁN CỦA BẠN:**

```
┌─────────────────────────────────────────────────────┐
│         HYBRID SOLUTION (Best Choice)                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Development/Learning:                              │
│  ├─ Local storage: /public/videos/ (dev)           │
│  └─ Native HTML5 <video> player                     │
│                                                      │
│  Production:                                         │
│  ├─ Video uploaded to Cloudinary via admin panel   │
│  ├─ URL stored in MySQL (lessons.video_url)        │
│  └─ Cloudinary CDN serves videos                   │
│                                                      │
│  Database:                                           │
│  ├─ lessons.video_url (string)                     │
│  ├─ lessons.video_duration (int)                   │
│  └─ lesson_progress.last_position (tracking)       │
│                                                      │
│  Frontend:                                           │
│  ├─ Native HTML5 video player (lightweight)        │
│  ├─ Custom controls (play, pause, seek, quality)  │
│  └─ Progress tracking & completion                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. **Decide:** Local storage (dev) hay Cloudinary?
2. **Create:** API endpoints for video streaming
3. **Build:** VideoPlayer component with controls
4. **Connect:** Integrate vào learn page
5. **Test:** Upload & play video

---

## 📝 Video Player Features

```
┌─────────────────────────────────────────────────────┐
│  Video Controls                                      │
├─────────────────────────────────────────────────────┤
│  ▶ Play/Pause         │  🔊 Volume Control         │
│  ⏭ Next Lesson        │  🎚 Seek Bar (Progress)    │
│  ⏮ Previous Lesson    │  ⚙️ Speed (0.5x - 2x)      │
│  ⊡ Fullscreen         │  📊 Quality (360/720/1080) │
│  CC Subtitles         │  💾 Download (Optional)    │
│  ⏱ Current / Duration │  📌 Bookmark (Optional)    │
└─────────────────────────────────────────────────────┘
```

---

## 🔐 Security Considerations

1. **Authentication Check:**
   ```typescript
   if (!isAuthenticated) return 401;
   if (!isEnrolled(userId, courseId)) return 403;
   ```

2. **Video URL Protection:**
   - Signed URLs (Cloudinary)
   - Range request validation
   - CORS headers

3. **Bandwidth Limiting:**
   - Rate limiting on video endpoints
   - Progressive download (not full cache)

---

## 📊 Monitoring & Analytics

Theo dõi được:
- Video views, watch time
- Average completion rate
- Dropout rate (khi dừng)
- Device types & browsers
- Bandwidth usage

---

## 🎬 Ready to Implement?

Tôi sẽ tạo:
1. **API Routes** cho video streaming
2. **VideoPlayer Component** (React)
3. **DB Migration Script**
4. **Upload Handler** cho admin
5. **Integration** vào learn page

Bạn muốn bắt đầu với cách nào? 🚀
