const mysql = require('mysql2/promise');

async function checkVideos() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa123456',
    database: 'learning_platform_db'
  });

  const [lessons] = await conn.query('SELECT id, title, video_url FROM lessons WHERE is_published = 1 ORDER BY id');
  
  console.log('Lessons without videos:');
  lessons.filter(l => !l.video_url).forEach(l => {
    console.log(`  - ${l.id}: ${l.title}`);
  });
  
  console.log(`\nTotal without videos: ${lessons.filter(l => !l.video_url).length}/${lessons.length}`);
  
  await conn.end();
}

checkVideos().catch(console.error);
