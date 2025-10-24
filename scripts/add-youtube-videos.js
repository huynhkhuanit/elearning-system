const mysql = require('mysql2/promise');

/**
 * This script adds YouTube video URLs to lessons that don't have videos.
 * It assigns relevant programming tutorial videos from YouTube based on lesson topics.
 */

// Sample YouTube videos for different programming topics
const youtubeVideos = {
  // General programming
  'intro': 'https://www.youtube.com/watch?v=zOjov-2OZ0E', // Programming basics
  'variables': 'https://www.youtube.com/watch?v=JNMy969SjyU', // Variables
  'operators': 'https://www.youtube.com/watch?v=VqEECTjkPBc', // Operators
  'oop': 'https://www.youtube.com/watch?v=pTB0EiLXUC8', // OOP
  'async': 'https://www.youtube.com/watch?v=V_Kr9OSfDeU', // Async programming
  'design_patterns': 'https://www.youtube.com/watch?v=tv-_1er1mWI', // Design patterns
  
  // Web development
  'setup': 'https://www.youtube.com/watch?v=gqOEOvLI6wo', // Setup environment
  'api': 'https://www.youtube.com/watch?v=GK4Pl-GmPHk', // API development
  'database': 'https://www.youtube.com/watch?v=HXV3zeQKqGY', // Database design
  'auth': 'https://www.youtube.com/watch?v=mbsmsi7l3r4', // Authentication
  'testing': 'https://www.youtube.com/watch?v=r9HdHUE0COE', // Testing
  'deployment': 'https://www.youtube.com/watch?v=oykl1Ih9pMg', // Deployment
  
  // DevOps
  'docker': 'https://www.youtube.com/watch?v=fqMOX6JJhGo', // Docker
  'kubernetes': 'https://www.youtube.com/watch?v=X48VuDVv0do', // Kubernetes
  'cicd': 'https://www.youtube.com/watch?v=scEDHsr3APg', // CI/CD
  'cloud': 'https://www.youtube.com/watch?v=3hLmDS179YE', // Cloud platforms
  
  // Microservices
  'microservices': 'https://www.youtube.com/watch?v=j1gU2oGFayY', // Microservices intro
  'api_gateway': 'https://www.youtube.com/watch?v=1vjOv_f9L8I', // API Gateway
  'service_discovery': 'https://www.youtube.com/watch?v=GboiMJm6WlA', // Service Discovery
  'message_queue': 'https://www.youtube.com/watch?v=oUJbuFMyBDk', // Message Queue
  'caching': 'https://www.youtube.com/watch?v=U3RkDLtS7uY', // Caching
  'monitoring': 'https://www.youtube.com/watch?v=Lub4IJvPjyk', // Monitoring
  
  // Career & Skills
  'learning': 'https://www.youtube.com/watch?v=EC33hbdVG-Q', // How to learn
  'resume': 'https://www.youtube.com/watch?v=Tt08KmFfIYQ', // Resume
  'interview': 'https://www.youtube.com/watch?v=1qw5ITr3k9E', // Interview
  'networking': 'https://www.youtube.com/watch?v=EihTZzb3yXE', // Networking
  'freelancing': 'https://www.youtube.com/watch?v=SuGzzZywzB0', // Freelancing
  
  // Projects
  'project': 'https://www.youtube.com/watch?v=fgTGADljAeg', // Project planning
  'ecommerce': 'https://www.youtube.com/watch?v=lkIFF4maKMU', // E-commerce project
  'cart': 'https://www.youtube.com/watch?v=Y-jzdXllf1E', // Shopping cart
  'payment': 'https://www.youtube.com/watch?v=1r-F3FIONl8', // Payment integration
  'admin': 'https://www.youtube.com/watch?v=jCY6DH8F4oc', // Admin dashboard
  
  // Best practices
  'best_practices': 'https://www.youtube.com/watch?v=HZJxjlvBbVw', // Best practices
  'security': 'https://www.youtube.com/watch?v=LZJNkg_5_yI', // Security
  'performance': 'https://www.youtube.com/watch?v=B4PSP-xF3dQ', // Performance
  'error_handling': 'https://www.youtube.com/watch?v=ZVug42fYkqk', // Error handling
  'code_review': 'https://www.youtube.com/watch?v=XDOaLUq_hL0', // Code review
  
  // Default
  'default': 'https://www.youtube.com/watch?v=ok-plXXHlWw' // General programming tutorial
};

