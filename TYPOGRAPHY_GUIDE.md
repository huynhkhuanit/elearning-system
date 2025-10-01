# Typography Guide - DHV LearnX

## Semantic Heading Structure (Fixed Font-Sizes)

All headings now use **fixed font-sizes** (non-responsive) for consistency across all devices.

### Heading Hierarchy

| Tag | Size | Weight | Usage | Example |
|-----|------|--------|-------|---------|
| `h1` | 32px | 900 | Main page title | "Lộ trình học", "Trang chủ" |
| `h2` | 24px | 900 | Section titles | "Khóa học Pro", "Role Based Roadmaps" |
| `h3` | 20px | 700 | Subsection titles | Card group titles, Feature sections |
| `h4` | 18px | 600 | Component titles | Individual card titles, Widget headers |
| `h5` | 16px | 600 | Small titles | List headers, Small widgets |
| `h6` | 14px | 600 | Smallest titles | Tags, Labels with emphasis |

### Special Classes

#### Card Titles (Non-responsive)
- `.course-card-title` - 16px, font-weight: 600 (Course cards)
- `.roadmap-card-title` - 16px, font-weight: 600 (Role-based roadmap cards, single line with ellipsis)
- `.main-roadmap-card-title` - 18px, font-weight: 900 (Main roadmap cards: Frontend, Backend, etc.)

#### Card Descriptions
- `.main-roadmap-card-desc` - 14px (Main roadmap card descriptions)

#### Modal Components
- `.modal-title` - 18px, font-weight: 700 (Modal titles - uses `<div>` not heading tags)
- `.modal-button-text` - 14px (All modal buttons)

### Body Text

| Class | Size | Usage |
|-------|------|-------|
| `p`, `.body-text` | 14px (mobile) → 15px (tablet) → 16px (desktop) | Standard paragraphs |
| `.text-small` | 12px (mobile) → 13px (tablet) → 14px (desktop) | Small text, captions |
| `button`, `.button-text` | 14px (mobile) → 15px (tablet) | Standard buttons |

### Design Principles

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3, etc.)
2. **No Heading Tags in Modals**: Modals use `.modal-title` class on `<div>` elements
3. **Fixed Sizes for UI Components**: Cards, buttons, and modals use fixed font-sizes
4. **Responsive Body Text**: Only paragraph and body text scale responsively
5. **Consistent Weight**: 
   - h1, h2: font-weight 900 (Extra Bold)
   - h3: font-weight 700 (Bold)
   - h4, h5, h6: font-weight 600 (Semi-bold)

### Example Usage

```tsx
// Page structure
<h1>Lộ trình học</h1>  {/* 32px, weight 900 */}

<section>
  <h2>Khóa học Pro</h2>  {/* 24px, weight 900 */}
  
  <article>
    <h3 className="main-roadmap-card-title">  {/* 18px, weight 900 */}
      Lộ trình học Front-end
    </h3>
    <p className="main-roadmap-card-desc">  {/* 14px */}
      Lập trình viên Front-end là người xây dựng...
    </p>
  </article>
</section>

// Modal
<Modal title="Lộ trình đang phát triển">  {/* Uses .modal-title: 18px, weight 700 */}
  <div>
    <h4>Đang trong quá trình phát triển</h4>  {/* If needed: 18px, weight 600 */}
    <p>Content...</p>
  </div>
</Modal>
```

### Migration Notes

- ✅ All headings are now non-responsive (fixed sizes)
- ✅ H1 = 32px (previously scaled up to 48px)
- ✅ H2 = 24px (previously scaled up to 32px)  
- ✅ H3 = 20px (previously scaled up to 24px)
- ✅ Added H4, H5, H6 to complete semantic hierarchy
- ✅ Modal titles now use `<div>` with `.modal-title` class (18px)
- ✅ All modal buttons fixed at 14px
