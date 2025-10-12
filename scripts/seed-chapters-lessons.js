const mysql = require('mysql2/promise');
const path = require('path');
const { randomUUID } = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

async function seedChaptersAndLessons() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    console.log('🌱 Starting to seed chapters and lessons...');

    // Get all courses
    const [courses] = await connection.query('SELECT id, slug, title FROM courses WHERE is_published = 1');
    
    if (courses.length === 0) {
      console.log('❌ No published courses found. Please seed courses first.');
      return;
    }

    for (const course of courses) {
      console.log(`\n📚 Seeding content for course: ${course.title}`);

      // Create chapters for each course
      const chapters = [
        {
          title: 'Giới thiệu khóa học',
          description: 'Tổng quan về khóa học và chuẩn bị môi trường học tập',
          sort_order: 1,
          lessons: [
            { title: 'Chào mừng bạn đến với khóa học', duration: 330, is_preview: 1 },
            { title: 'Cài đặt môi trường làm việc', duration: 765, is_preview: 1 },
            { title: 'Tài liệu và nguồn học tập', duration: 600, is_preview: 0 },
            { title: 'Cách học hiệu quả nhất', duration: 480, is_preview: 0 }
          ]
        },
        {
          title: 'Kiến thức nền tảng',
          description: 'Các khái niệm cơ bản và cú pháp cần thiết',
          sort_order: 2,
          lessons: [
            { title: 'Các khái niệm cơ bản', duration: 1100, is_preview: 0 },
            { title: 'Cú pháp và quy tắc', duration: 1510, is_preview: 0 },
            { title: 'Biến và kiểu dữ liệu', duration: 920, is_preview: 0 },
            { title: 'Toán tử và biểu thức', duration: 1050, is_preview: 0 },
            { title: 'Bài tập thực hành', duration: 1800, is_preview: 0 },
            { title: 'Best Practices cơ bản', duration: 930, is_preview: 0 }
          ]
        },
        {
          title: 'Lập trình nâng cao',
          description: 'Các kỹ thuật và patterns nâng cao',
          sort_order: 3,
          lessons: [
            { title: 'Functions và Methods', duration: 1320, is_preview: 0 },
            { title: 'Object-Oriented Programming', duration: 1680, is_preview: 0 },
            { title: 'Error Handling', duration: 990, is_preview: 0 },
            { title: 'Asynchronous Programming', duration: 1440, is_preview: 0 },
            { title: 'Design Patterns', duration: 1200, is_preview: 0 }
          ]
        },
        {
          title: 'Dự án thực tế 1',
          description: 'Xây dựng ứng dụng hoàn chỉnh từ đầu đến cuối',
          sort_order: 4,
          lessons: [
            { title: 'Phân tích yêu cầu dự án', duration: 1200, is_preview: 0 },
            { title: 'Thiết kế database', duration: 1380, is_preview: 0 },
            { title: 'Thiết kế giao diện', duration: 2145, is_preview: 0 },
            { title: 'Xây dựng tính năng Authentication', duration: 1890, is_preview: 0 },
            { title: 'Xây dựng tính năng chính', duration: 2730, is_preview: 0 },
            { title: 'Tối ưu và hoàn thiện', duration: 1695, is_preview: 0 },
            { title: 'Testing và Debugging', duration: 1560, is_preview: 0 },
            { title: 'Deploy lên production', duration: 1350, is_preview: 0 }
          ]
        },
        {
          title: 'Kiến thức nâng cao',
          description: 'Performance, Security và Best Practices',
          sort_order: 5,
          lessons: [
            { title: 'Performance Optimization', duration: 1940, is_preview: 0 },
            { title: 'Caching Strategies', duration: 1320, is_preview: 0 },
            { title: 'Security Best Practices', duration: 1720, is_preview: 0 },
            { title: 'Code Review và Refactoring', duration: 1500, is_preview: 0 },
            { title: 'Testing Strategies', duration: 2115, is_preview: 0 },
            { title: 'Quiz tổng hợp', duration: 2700, is_preview: 0 }
          ]
        },
        {
          title: 'Dự án thực tế 2',
          description: 'Dự án phức tạp với nhiều tính năng',
          sort_order: 6,
          lessons: [
            { title: 'Tổng quan dự án e-commerce', duration: 1080, is_preview: 0 },
            { title: 'Setup project và dependencies', duration: 960, is_preview: 0 },
            { title: 'Xây dựng API Backend', duration: 2880, is_preview: 0 },
            { title: 'Tích hợp Payment Gateway', duration: 2160, is_preview: 0 },
            { title: 'Shopping Cart và Checkout', duration: 2520, is_preview: 0 },
            { title: 'Admin Dashboard', duration: 2340, is_preview: 0 },
            { title: 'Email và Notifications', duration: 1680, is_preview: 0 },
            { title: 'Deploy và CI/CD', duration: 1800, is_preview: 0 }
          ]
        },
        {
          title: 'Microservices Architecture',
          description: 'Kiến trúc hệ thống quy mô lớn',
          sort_order: 7,
          lessons: [
            { title: 'Giới thiệu Microservices', duration: 1440, is_preview: 0 },
            { title: 'Service Communication', duration: 1800, is_preview: 0 },
            { title: 'API Gateway', duration: 1560, is_preview: 0 },
            { title: 'Service Discovery', duration: 1320, is_preview: 0 },
            { title: 'Message Queue', duration: 1680, is_preview: 0 },
            { title: 'Distributed Tracing', duration: 1200, is_preview: 0 }
          ]
        },
        {
          title: 'DevOps và Cloud',
          description: 'Deploy và quản lý ứng dụng trên cloud',
          sort_order: 8,
          lessons: [
            { title: 'Docker fundamentals', duration: 1920, is_preview: 0 },
            { title: 'Kubernetes basics', duration: 2160, is_preview: 0 },
            { title: 'AWS/Azure/GCP overview', duration: 1800, is_preview: 0 },
            { title: 'CI/CD Pipeline', duration: 2040, is_preview: 0 },
            { title: 'Monitoring và Logging', duration: 1560, is_preview: 0 },
            { title: 'Infrastructure as Code', duration: 1680, is_preview: 0 }
          ]
        },
        {
          title: 'Dự án tốt nghiệp',
          description: 'Xây dựng dự án cá nhân hoàn chỉnh',
          sort_order: 9,
          lessons: [
            { title: 'Chọn ý tưởng dự án', duration: 900, is_preview: 0 },
            { title: 'Planning và Documentation', duration: 1200, is_preview: 0 },
            { title: 'Implementation Phase 1', duration: 3600, is_preview: 0 },
            { title: 'Implementation Phase 2', duration: 3600, is_preview: 0 },
            { title: 'Testing và Bug Fixes', duration: 2400, is_preview: 0 },
            { title: 'Deployment và Presentation', duration: 1800, is_preview: 0 }
          ]
        },
        {
          title: 'Bonus: Career Development',
          description: 'Chuẩn bị cho sự nghiệp lập trình viên',
          sort_order: 10,
          lessons: [
            { title: 'Resume và Portfolio', duration: 1080, is_preview: 0 },
            { title: 'Interview Skills', duration: 1440, is_preview: 0 },
            { title: 'Coding Interview Prep', duration: 1800, is_preview: 0 },
            { title: 'Networking và Personal Branding', duration: 1200, is_preview: 0 },
            { title: 'Freelancing và Side Projects', duration: 1320, is_preview: 0 }
          ]
        }
      ];

      for (const chapterData of chapters) {
        // Generate UUID for chapter
        const chapterId = randomUUID();
        
        // Insert chapter with UUID
        await connection.query(
          `INSERT INTO chapters (id, course_id, title, description, sort_order, is_published)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [chapterId, course.id, chapterData.title, chapterData.description, chapterData.sort_order]
        );

        console.log(`  ✅ Created chapter: ${chapterData.title}`);

        // Insert lessons for this chapter
        for (let i = 0; i < chapterData.lessons.length; i++) {
          const lesson = chapterData.lessons[i];
          const lessonId = randomUUID();
          
          await connection.query(
            `INSERT INTO lessons (id, chapter_id, title, video_duration, sort_order, is_preview, is_published)
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [lessonId, chapterId, lesson.title, lesson.duration, i + 1, lesson.is_preview]
          );
        }
        console.log(`    📝 Created ${chapterData.lessons.length} lessons`);
      }

      // Update course total_lessons
      const [lessonCount] = await connection.query(
        `SELECT COUNT(*) as total
         FROM lessons l
         INNER JOIN chapters c ON l.chapter_id = c.id
         WHERE c.course_id = ?`,
        [course.id]
      );

      await connection.query(
        'UPDATE courses SET total_lessons = ? WHERE id = ?',
        [lessonCount[0].total, course.id]
      );

      console.log(`✨ Completed seeding for ${course.title}`);
    }

    console.log('\n🎉 All chapters and lessons seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seedChaptersAndLessons();

