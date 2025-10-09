-- ============================================
-- Seed User Metadata - Social Links
-- ============================================
-- Script này thêm sample social links cho user hiện có

-- Lấy user_id của user 'huynhkhuanit' (hoặc user khác)
SET @user_id = (SELECT id FROM users WHERE username = 'huynhkhuanit' LIMIT 1);

-- Kiểm tra xem user có tồn tại không
SELECT 
  CASE 
    WHEN @user_id IS NULL THEN 'ERROR: User not found. Please update username in this script.'
    ELSE CONCAT('Found user_id: ', @user_id)
  END AS status;

-- Thêm social links cho user (nếu user tồn tại)
INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
SELECT * FROM (
  SELECT UUID() as id, @user_id as user_id, 'social_website' as meta_key, 'https://huynhkhuan.dev' as meta_value
  UNION ALL
  SELECT UUID(), @user_id, 'social_linkedin', 'https://linkedin.com/in/huynhkhuanit'
  UNION ALL
  SELECT UUID(), @user_id, 'social_github', 'https://github.com/huynhkhuanit'
  UNION ALL
  SELECT UUID(), @user_id, 'social_twitter', 'https://twitter.com/huynhkhuanit'
  UNION ALL
  SELECT UUID(), @user_id, 'social_facebook', 'https://facebook.com/huynhkhuanit'
) AS tmp
WHERE @user_id IS NOT NULL
ON DUPLICATE KEY UPDATE 
  meta_value = VALUES(meta_value),
  updated_at = CURRENT_TIMESTAMP;

-- Kiểm tra kết quả
SELECT 
  u.username,
  um.meta_key,
  um.meta_value,
  um.created_at
FROM user_metadata um
JOIN users u ON um.user_id = u.id
WHERE u.username = 'huynhkhuanit'
ORDER BY um.meta_key;

-- ============================================
-- Thêm metadata cho nhiều users
-- ============================================
-- Nếu bạn muốn thêm cho nhiều users, uncomment và chỉnh sửa:

/*
-- User 1
SET @user1_id = (SELECT id FROM users WHERE username = 'user1' LIMIT 1);
INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
VALUES 
  (UUID(), @user1_id, 'social_website', 'https://user1.com'),
  (UUID(), @user1_id, 'social_github', 'https://github.com/user1')
ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value);

-- User 2
SET @user2_id = (SELECT id FROM users WHERE username = 'user2' LIMIT 1);
INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
VALUES 
  (UUID(), @user2_id, 'social_linkedin', 'https://linkedin.com/in/user2'),
  (UUID(), @user2_id, 'social_twitter', 'https://twitter.com/user2')
ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value);
*/

-- ============================================
-- Xóa metadata của một user (nếu cần)
-- ============================================
-- DELETE FROM user_metadata WHERE user_id = (SELECT id FROM users WHERE username = 'huynhkhuanit');

-- ============================================
-- Update một metadata cụ thể
-- ============================================
-- UPDATE user_metadata 
-- SET meta_value = 'https://newwebsite.com'
-- WHERE user_id = (SELECT id FROM users WHERE username = 'huynhkhuanit')
--   AND meta_key = 'social_website';
