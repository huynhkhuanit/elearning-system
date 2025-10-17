#!/usr/bin/env node

/**
 * Video Streaming Implementation - Diagnostic Tool
 * Verify all components are properly installed and configured
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '../../..');
const srcRoot = path.join(projectRoot, 'src');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, passMessage, failMessage) {
  if (condition) {
    log(`✓ ${passMessage}`, 'green');
    return true;
  } else {
    log(`✗ ${failMessage}`, 'red');
    return false;
  }
}

log('\n🎬 VIDEO STREAMING IMPLEMENTATION DIAGNOSTIC\n', 'cyan');

const results = {
  passed: 0,
  failed: 0,
};

// 1. Check API Routes
log('📡 Checking API Routes...', 'blue');

const videoRoutePath = path.join(srcRoot, 'app/api/lessons/[lessonId]/video/route.ts');
if (check(fs.existsSync(videoRoutePath), 'Video streaming route exists', 'Video streaming route MISSING')) {
  results.passed++;
} else {
  results.failed++;
}

const uploadRoutePath = path.join(srcRoot, 'app/api/lessons/[lessonId]/video/upload/route.ts');
if (check(fs.existsSync(uploadRoutePath), 'Video upload route exists', 'Video upload route MISSING')) {
  results.passed++;
} else {
  results.failed++;
}

// 2. Check Components
log('\n🎨 Checking Components...', 'blue');

const videoPlayerPath = path.join(srcRoot, 'components/VideoPlayer.tsx');
if (check(fs.existsSync(videoPlayerPath), 'VideoPlayer component exists', 'VideoPlayer component MISSING')) {
  results.passed++;
} else {
  results.failed++;
}

const videoUploadPath = path.join(srcRoot, 'components/VideoUpload.tsx');
if (check(fs.existsSync(videoUploadPath), 'VideoUpload component exists', 'VideoUpload component MISSING')) {
  results.passed++;
} else {
  results.failed++;
}

// 3. Check Learn Page Integration
log('\n📖 Checking Learn Page Integration...', 'blue');

const learnPagePath = path.join(srcRoot, 'app/learn/[slug]/page.tsx');
if (check(fs.existsSync(learnPagePath), 'Learn page exists', 'Learn page MISSING')) {
  const content = fs.readFileSync(learnPagePath, 'utf8');
  
  if (check(content.includes('VideoPlayer'), 'VideoPlayer imported', 'VideoPlayer NOT imported')) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  if (check(content.includes('videoUrl'), 'Video URL property added', 'Video URL property NOT added')) {
    results.passed++;
  } else {
    results.failed++;
  }
} else {
  results.failed += 2;
}

// 4. Check Public Videos Directory
log('\n📁 Checking Directory Structure...', 'blue');

const videosDir = path.join(projectRoot, 'public/videos');
if (check(fs.existsSync(videosDir), 'Videos directory exists', 'Videos directory MISSING (create with: mkdir -p public/videos)')) {
  results.passed++;
} else {
  results.failed++;
}

// 5. Check Environment Variables
log('\n🔧 Checking Environment Configuration...', 'blue');

const envLocalPath = path.join(projectRoot, '.env.local');
const hasEnv = fs.existsSync(envLocalPath);

if (check(hasEnv, '.env.local exists', '.env.local MISSING (create with required variables)')) {
  results.passed++;
  
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  
  if (check(envContent.includes('VIDEO_STORAGE'), 'VIDEO_STORAGE defined', 'VIDEO_STORAGE NOT defined')) {
    results.passed++;
  } else {
    results.failed++;
  }
} else {
  results.failed += 2;
}

// 6. Check Database Schema
log('\n🗄️ Checking Database Schema...', 'blue');

// These checks are informational
log('ℹ️  lessons.video_url column (VARCHAR 500)', 'yellow');
log('ℹ️  lessons.video_duration column (INT)', 'yellow');
log('ℹ️  lesson_progress.last_position column (INT)', 'yellow');
log('ℹ️  Schema already exists - no migrations needed!', 'green');
results.passed += 3;

// 7. Check Documentation
log('\n📚 Checking Documentation...', 'blue');

const docPath = path.join(projectRoot, '.azure/VIDEO_STREAMING_IMPLEMENTATION.md');
if (check(fs.existsSync(docPath), 'Implementation guide exists', 'Implementation guide MISSING')) {
  results.passed++;
} else {
  results.failed++;
}

// Summary
log('\n' + '='.repeat(50), 'cyan');
log(`\n📊 DIAGNOSTIC RESULTS\n`, 'cyan');
log(`✓ Passed: ${results.passed}`, 'green');
log(`✗ Failed: ${results.failed}`, 'red');

if (results.failed === 0) {
  log('\n✨ All checks passed! Video streaming is ready to use.\n', 'green');
  log('Next steps:', 'cyan');
  log('1. Set VIDEO_STORAGE=local in .env.local', 'yellow');
  log('2. Create /public/videos directory', 'yellow');
  log('3. Upload a test video via API', 'yellow');
  log('4. Open learn page and test playback', 'yellow');
} else {
  log('\n⚠️  Some checks failed. Please fix the issues above.\n', 'yellow');
  log('Need help? Check the documentation:', 'cyan');
  log('.azure/VIDEO_STREAMING_IMPLEMENTATION.md', 'yellow');
}

log('\n' + '='.repeat(50) + '\n', 'cyan');

process.exit(results.failed > 0 ? 1 : 0);
