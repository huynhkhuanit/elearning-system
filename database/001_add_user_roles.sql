-- Add role column to users table
-- This allows setting user roles: USER, TEACHER, ADMIN

ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER' AFTER membership_type;

-- Create index on role for faster queries
CREATE INDEX idx_role ON users(role);

-- Update query to verify changes
-- SELECT id, username, email, role FROM users;
