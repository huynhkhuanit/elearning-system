#!/usr/bin/env node

/**
 * Seed FREE course lessons with YouTube/Vimeo URLs
 * 
 * This script updates lessons in FREE courses with real embedded video URLs
 * allowing users to test the full UI/flow without needing to record videos.
 * 
 * Videos are from free YouTube channels focused on education/tech.
 * You can modify the URLs to point to your own YouTube/Vimeo videos.
 * 
 * Usage: node scripts/seed-free-course-videos.js
 */

const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

// Popular free educational YouTube videos by topic
const VIDEO_URLS = {
  'JavaScript': [
    'https://www.youtube.com/watch?v=PkZNo7MFNFg', // JS Basics
    'https://www.youtube.com/watch?v=DHvZLI7Aq8E', // JS ES6
    'https://www.youtube.com/watch?v=cOnqkZ7QtXE', // Event Loop
  ],
  'React': [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // React Intro (placeholder)
    'https://www.youtube.com/watch?v=jLS0TkuWepM', // React Hooks
    'https://www.youtube.com/watch?v=Ke90Tje7VS0', // React Advanced
  ],
  'Node.js': [
    'https://www.youtube.com/watch?v=zb3Qy3ixF60', // Node.js Intro
    'https://www.youtube.com/watch?v=fBNz5xF-Kx4', // Node.js REST API
    'https://www.youtube.com/watch?v=DvJ8q1akin4', // Node.js With MySQL
  ],
  'TypeScript': [
    'https://www.youtube.com/watch?v=BwuLxPH8c3E', // TypeScript Basics
    'https://www.youtube.com/watch?v=ahCwqrQqFDw', // TypeScript Advanced
  ],
  'CSS': [
    'https://www.youtube.com/watch?v=OXGznpKZ_sA', // CSS Flexbox
    'https://www.youtube.com/watch?v=9zBsdzdE4sU', // CSS Grid
    'https://www.youtube.com/watch?v=YszONjKpgg4', // CSS Animation
  ],
  'Database': [
    'https://www.youtube.com/watch?v=HXV3zeQKqGY', // SQL Basics
    'https://www.youtube.com/watch?v=lMwzBhbFOPA', // MongoDB Tutorial
    'https://www.youtube.com/watch?v=r5C6yOHBpDY', // MySQL Advanced
  ],
  'Web Design': [
    'https://www.youtube.com/watch?v=I6IIeDmKuYE', // Web Design Principles
    'https://www.youtube.com/watch?v=Ib3aZ21SADA', // Responsive Design
    'https://www.youtube.com/watch?v=4TYv2PhG89A', // UX Design
  ],
  'default': [
    'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    'https://www.youtube.com/watch?v=DHvZLI7Aq8E',
    'https://www.youtube.com/watch?v=cOnqkZ7QtXE',
  ]
};

async function seedFreeCoursesVideos() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    console.log('📺 Starting FREE course video seeding...\n');

    // Get all FREE courses
    const [courses] = await connection.query(
      'SELECT id, title, slug FROM courses WHERE is_free = 1'
    );

    console.log(`✅ Found ${courses.length} FREE course(s)\n`);

    for (const course of courses) {
      console.log(`📚 Processing: "${course.title}" (${course.slug})`);

      // Get chapters for this course
      const [chapters] = await connection.query(
        'SELECT id, title FROM chapters WHERE course_id = ? ORDER BY sort_order',
        [course.id]
      );

      let lessonCount = 0;
      let videoIndex = 0;

      for (const chapter of chapters) {
        // Get lessons for this chapter without videos
        const [lessons] = await connection.query(
          `SELECT id, title FROM lessons 
           WHERE chapter_id = ? AND (video_url IS NULL OR video_url = '')
           ORDER BY sort_order`,
          [chapter.id]
        );

        for (const lesson of lessons) {
          // Select video based on course title or use default
          const videoPool = VIDEO_URLS[course.title] || VIDEO_URLS.default;
          const videoUrl = videoPool[videoIndex % videoPool.length];
          videoIndex++;

          // Update lesson with video URL
          await connection.query(
            'UPDATE lessons SET video_url = ?, video_duration = 600 WHERE id = ?',
            [videoUrl, lesson.id]
          );

          console.log(`  ✓ ${lesson.title} → ${videoUrl.split('watch?v=')[1] || 'video'}`);
          lessonCount++;
        }
      }

      console.log(`  📊 Updated ${lessonCount} lesson(s)\n`);
    }

    console.log('✅ FREE course video seeding completed!\n');
    console.log('📝 Summary:');
    console.log('  • All FREE course lessons now have YouTube video URLs');
    console.log('  • Videos are from free educational channels');
    console.log('  • Users can test full UI/flow without recording');
    console.log('  • To use different videos, update VIDEO_URLS object\n');

  } catch (error) {
    console.error('❌ Error seeding videos:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run if executed directly
if (require.main === module) {
  seedFreeCoursesVideos().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { seedFreeCoursesVideos };
