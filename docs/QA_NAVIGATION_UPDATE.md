# 🔄 Cập Nhật Navigation & Layout - Hệ Thống Q&A

## ✅ Tính Năng Đã Triển Khai

### 1. 🔙 Navigation Giữa Các Modal

**Luồng Navigation:**
```
Q&A Button → LessonQAModal
              ↓ (Đặt câu hỏi)
              ↓
         AskQuestionModal
              ↓ (Quay lại)
              ↓
         LessonQAModal
              ↓ (Click câu hỏi)
              ↓
      QuestionDetailModal
              ↓ (Quay lại)
              ↓
         LessonQAModal
```

**Nút "Quay lại":**
- ❌ Không đóng hẳn modal
- ✅ Lùi về modal trước đó
- ✅ Giữ context và state

**Nút "X" (Close):**
- ✅ Đóng hoàn toàn tất cả modals
- ✅ Clear state

### 2. 🖱️ Click Outside to Close

**Backdrop Click:**
- ✅ Click vào vùng tối (backdrop) → Đóng modal
- ✅ Click vào nội dung modal → Không đóng
- ✅ Sử dụng `onClick={onClose}` trên backdrop
- ✅ Sử dụng `onClick={(e) => e.stopPropagation()}` trên modal content

### 3. 📐 Layout Sát Bên Trái

**LessonQAModal (Danh sách câu hỏi):**
- Width: `480px` trên desktop, `100%` trên mobile
- Position: `fixed left-0 top-0 bottom-0`
- Animation: `slide-in-from-left`

**AskQuestionModal (Đặt câu hỏi):**
- Width: `600px` trên desktop, `100%` trên mobile  
- Position: `fixed left-0 top-0 bottom-0`
- Animation: `slide-in-from-left`

**QuestionDetailModal (Chi tiết câu hỏi):**
- Width: `700px` trên desktop, `100%` trên mobile
- Position: `fixed left-0 top-0 bottom-0`
- Animation: `slide-in-from-left`

## 📝 Chi Tiết Thay Đổi

### File: `src/app/learn/[slug]/page.tsx`

**Thêm props cho LessonQAModal:**
```tsx
<LessonQAModal
  isOpen={isQAModalOpen}
  onClose={() => setIsQAModalOpen(false)}
  lessonId={currentLesson.id}
  lessonTitle={currentLesson.title}
  onAskQuestion={() => {
    setIsQAModalOpen(false);
    setIsAskQuestionModalOpen(true);
  }}
  onQuestionClick={(questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsQAModalOpen(false);
  }}
/>
```

**Thêm props cho AskQuestionModal:**
```tsx
<AskQuestionModal
  isOpen={isAskQuestionModalOpen}
  onClose={() => setIsAskQuestionModalOpen(false)}
  onBack={() => {
    setIsAskQuestionModalOpen(false);
    setIsQAModalOpen(true);
  }}
  lessonId={currentLesson.id}
  lessonTitle={currentLesson.title}
  onQuestionCreated={() => {
    setIsAskQuestionModalOpen(false);
    setIsQAModalOpen(true);
  }}
/>
```

**Thêm props cho QuestionDetailModal:**
```tsx
<QuestionDetailModal
  isOpen={!!selectedQuestionId}
  onClose={() => {
    setSelectedQuestionId(null);
    window.location.hash = "";
  }}
  onBack={() => {
    setSelectedQuestionId(null);
    window.location.hash = "";
    setIsQAModalOpen(true);
  }}
  questionId={selectedQuestionId}
  onUpdate={() => {
    if (isQAModalOpen) {
      setIsQAModalOpen(false);
      setTimeout(() => setIsQAModalOpen(true), 100);
    }
  }}
/>
```

### File: `src/components/LessonQAModal.tsx`

**Interface cập nhật:**
```tsx
interface LessonQAModalProps {
  isOpen: boolean
  onClose: () => void
  lessonId: string
  lessonTitle: string
  onAskQuestion: () => void
  onQuestionClick: (questionId: string) => void  // ✅ Thêm mới
}
```

**Layout sát trái:**
```tsx
{/* Backdrop với click to close */}
<div className="fixed inset-0 bg-black/60 z-40 transition-opacity backdrop-blur-sm" onClick={onClose} />

{/* Modal Panel - Left Side */}
<div className="fixed left-0 top-0 bottom-0 z-50 w-full md:w-[480px] bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden">
```

**Header đơn giản hóa:**
- Bỏ nút "Quay lại" vì đây là modal đầu tiên
- Chỉ giữ tiêu đề và nút đóng (X)

**Click câu hỏi:**
```tsx
<div
  onClick={() => onQuestionClick(question.id)}
  className="..."
>
```

### File: `src/components/AskQuestionModal.tsx`

