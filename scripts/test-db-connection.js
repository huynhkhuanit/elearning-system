/**
 * Database Connection Test Script
 * Run this to test if database connection is working
 * 
 * Usage: node scripts/test-db-connection.js
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'learning_platform_db',
};

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  console.log('Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log(`  Database: ${dbConfig.database}\n`);

  try {
    // Test connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful!\n');

    // Test query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Users table check: ${rows[0].count} users found\n`);

    // Test tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [dbConfig.database]);

    console.log('📋 Available tables:');
    tables.forEach(table => {
      console.log(`  - ${table.TABLE_NAME}`);
    });

    await connection.end();
    console.log('\n✅ All tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nPlease check:');
    console.error('  1. MySQL server is running');
    console.error('  2. Credentials in .env.local are correct');
    console.error('  3. Database "learning_platform_db" exists');
    console.error('  4. SQL schema has been imported\n');
    process.exit(1);
  }
}

testConnection();
