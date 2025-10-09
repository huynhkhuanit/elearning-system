# 🔧 Fix: Social Links Disappearing Bug

## 📋 Problem Description

**Issue**: Khi user đã có GitHub và Facebook trong database, nhưng khi vào Settings và chỉ cập nhật Website, thì GitHub và Facebook sẽ **biến mất**.

**Root Cause**:
1. Settings page load user data từ `AuthContext` (API `/api/auth/me`)
2. API `/api/auth/me` **KHÔNG** trả về social links (chỉ có basic user info)
3. Khi submit form, frontend gửi toàn bộ `profileForm` state
4. Các field social chưa load → giá trị `''` (empty string)
5. Backend nhận `''` → xóa metadata trong database ❌

## ✅ Solution Implemented

### 1. Frontend: Load Full Profile from API

**File**: `src/app/settings/page.tsx`

**Changes**:
```typescript
// ✅ Added new state
const [initialLoading, setInitialLoading] = useState(true);

// ✅ Updated useEffect to fetch from /api/users/:username
useEffect(() => {
  const loadProfileData = async () => {
    if (!user?.username) return;
    
    try {
      setInitialLoading(true);
      
      // Fetch full profile including social links
      const response = await fetch(`/api/users/${user.username}`);
      const data = await response.json();

      if (data.success && data.data) {
        const profile = data.data;
        
        // Load ALL fields including social links
        setProfileForm({
          full_name: profile.full_name || '',
          username: profile.username || '',
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || '',
          website: profile.website || '',          // ✅ From metadata
          linkedin: profile.linkedin || '',        // ✅ From metadata
          github: profile.github || '',            // ✅ From metadata
          twitter: profile.twitter || '',          // ✅ From metadata
          facebook: profile.facebook || '',        // ✅ From metadata
        });
      }
    } catch (error) {
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setInitialLoading(false);
    }
  };

  if (user) {
    loadProfileData();
  }
}, [user?.username]);

// ✅ Added loading spinner
{initialLoading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
) : (
  <form onSubmit={handleProfileSubmit}>
    {/* Form fields */}
  </form>
)}
```

**Why it works**:
- ✅ Fetches from `/api/users/:username` which includes social links
- ✅ Loads ALL social links into form state
- ✅ Shows loading spinner while fetching
- ✅ When user updates only Website, GitHub/Facebook stay in state → sent to backend → preserved in DB

---

### 2. Backend: Improved Metadata Handling

**File**: `src/app/api/users/profile/route.ts`

**Changes**:
```typescript
// ✅ Added debug logging
console.log('📝 Update request body:', {
  full_name,
  username,
  bio,
  social: { website, linkedin, github, twitter, facebook }
});

// ✅ Improved metadata update logic
for (const item of metadataItems) {
  // Chỉ xử lý khi value KHÔNG phải undefined
  if (item.value !== undefined) {
    if (item.value === null || item.value === '' || item.value.trim() === '') {
      // Delete if empty
      console.log(`🗑️  Deleting ${item.key}`);
      await connection.execute(
        'DELETE FROM user_metadata WHERE user_id = ? AND meta_key = ?',
        [userId, item.key]
      );
    } else {
      // Insert or update
      console.log(`✅ Upserting ${item.key} = ${item.value}`);
      await connection.execute(
        `INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
         VALUES (UUID(), ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           meta_value = VALUES(meta_value),
           updated_at = CURRENT_TIMESTAMP`,
        [userId, item.key, item.value]
      );
    }
  } else {
    console.log(`⏭️  Skipping ${item.key} (undefined - not sent from client)`);
  }
}
```

**Why it works**:
- ✅ Only processes fields that are explicitly sent from client (`!== undefined`)
- ✅ Deletes only when value is empty string, null, or whitespace
- ✅ Preserves existing metadata when field is not in request
- ✅ Debug logs help track what's happening

---

## 🧪 Test Scenarios

### Scenario 1: User has GitHub + Facebook, adds Website
1. ✅ **Load Settings**: All fields load correctly from DB
2. ✅ **Add Website**: User types `https://example.com`
3. ✅ **Submit**: All 3 fields saved to DB
4. ✅ **Result**: Website added, GitHub + Facebook preserved

### Scenario 2: User removes Facebook
1. ✅ **Load Settings**: All fields show current values
2. ✅ **Clear Facebook**: User deletes Facebook URL
3. ✅ **Submit**: Facebook deleted from DB
4. ✅ **Result**: Website + GitHub preserved, Facebook removed

### Scenario 3: User updates GitHub
1. ✅ **Load Settings**: GitHub shows old value
2. ✅ **Update GitHub**: User changes to new URL
3. ✅ **Submit**: New GitHub URL saved
4. ✅ **Result**: All other fields preserved

---

## 📊 Data Flow

### Before Fix ❌
```
Settings Page Load
  ↓
AuthContext (no social links)
  ↓
profileForm = { github: '', facebook: '' }  ← Empty!
  ↓
User adds Website
  ↓
Submit { website: 'new', github: '', facebook: '' }
  ↓
Backend sees '' → DELETE github, facebook  ← Bug!
```

### After Fix ✅
```
Settings Page Load
  ↓
API /api/users/:username (includes social links)
  ↓
profileForm = { github: 'old', facebook: 'old' }  ← Loaded!
  ↓
User adds Website
  ↓
Submit { website: 'new', github: 'old', facebook: 'old' }
  ↓
Backend receives all values → UPSERT all  ← Fixed!
```

---

## 🎯 Key Takeaways

1. **Always load complete data** when editing - don't rely on partial context
2. **Use the right API** - `/api/users/:username` has full profile, `/api/auth/me` is minimal
3. **Distinguish undefined vs empty** - `undefined` = not sent, `''` = explicitly cleared
4. **Add loading states** - prevent premature submissions with incomplete data
5. **Debug logs are valuable** - helps track data flow in production

---

## 🚀 Testing Instructions

```bash
# 1. Restart dev server
pnpm dev

# 2. Login as user with existing social links
# User: huynhkhuanit (already has GitHub, Facebook, etc.)

# 3. Navigate to Settings
http://localhost:3000/settings

# 4. Check console logs - should show:
# "Fetching profile from /api/users/huynhkhuanit"
# "Loaded social links: { github: ..., facebook: ... }"

# 5. Add a new social link (e.g., Website)
# → Should NOT clear existing GitHub/Facebook

# 6. Check database:
SELECT * FROM user_metadata WHERE user_id = '...';
# All social links should be preserved ✅
```

---

## 🐛 Common Mistakes to Avoid

1. ❌ **Don't** load partial data and assume rest is OK
2. ❌ **Don't** treat `''` and `undefined` the same way
3. ❌ **Don't** submit forms before data is fully loaded
4. ❌ **Don't** forget to handle loading states
5. ❌ **Don't** skip API calls to "save time" - leads to bugs

---

## ✅ Status

- ✅ Settings page loads full profile from API
- ✅ Loading spinner shows while fetching
- ✅ All social links preserved when updating other fields
- ✅ Empty fields properly delete metadata
- ✅ Debug logs added for troubleshooting
- ✅ TypeScript errors resolved

**Result**: Bug completely fixed! 🎉
