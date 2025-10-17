# 🎨 Admin Dashboard - Tài Liệu Thiết Kế & Triển Khai

## 📌 Tóm Tắt

Admin Dashboard của DHV LearnX được thiết kế theo tiêu chuẩn hiện đại của các nền tảng quản lý nổi tiếng như:
- **GitHub**: Giao diện clean, sidebar navigation
- **VS Code**: Tema tối, efficient layout
- **Vercel**: Stats dashboard, gradient cards
- **Notion**: Flexible hierarchy, expandable sections

## 🎯 Mục Đích Thiết Kế

### Mục Tiêu UX/UI:
1. **Tách biệt**: Admin dashboard hoàn toàn độc lập từ main site
2. **Hiệu suất**: Giao diện tối được thiết kế để giảm strain mắt
3. **Hiệu quả**: Điều hướng nhanh, tìm kiếm mạnh mẽ
4. **Mở rộng**: Dễ dàng thêm tính năng mới

## 🎨 Hệ Thống Màu Sắc

### Bảng Màu Chính
```
Background:    #0F172A (slate-950) - Nền tối
Card BG:       #1E293B (slate-800) - Nền card
Border:        #334155 (slate-700) - Border
Text Primary:  #F1F5F9 (slate-100) - Text chính
Text Secondary:#94A3B8 (slate-400) - Text phụ
```

### Màu Nhấn
```
Primary:   #6366F1 (Indigo)    - Main actions
Blue:      #3B82F6 (Blue)      - Courses
Purple:    #A855F7 (Purple)    - Chapters
Pink:      #EC4899 (Pink)      - Lessons
Green:     #10B981 (Green)     - Active/Success
Emerald:   #059669 (Emerald)   - Published
Red:       #EF4444 (Red)       - Danger
Amber:     #F59E0B (Amber)     - Warning
```

## 📐 Bố Cục & Spacing

### Responsive Breakpoints
- **Mobile**: < 640px (Sidebar ẩn)
- **Tablet**: 640px - 1024px (Sidebar toggleable)
- **Desktop**: > 1024px (Sidebar luôn hiển thị)

### Sidebar Dimensions
- **Expanded**: 256px (w-64)
- **Collapsed**: 80px (w-20)
- **Transition**: 300ms (smooth)

### Padding/Margin Standards
- **Tight**: 0.5rem (2px, 4px)
- **Small**: 1rem (16px)
- **Medium**: 1.5rem (24px)
- **Large**: 2rem (32px)

## 🏗️ Kiến Trúc Component

### Hierarchy
```
AdminLayout (Root)
├── Sidebar
│   ├── Header
│   ├── Navigation
│   └── UserSection
├── TopBar
│   ├── PageTitle
│   └── Actions
└── Content Area
    ├── Pages
    │   ├── Dashboard
    │   ├── Lessons
    │   └── Settings
    └── Components
        ├── StatCard
        ├── SectionCard
        ├── Alert
        └── Button
```

### Component Reusability
Tất cả UI components được đặt trong `lib/admin-components.tsx`:
- `StatCard` - Hiển thị thống kê
- `SectionCard` - Wrapper cho sections
- `Alert` - Notifications
- `Button` - Custom buttons
- `Badge` - Status labels
- `LoadingSpinner` - Loading state
- `EmptyState` - Empty state

## 🔐 Authentication & Authorization

### Flow
1. User truy cập `/admin` → Kiểm tra auth
2. Nếu chưa đăng nhập → Redirect `/auth/login`
3. Nếu không phải admin/teacher → Hiển thị access denied
4. Nếu có quyền → Hiển thị dashboard

### Roles
- **Admin**: Toàn quyền
- **Teacher**: Toàn quyền quản lý content
- **Student**: Không được truy cập

## 📊 Data Flow

### Stats Calculation
```
API: /api/admin/courses-full
  ↓
Data Processing:
  - Iterate courses
  - Count chapters
  - Count lessons
  - Check content existence
  - Check published status
  ↓
Update State:
  - totalCourses
  - totalChapters
  - totalLessons
  - lessonsWithContent
  - publishedLessons
  - completionRate (%)
  ↓
Render Stats Cards
```

