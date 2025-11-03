import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkUsersTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Aa123456',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    const [rows] = await connection.query('DESCRIBE users');
    console.log('Users table structure:');
    console.table(rows);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkUsersTable();
