#!/usr/bin/env node

/**
 * Script để cấp quyền admin/teacher cho user
 * Usage:
 *   npm run grant-role -- admin huynhkhuan
 *   npm run grant-role -- teacher minHun
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Usage: npm run grant-role -- <role> <username>');
  console.error('   role: admin, teacher, user');
  console.error('   username: tên đăng nhập của user');
  process.exit(1);
}

const [role, username] = args;

if (!['ADMIN', 'TEACHER', 'USER'].includes(role.toUpperCase())) {
  console.error('❌ Role phải là: admin, teacher, hoặc user');
  process.exit(1);
}

async function grantRole() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    // Check nếu user tồn tại
    const [users] = await connection.query(
      'SELECT id, username, email, role FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      console.error(`❌ Không tìm thấy user với username: ${username}`);
      process.exit(1);
    }

    const user = users[0];
    const oldRole = user.role || 'USER';

    // Update role
    await connection.query(
      'UPDATE users SET role = ? WHERE username = ?',
      [role.toUpperCase(), username]
    );

    console.log('✅ Cấp quyền thành công!');
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role cũ: ${oldRole}`);
    console.log(`   Role mới: ${role.toUpperCase()}`);
    console.log('\n💡 User này có thể đăng nhập và truy cập /admin/lessons');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

grantRole();
