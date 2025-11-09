const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtwooouoathntzzgmxir.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d29vb3VvYXRobnR6emdteGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5NDEyOCwiZXhwIjoyMDc4MTcwMTI4fQ._KdCN5Dp6P42F4-pWMimjhiZUusxXjrijYfOwBx03tA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkThumbnails() {
  console.log('\n📸 Checking Course Thumbnails:\n');
  console.log('='.repeat(80));

  const { data, error } = await supabase
    .from('courses')
    .select('id, title, thumbnail_url')
    .order('title');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  data.forEach((course, index) => {
    console.log(`\n${index + 1}. ${course.title}`);
    console.log(`   ID: ${course.id}`);
    if (course.thumbnail_url) {
      console.log(`   ✅ Thumbnail: ${course.thumbnail_url}`);
    } else {
      console.log(`   ⚠️  Thumbnail: NULL (chưa có)`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Total: ${data.length} courses`);
}

checkThumbnails().catch(console.error);

