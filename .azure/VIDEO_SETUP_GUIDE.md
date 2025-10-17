# Video Streaming - Environment & Configuration Guide

## 🔧 Environment Variables

Thêm các biến này vào `.env.local`:

```bash
# ============================================
# VIDEO STORAGE CONFIGURATION
# ============================================

# Choose storage method: "local" | "cloudinary" | "s3"
VIDEO_STORAGE=local

# For Local Storage (Development)
# Videos will be stored in: /public/videos/
LOCAL_VIDEO_MAX_SIZE=2147483648  # 2GB in bytes

# For Cloudinary (Recommended for Production)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# For AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1

# ============================================
# DATABASE CONFIGURATION
# ============================================

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Aa123456
DB_NAME=learning_platform_db
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── lessons/
│   │       └── [lessonId]/
│   │           ├── video/
│   │           │   ├── route.ts          ✅ NEW - Streaming & Progress
│   │           │   └── upload/
│   │           │       └── route.ts      ✅ NEW - Upload handler
│   │           └── complete/
│   │               └── route.ts
│   ├── learn/
│   │   └── [slug]/
│   │       ├── page.tsx                  ✅ UPDATED - With VideoPlayer
│   │       └── layout.tsx
│   └── admin/
│       └── lessons/
│           └── [lessonId]/
│               └── edit/
│                   └── page.tsx          ⚠️ TODO - Add VideoUpload
├── components/
│   ├── VideoPlayer.tsx                   ✅ NEW - Main video player
│   └── VideoUpload.tsx                   ✅ NEW - Admin upload form
└── lib/
    ├── cloudinary.ts                     ✅ Existing - Already configured
    └── db.ts                             ✅ Existing
```

---

## 🎬 Implementation Checklist

### Phase 1: ✅ Core Components (Complete)
- [x] VideoPlayer Component
- [x] VideoUpload Component  
- [x] API Route: GET /api/lessons/[lessonId]/video (Streaming)
- [x] API Route: POST /api/lessons/[lessonId]/video/upload
- [x] Learn page integration

### Phase 2: ⚠️ Admin Panel Integration (Partial)
- [ ] Update `/src/app/admin/lessons/[lessonId]/edit/page.tsx`
- [ ] Add VideoUpload component to edit page
- [ ] Display current video info
- [ ] Delete video functionality

### Phase 3: ⚠️ Database Migration (Optional)
- [ ] Create `video_metadata` table (optional)
- [ ] Add indexes for performance
- [ ] Seed sample data

### Phase 4: ⚠️ Storage Configuration (As Needed)
- [ ] Setup Cloudinary (for production)
- [ ] Configure AWS S3 (if using S3)
- [ ] Local directory permissions (/public/videos/)

---

## 🚀 Quick Start

### 1. Local Development (No External Services)

```bash
# .env.local
VIDEO_STORAGE=local
```

```bash
# Create videos directory (if not exists)
mkdir -p public/videos
chmod 755 public/videos
```

Videos will be stored at: `/public/videos/`

✅ Ready to use! Just upload and play.

---

### 2. Production with Cloudinary

```bash
# Get these from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=abc123
CLOUDINARY_API_KEY=xyz789
CLOUDINARY_API_SECRET=secret123
VIDEO_STORAGE=cloudinary
```

Cloudinary handles:
- ✅ Storage & Backup
- ✅ Automatic transcoding
- ✅ CDN delivery
- ✅ HLS streaming
- ✅ Quality variants

---

## 📡 API Documentation

### GET `/api/lessons/[lessonId]/video`
**Stream video with range request support**

```bash
# Basic streaming
curl http://localhost:3000/api/lessons/lesson-123/video

# With range request (for seeking)
curl -H "Range: bytes=0-1024" http://localhost:3000/api/lessons/lesson-123/video
```

**Response:**
- Status: 200 (full file) or 206 (partial content)
- Content-Type: `video/mp4` (varies by format)
- Content-Range: `bytes 0-1024/2048576` (if range request)

---

### POST `/api/lessons/[lessonId]/video/upload`
**Upload new video**

```bash
# Upload with FormData
curl -X POST \
  -F "video=@/path/to/video.mp4" \
  http://localhost:3000/api/lessons/lesson-123/video/upload
```

**Request Body (multipart/form-data):**
- `video` (File) - Required, max 2GB

**Response:**
```json
{
  "success": true,
  "videoUrl": "/videos/lesson-123-1697530123456.mp4",
  "videoDuration": 3600,
  "lessonId": "lesson-123"
}
```

---

### POST `/api/lessons/[lessonId]/video/progress`
**Save user's video progress**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"timestamp": 120, "duration": 3600}' \
  http://localhost:3000/api/lessons/lesson-123/video/progress
