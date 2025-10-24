#!/usr/bin/env node

/**
 * Fix Invalid Video URLs in Database
 * 
 * This script scans all lessons and identifies invalid video URLs
 * It provides recommendations for fixing them (mock videos, proper YouTube URLs, etc)
 * 
 * Usage: node scripts/fix-invalid-videos.js
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

/**
 * Validate video URL
 */
function validateVideoUrl(url) {
  if (!url) return { isValid: false, type: 'empty', reason: 'No URL' };

  // Mock placeholder - always valid
  if (url.startsWith('MOCK_PLACEHOLDER:')) {
    return { isValid: true, type: 'mock', reason: 'Valid mock placeholder' };
  }

  // YouTube URL
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    
    if (!videoId || videoId.length < 10) {
      return { isValid: false, type: 'youtube', reason: 'Invalid YouTube URL - no video ID' };
    }
    return { isValid: true, type: 'youtube', videoId, reason: 'Valid YouTube URL' };
  }

  // Vimeo URL
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop()?.split('?')[0];
    if (!videoId || isNaN(Number(videoId))) {
      return { isValid: false, type: 'vimeo', reason: 'Invalid Vimeo URL - no video ID' };
    }
    return { isValid: true, type: 'vimeo', videoId, reason: 'Valid Vimeo URL' };
  }

  // Data URL (SVG placeholder)
  if (url.startsWith('data:')) {
    return { isValid: true, type: 'data-url', reason: 'Valid data URL' };
  }

  // File URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
    const hasVideoExt = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (!hasVideoExt) {
      return { isValid: false, type: 'file', reason: 'URL does not end with video extension' };
    }
    return { isValid: true, type: 'file', reason: 'Valid file URL' };
  }

  // Unknown
  return { isValid: false, type: 'unknown', reason: 'Unrecognized URL format' };
}

async function fixInvalidVideos() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'learning_platform_db',
  });

  try {
    console.log('🔍 Scanning for invalid video URLs...\n');

    // Get all lessons with video URLs
    const [lessons] = await connection.query(
      `SELECT l.id, l.title, l.video_url, c.title as course_title
       FROM lessons l
       LEFT JOIN chapters ch ON l.chapter_id = ch.id
       LEFT JOIN courses c ON ch.course_id = c.id
       WHERE l.video_url IS NOT NULL AND l.video_url != ''
       ORDER BY c.id, ch.sort_order, l.sort_order`
    );

    console.log(`Found ${lessons.length} lessons with video URLs\n`);

    let validCount = 0;
    let invalidCount = 0;
    const invalidLessons = [];
    const invalidByReason = {};

    // Validate each video URL
    for (const lesson of lessons) {
      const validation = validateVideoUrl(lesson.video_url);
      
      if (validation.isValid) {
        validCount++;
        console.log(`✅ ${lesson.course_title} > ${lesson.title}`);
      } else {
        invalidCount++;
        invalidLessons.push(lesson);
        invalidByReason[validation.reason] = (invalidByReason[validation.reason] || 0) + 1;
        console.log(`❌ ${lesson.course_title} > ${lesson.title}`);
        console.log(`   Reason: ${validation.reason}`);
        console.log(`   URL: ${lesson.video_url}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Valid: ${validCount}`);
    console.log(`  Invalid: ${invalidCount}\n`);

    if (invalidCount > 0) {
      console.log(`📋 Issues Found:`);
      for (const [reason, count] of Object.entries(invalidByReason)) {
        console.log(`  • ${reason}: ${count}`);
      }

      console.log(`\n🔧 Recommendations:\n`);

      for (const lesson of invalidLessons) {
        console.log(`1. Lesson: "${lesson.title}"`);
        console.log(`   Current URL: ${lesson.video_url}`);
        console.log(`   Option A: Replace with valid YouTube URL`);
        console.log(`   Option B: Replace with mock placeholder:`);
        console.log(`   UPDATE lessons SET video_url = 'MOCK_PLACEHOLDER:${lesson.title}' WHERE id = '${lesson.id}';`);
        console.log();
      }

      // Provide SQL to convert invalid URLs to mock videos
      console.log(`\n⚡ To convert all invalid videos to mock placeholders, run:\n`);
      console.log(`USE ${process.env.DB_NAME || 'learning_platform_db'};\n`);
      
      for (const lesson of invalidLessons) {
        console.log(`UPDATE lessons SET video_url = 'MOCK_PLACEHOLDER:${lesson.title}' WHERE id = '${lesson.id}';`);
      }
    } else {
      console.log(`✅ All video URLs are valid!`);
    }

    console.log(`\n✨ Scan complete!`);

  } catch (error) {
    console.error('❌ Error scanning videos:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run if executed directly
if (require.main === module) {
  fixInvalidVideos().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { validateVideoUrl, fixInvalidVideos };
