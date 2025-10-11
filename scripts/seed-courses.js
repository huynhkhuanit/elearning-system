const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function seedCourses() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'learning_platform_db',
      multipleStatements: true,
    });

    console.log('✅ Connected to database');

    // Read SQL file
    const sqlFile = path.join(__dirname, '..', 'database', 'seed_courses.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📝 Executing SQL script...');

    // Execute SQL
    const [results] = await connection.query(sql);

    console.log('✅ Courses seeded successfully!');
    
    // Show summary
    const [courses] = await connection.query(`
      SELECT 
        title AS 'Course',
        CASE 
          WHEN is_free = 1 THEN 'FREE'
          ELSE CONCAT(FORMAT(price, 0), 'đ')
        END AS 'Price',
        level AS 'Level',
        total_students AS 'Students',
        rating AS 'Rating',
        is_published AS 'Published'
      FROM courses
      ORDER BY 
        CASE WHEN is_free = 0 THEN 0 ELSE 1 END,
        created_at
    `);

    console.log('\n📚 Course Summary:');
    console.table(courses);

  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

seedCourses();