### Content Management Flow
```
List Courses
  ├── Expandable Course
  │   └── Expandable Chapters
  │       └── Lessons with Status
  │           ├── Green dot: Has content
  │           ├── Gray dot: No content
  │           ├── Badge: Published/Draft
  │           └── Edit Link
```

## 🎭 States & Interactions

### Visual Feedback
```
Button States:
- Normal: bg-indigo-600
- Hover: bg-indigo-700
- Active: ring-2 ring-indigo-400
- Disabled: bg-indigo-600/50

Link States:
- Normal: text-slate-300
- Hover: text-indigo-400
- Active: text-indigo-400 + border highlight

Card States:
- Normal: border-slate-700
- Hover: border-slate-600
```

### Animations
- **Fade**: 200ms ease-in-out
- **Slide**: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- **Spin**: Infinite, 1s linear

## 📱 Mobile Optimization

### Sidebar Behavior
```typescript
- Desktop (> 1024px): 
  - Sidebar always visible
  - Content margin-left: 256px

- Tablet (640-1024px):
  - Sidebar toggleable
  - Toggle button visible
  - Content adjust width

- Mobile (< 640px):
  - Sidebar hidden by default
  - Full-width content
  - Toggle opens overlay
```

### Touch Interactions
- Tap areas minimum 48px × 48px
- Swipe to open/close sidebar
- Double-tap für quick actions

## ♿ Accessibility

### Semantic HTML
```html
<nav>Navigation</nav>
<main>Content</main>
<aside>Sidebar</aside>
<header>Top bar</header>
```

### ARIA Labels
```jsx
<button aria-label="Toggle sidebar">...</button>
<div role="status" aria-live="polite">...</div>
```

### Keyboard Navigation
- `Tab` - Navigate elements
- `Enter` - Activate buttons
- `Escape` - Close modals/sidebars
- `Cmd/Ctrl + K` - Global search (future)

## 🚀 Performance Optimization

### Code Splitting
- Admin pages bundled separately
- Main site unaffected

### Lazy Loading
```typescript
const AdminDashboard = lazy(() => import('./page'))
```

### Caching Strategy
```
API Responses: 1 hour
Page Cache: 10 minutes
Asset Cache: Browser default
```

### Bundle Size Targets
- Admin Layout: < 50KB
- Each Page: < 30KB
- Total: < 150KB (gzipped)

## 📈 Scalability

### Adding New Pages
1. Create folder: `/admin/new-page/`
2. Create: `page.tsx`
3. Add to navigation in `layout.tsx`
4. Import components from `lib/admin-components.tsx`

### Adding New Sections
1. Use `SectionCard` wrapper
2. Follow color coding system
3. Import icons from `lucide-react`

### Adding New Stats
1. Calculate in useEffect
2. Add to stats state
3. Display in StatCard
4. Update progress bar if needed

## 🧪 Testing Considerations

### Unit Tests
- Component rendering
- Data calculations
- State updates
- Event handlers

### E2E Tests
- Authentication flow
- Navigation
- Content management
- Form submissions

### Performance Tests
- Load time < 2s
- FCP < 1s
- LCP < 2.5s

## 📚 Dependencies

### Main Libraries
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "lucide-react": "^latest",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^11.0.0"
}
```

### Admin-Specific
- No additional external libraries
- Pure React + Tailwind CSS
- Lucide icons for UI

## 🔮 Tính Năng Tương Lai

### Phase 2
- [ ] User management dashboard
- [ ] Student progress analytics
- [ ] Content analytics
- [ ] Bulk operations

### Phase 3
- [ ] Advanced filtering
- [ ] Export/Import tools
- [ ] Audit logs
- [ ] API management

### Phase 4
- [ ] AI-powered recommendations
- [ ] Real-time collaboration
- [ ] Advanced search
- [ ] Custom reports

## 📖 Tài Liệu Liên Quan

- `ADMIN_GUIDE.md` - User guide
- `README.md` - Project overview
- API Documentation - `/api/admin/*`

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintainer**: DHV LearnX Team
