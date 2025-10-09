-- ============================================
-- User Metadata Table
-- ============================================
-- Bảng này lưu trữ các metadata linh hoạt cho user
-- Không cần thêm columns mới khi có thêm thông tin

CREATE TABLE user_metadata (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    meta_key VARCHAR(100) NOT NULL,
    meta_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_meta (user_id, meta_key),
    INDEX idx_user_key (user_id, meta_key)
) ENGINE=InnoDB;

-- ============================================
-- Sample Data - Social Links
-- ============================================
-- Ví dụ các meta_key cho social links:
-- 'social_website', 'social_linkedin', 'social_github', 
-- 'social_twitter', 'social_facebook'

-- Ví dụ insert:
-- INSERT INTO user_metadata (user_id, meta_key, meta_value) 
-- VALUES 
--   ('user-uuid', 'social_website', 'https://example.com'),
--   ('user-uuid', 'social_linkedin', 'https://linkedin.com/in/username'),
--   ('user-uuid', 'social_github', 'https://github.com/username');

-- ============================================
-- Advantages of this approach:
-- ============================================
-- 1. Không cần ALTER TABLE khi thêm metadata mới
-- 2. Dễ dàng thêm/xóa/sửa metadata
-- 3. Query hiệu quả với index
-- 4. Tái sử dụng cho nhiều loại metadata khác
-- 5. Tiết kiệm storage (chỉ lưu data thực tế)