function getYouTubeUrlForLesson(title) {
  const lowerTitle = title.toLowerCase();
  
  // Match keywords to videos
  if (lowerTitle.includes('chào mừng') || lowerTitle.includes('giới thiệu')) return youtubeVideos.intro;
  if (lowerTitle.includes('biến') || lowerTitle.includes('kiểu dữ liệu')) return youtubeVideos.variables;
  if (lowerTitle.includes('toán tử') || lowerTitle.includes('biểu thức')) return youtubeVideos.operators;
  if (lowerTitle.includes('object-oriented') || lowerTitle.includes('oop')) return youtubeVideos.oop;
  if (lowerTitle.includes('asynchronous') || lowerTitle.includes('async')) return youtubeVideos.async;
  if (lowerTitle.includes('design pattern')) return youtubeVideos.design_patterns;
  
  if (lowerTitle.includes('cài đặt') || lowerTitle.includes('setup') || lowerTitle.includes('môi trường')) return youtubeVideos.setup;
  if (lowerTitle.includes('api') && lowerTitle.includes('backend')) return youtubeVideos.api;
  if (lowerTitle.includes('database') || lowerTitle.includes('thiết kế database')) return youtubeVideos.database;
  if (lowerTitle.includes('authentication') || lowerTitle.includes('auth')) return youtubeVideos.auth;
  if (lowerTitle.includes('testing') || lowerTitle.includes('test')) return youtubeVideos.testing;
  if (lowerTitle.includes('deploy') || lowerTitle.includes('deployment')) return youtubeVideos.deployment;
  
  if (lowerTitle.includes('docker')) return youtubeVideos.docker;
  if (lowerTitle.includes('kubernetes') || lowerTitle.includes('k8s')) return youtubeVideos.kubernetes;
  if (lowerTitle.includes('ci/cd') || lowerTitle.includes('pipeline')) return youtubeVideos.cicd;
  if (lowerTitle.includes('aws') || lowerTitle.includes('azure') || lowerTitle.includes('gcp') || lowerTitle.includes('cloud')) return youtubeVideos.cloud;
  
  if (lowerTitle.includes('microservice')) return youtubeVideos.microservices;
  if (lowerTitle.includes('api gateway') || lowerTitle.includes('gateway')) return youtubeVideos.api_gateway;
  if (lowerTitle.includes('service discovery') || lowerTitle.includes('discovery')) return youtubeVideos.service_discovery;
  if (lowerTitle.includes('message queue') || lowerTitle.includes('queue')) return youtubeVideos.message_queue;
  if (lowerTitle.includes('caching') || lowerTitle.includes('cache')) return youtubeVideos.caching;
  if (lowerTitle.includes('monitoring') || lowerTitle.includes('logging')) return youtubeVideos.monitoring;
  
  if (lowerTitle.includes('học') && lowerTitle.includes('hiệu quả')) return youtubeVideos.learning;
  if (lowerTitle.includes('resume') || lowerTitle.includes('portfolio')) return youtubeVideos.resume;
  if (lowerTitle.includes('interview') || lowerTitle.includes('coding interview')) return youtubeVideos.interview;
  if (lowerTitle.includes('networking') || lowerTitle.includes('personal branding')) return youtubeVideos.networking;
  if (lowerTitle.includes('freelancing') || lowerTitle.includes('side project')) return youtubeVideos.freelancing;
  
  if (lowerTitle.includes('planning') || lowerTitle.includes('documentation') || lowerTitle.includes('phân tích')) return youtubeVideos.project;
  if (lowerTitle.includes('e-commerce') || lowerTitle.includes('ecommerce')) return youtubeVideos.ecommerce;
  if (lowerTitle.includes('cart') || lowerTitle.includes('checkout')) return youtubeVideos.cart;
  if (lowerTitle.includes('payment')) return youtubeVideos.payment;
  if (lowerTitle.includes('admin') && lowerTitle.includes('dashboard')) return youtubeVideos.admin;
  
  if (lowerTitle.includes('best practice')) return youtubeVideos.best_practices;
  if (lowerTitle.includes('security')) return youtubeVideos.security;
  if (lowerTitle.includes('performance') || lowerTitle.includes('optimization') || lowerTitle.includes('tối ưu')) return youtubeVideos.performance;
  if (lowerTitle.includes('error') || lowerTitle.includes('handling')) return youtubeVideos.error_handling;
  if (lowerTitle.includes('code review') || lowerTitle.includes('refactoring')) return youtubeVideos.code_review;
  
  // Default fallback
  return youtubeVideos.default;
}

async function addYouTubeVideos() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa123456',
    database: 'learning_platform_db'
  });

  try {
    // Get all lessons without videos
    const [lessons] = await conn.query(
      'SELECT id, title, video_url FROM lessons WHERE is_published = 1 AND (video_url IS NULL OR video_url = "")'
    );

    console.log(`Found ${lessons.length} lessons without videos.\n`);

    if (lessons.length === 0) {
      console.log('All lessons already have videos!');
      return;
    }

    // Update each lesson with a YouTube video
    let updated = 0;
    for (const lesson of lessons) {
      const youtubeUrl = getYouTubeUrlForLesson(lesson.title);
      
      await conn.query(
        'UPDATE lessons SET video_url = ?, video_duration = 600 WHERE id = ?',
        [youtubeUrl, lesson.id]
      );
      
      console.log(`✓ Updated: ${lesson.title}`);
      console.log(`  URL: ${youtubeUrl}\n`);
      updated++;
    }

    console.log(`\n✅ Successfully added YouTube videos to ${updated} lessons!`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await conn.end();
  }
}

// Run the script
addYouTubeVideos().catch(console.error);