```

**Request Body:**
```json
{
  "timestamp": 120,  // Seconds watched
  "duration": 3600   // Total video duration
}
```

**Response:**
```json
{
  "success": true
}
```

---

## 🎮 VideoPlayer Props

```tsx
<VideoPlayer
  videoUrl="/videos/lesson.mp4"           // Source URL (required)
  lessonId="lesson-123"                   // For progress tracking
  duration={3600}                         // Optional: Total duration
  title="Lesson Title"                    // Optional: Display title
  onProgress={(data) => {                 // Optional: Progress callback
    console.log(data.currentTime, data.duration);
  }}
  onComplete={() => {}}                   // Optional: Completion callback
  autoSave={true}                         // Optional: Auto-save every 10s
/>
```

---

## 🎯 Features Implemented

### VideoPlayer Component
```
✅ Play/Pause
✅ Seek/Progress bar
✅ Volume control
✅ Mute/Unmute
✅ Playback speed (0.5x - 2x)
✅ Fullscreen mode
✅ Quality selection (dropdown)
✅ Download button
✅ Share button
✅ Time display (current/duration)
✅ Buffered progress
✅ Auto-save progress
✅ Keyboard shortcuts ready (extensible)
```

### Backend
```
✅ HTTP Range request support (for seeking)
✅ Multi-format support (mp4, webm, ogv)
✅ MIME type detection
✅ File validation
✅ Progress tracking
✅ User authentication (framework ready)
✅ Access control (framework ready)
✅ Cache headers
```

---

## 🔐 Security Considerations

### Already Implemented
- ✅ File size validation (max 2GB)
- ✅ File type validation (MIME check)
- ✅ File extension validation
- ✅ Directory traversal prevention
- ✅ HTTP Range header validation
- ✅ CORS-ready headers

### Still Need To Do
- ⚠️ User authentication check (extract from session/token)
- ⚠️ Enrollment verification (user enrolled in course)
- ⚠️ Rate limiting (prevent abuse)
- ⚠️ Signed URLs (for external storage)
- ⚠️ DRM/Watermarking (if needed)

---

## 📊 Database Changes

No breaking changes! The `lessons` table already has:
- `video_url` (varchar 500)
- `video_duration` (int)

Optional: Create `video_metadata` table for advanced features:
```sql
CREATE TABLE `video_metadata` (
  `id` char(36) PRIMARY KEY,
  `lesson_id` char(36) UNIQUE,
  `video_url` varchar(500),
  `thumbnail_url` varchar(500),
  `video_duration` int,
  `video_format` varchar(50),
  `file_size` bigint,
  `quality_variants` json,
  `created_at` datetime,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);
```

---

## 🧪 Testing the Implementation

### 1. Upload a Test Video
```bash
# Via curl
curl -X POST \
  -F "video=@/path/to/test.mp4" \
  http://localhost:3000/api/lessons/test-lesson-id/video/upload

# Response should return videoUrl
```

### 2. Play Video in Learn Page
```
1. Go to: http://localhost:3000/learn/[slug]
2. Click on a lesson
3. See VideoPlayer component
4. Click Play button
5. Controls should work
```

### 3. Check Progress Saved
```bash
# Open browser DevTools (F12)
# Go to Network tab
# Watch for POST requests to /api/lessons/*/video/progress
# Should see requests every 10 seconds (if autoSave enabled)
```

---

## 🆘 Troubleshooting

### Issue: CORS Error
```
❌ Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Add CORS headers in API route
```typescript
headers.set("Access-Control-Allow-Origin", "*");
```

### Issue: Video Not Playing
```
❌ Failed to load video
```
**Checklist:**
- [ ] Video file exists at `video_url`
- [ ] File path is correct (relative or absolute)
- [ ] File permissions allow reading
- [ ] MIME type is correct
- [ ] Browser supports video format

### Issue: Seek Not Working
```
❌ Can't seek in video player
```
**Solutions:**
- Check browser console for errors
- Ensure server supports Range requests
- Verify Content-Range headers in response

### Issue: Upload Too Slow
```
⚠️ Large files taking forever
```
**Solutions:**
- Use Cloudinary (built-in optimization)
- Implement chunked uploads
- Add progress feedback to UI
- Compress video before upload

---

## 📚 Resources

- [HTML5 Video API](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- [HTTP Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)
- [Cloudinary Video Upload](https://cloudinary.com/documentation/video_upload_api)
- [Next.js File Uploads](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## ✅ Next Steps

1. **Setup environment variables** (.env.local)
2. **Test local uploads** (upload a sample video)
3. **Integrate VideoUpload into admin panel** (edit lesson page)
4. **Setup Cloudinary** (for production)
5. **Add authentication checks** (security)
6. **Monitor & optimize** (CDN, caching)

🎉 **Video streaming is ready to use!**
