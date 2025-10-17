#!/usr/bin/env node

/**
 * Script để kiểm tra role hiện tại của tất cả user
 * Usage:
 *   npm run check-roles
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    console.log('📋 Danh sách user và role hiện tại:\n');
    
    const [users] = await connection.query(
      'SELECT id, username, email, role FROM users ORDER BY created_at DESC'
    );

    if (users.length === 0) {
      console.log('❌ Không có user nào trong database');
      return;
    }

    // Format table
    console.log('┌─────────────────┬──────────────────────────┬──────────┐');
    console.log('│ Username        │ Email                    │ Role     │');
    console.log('├─────────────────┼──────────────────────────┼──────────┤');
    
    users.forEach((user) => {
      const username = (user.username || 'N/A').padEnd(15);
      const email = (user.email || 'N/A').padEnd(24);
      const role = (user.role || 'USER').padEnd(8);
      console.log(`│ ${username} │ ${email} │ ${role} │`);
    });
    
    console.log('└─────────────────┴──────────────────────────┴──────────┘');

    // Summary
    console.log('\n📊 Thống kê:');
    const [stats] = await connection.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    
    stats.forEach((stat) => {
      const roleEmoji = {
        'ADMIN': '👑',
        'TEACHER': '👨‍🏫',
        'USER': '👤'
      };
      console.log(`   ${roleEmoji[stat.role] || '?'} ${stat.role}: ${stat.count} user`);
    });

    console.log('\n💡 Để cấp quyền: npm run grant-role -- <admin|teacher> <username>');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

checkRoles();