**Interface cập nhật:**
```tsx
interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void  // ✅ Thêm mới
  lessonId: string
  lessonTitle: string
  onQuestionCreated: () => void
}
```

**Layout sát trái:**
```tsx
{/* Backdrop với click to close */}
<div className="fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm" onClick={onClose} />

{/* Modal - Left Side */}
<div 
  className="fixed left-0 top-0 bottom-0 z-50 w-full md:w-[600px] bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden"
  onClick={(e) => e.stopPropagation()}
>
```

**Nút quay lại:**
```tsx
<button
  onClick={onBack}  // ✅ Gọi onBack thay vì onClose
  className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
>
  <ArrowLeft className="w-4 h-4" />
  <span>Quay lại</span>
</button>
```

### File: `src/components/QuestionDetailModal.tsx`

**Interface cập nhật:**
```tsx
interface QuestionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void  // ✅ Thêm mới
  questionId: string
  onUpdate: () => void
}
```

**Layout sát trái:**
```tsx
{/* Backdrop với click to close */}
<div className="fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm" onClick={onClose} />

{/* Modal - Left Side */}
<div 
  className="fixed left-0 top-0 bottom-0 z-50 w-full md:w-[700px] bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 overflow-hidden"
  onClick={(e) => e.stopPropagation()}
>
```

**Nút quay lại:**
```tsx
<button
  onClick={onBack}  // ✅ Gọi onBack thay vì onClose
  className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium"
>
  <ArrowLeft className="w-4 h-4" />
  <span>Quay lại</span>
</button>
```

## 🎨 Visual Changes

### Trước:
- ❌ Modal ở giữa màn hình
- ❌ Nút "Quay lại" đóng modal
- ❌ Click ngoài không đóng modal

### Sau:
- ✅ Modal sát bên trái màn hình
- ✅ Nút "Quay lại" lùi về modal trước
- ✅ Click backdrop đóng modal
- ✅ Animation slide từ trái sang

## 📱 Responsive Behavior

**Mobile (< 768px):**
- Width: `100%` (full screen)
- Height: `100%` (full screen)
- No rounded corners

**Desktop (≥ 768px):**
- Width: Fixed (480px / 600px / 700px)
- Height: Full height (`top-0 bottom-0`)
- Slide animation từ trái

## 🔄 User Flow Example

1. **Người dùng click Q&A button** → `LessonQAModal` mở ra
2. **Click "Đặt câu hỏi mới"** → `AskQuestionModal` mở, `LessonQAModal` đóng
3. **Click "Quay lại"** → `AskQuestionModal` đóng, `LessonQAModal` mở lại
4. **Click vào một câu hỏi** → `QuestionDetailModal` mở, `LessonQAModal` đóng
5. **Click "Quay lại"** → `QuestionDetailModal` đóng, `LessonQAModal` mở lại
6. **Click backdrop** → Tất cả modals đóng

## ✨ Animation

Sử dụng Tailwind CSS animation:
- `animate-in` - Fade in animation
- `slide-in-from-left` - Slide từ trái sang
- `duration-300` - 300ms transition

## 🎯 Benefits

1. **Better UX:**
   - Navigation tự nhiên giữa các màn hình
   - Không mất context khi chuyển modal
   - Clear visual feedback

2. **Space Optimization:**
   - Modal sát trái không che khuất video/content
   - Có thể xem video và Q&A đồng thời

3. **Intuitive Controls:**
   - "Quay lại" = Back to previous screen
   - "X" = Close everything
   - Click outside = Close

4. **Consistent Experience:**
   - Tất cả modals đều slide từ trái
   - Width tăng dần: 480 → 600 → 700
   - Cùng dark theme

## 🧪 Testing Checklist

- [ ] Click Q&A button mở modal
- [ ] Click "Đặt câu hỏi mới" chuyển modal
- [ ] Click "Quay lại" từ Ask Question → về List
- [ ] Click câu hỏi mở detail
- [ ] Click "Quay lại" từ Detail → về List
- [ ] Click backdrop đóng modal
- [ ] Click nội dung modal không đóng
- [ ] Click nút X đóng hoàn toàn
- [ ] Test responsive trên mobile
- [ ] Test animation smooth

## 🚀 Summary

✅ **Navigation:** Nút "Quay lại" giờ lùi về modal trước chứ không đóng hẳn
✅ **Close behavior:** Click backdrop hoặc nút X để đóng
✅ **Layout:** Tất cả modals hiển thị sát bên trái màn hình
✅ **Animation:** Slide-in từ trái với duration 300ms
✅ **Responsive:** Full screen mobile, fixed width desktop
✅ **UX:** Luồng navigation tự nhiên và trực quan

Hệ thống Q&A giờ có trải nghiệm người dùng tốt hơn với navigation logic và layout tối ưu! 🎉
