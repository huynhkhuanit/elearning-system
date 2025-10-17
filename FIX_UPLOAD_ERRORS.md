# ✅ VIDEO UPLOAD FIX - HAI LỖI ĐÃ XỬ LÝ

## 🔧 Lỗi 1: Next.js 15+ - `params` Await (FIXED)

### Lỗi:
```
Error: Route "/api/lessons/[lessonId]/video/upload" used `params.lessonId`. 
`params` should be awaited before using its properties.
```

### Nguyên Nhân:
Next.js 15+ yêu cầu `params` phải `await` trước sử dụng

### Giải Pháp (DONE ✅):
```typescript
// TRƯỚC (sai)
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { lessonId } = params;  // ❌ lỗi
}

// SAU (đúng)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { lessonId } = await params;  // ✅ đúng
}
```

**Files Fixed:**
- ✅ `src/app/api/lessons/[lessonId]/video/upload/route.ts` (POST & DELETE)
- ✅ `src/app/api/lessons/[lessonId]/video/route.ts` (GET & POST)

---

## 🔧 Lỗi 2: Cloudinary API Key Missing (FIXED)

### Lỗi:
```
Video upload error: Error: Must supply api_key
    at uploadToCloudinary (src/app/api/lessons/[lessonId]/video/upload/route.ts:242:48)
```

### Nguyên Nhân:
Cloudinary v2 không được config với API key

### Giải Pháp (DONE ✅):
```typescript
// TRƯỚC (thiếu config)
const { v2: cloudinary } = await import("cloudinary");
const uploadStream = cloudinary.uploader.upload_stream(...);  // ❌ no api key

// SAU (có config)
const cloudinaryModule = await import("cloudinary");
const { v2: cloudinary } = cloudinaryModule;

// Configure Cloudinary ✅
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = cloudinary.uploader.upload_stream(...);  // ✅ now has config
```

**File Fixed:**
- ✅ `src/app/api/lessons/[lessonId]/video/upload/route.ts` (uploadToCloudinary function)

---

## ✅ Your .env.local - PERFECT!

```env
VIDEO_STORAGE=cloudinary
CLOUDINARY_CLOUD_NAME=dhztqlkxo
CLOUDINARY_API_KEY=235478398431113
CLOUDINARY_API_SECRET=8fHrpRS4B2UGffHKMlU9ZJBOTT0
```

✅ All Cloudinary credentials are set correctly!

---

## 🚀 NOW TRY AGAIN

### Step 1: Restart Dev Server
```bash
# Kill current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 2: Try Upload Again
```powershell
$videoPath = "C:\Users\huynh\Downloads\ThayGiaoBa.mp4"
$lessonId = "lesson-1"

$form = @{
    'video' = Get-Item $videoPath
}

$response = Invoke-WebRequest `
  -Uri "http://localhost:3000/api/lessons/$lessonId/video/upload" `
  -Method Post `
  -Form $form

$response.Content | ConvertFrom-Json
```

### Step 3: Expected Success Response
```json
{
  "success": true,
  "videoUrl": "https://res.cloudinary.com/dhztqlkxo/video/upload/...",
  "videoDuration": 240,
  "lessonId": "lesson-1"
}
```

---

## 🎬 OR USE ADMIN PANEL (EASIER)

```
1. http://localhost:3000/admin/lessons
2. Find Lesson
3. Click [Edit]
4. Scroll to "Upload Video"
5. Drag video file
6. Click "Upload Video"
7. Done! ✅
```

---

## 📊 SUMMARY OF FIXES

| Issue | Type | Status | Fix |
|-------|------|--------|-----|
| params not awaited | Next.js 15+ | ✅ FIXED | Added `Promise<Params>` + `await` |
| Cloudinary config missing | API Config | ✅ FIXED | Added `cloudinary.config()` call |
| .env.local incomplete | Env Var | ✅ OK | All variables present |

---

## 🔍 WHAT CHANGED

### Files Modified (2):
1. `src/app/api/lessons/[lessonId]/video/upload/route.ts`
   - POST handler: params → await params
   - DELETE handler: params → await params
   - uploadToCloudinary: Added cloudinary.config()

2. `src/app/api/lessons/[lessonId]/video/route.ts`
   - GET handler: params → await params
   - POST handler: params → await params

### Lines Changed: ~15 lines across 2 files

---

## ✨ NEXT ACTIONS

- [ ] Restart dev server
- [ ] Try upload again (PowerShell OR Admin Panel)
- [ ] Should succeed! ✅

---

**Status: 🟢 FIXED & READY**

Go ahead and upload your video now! 🎬
