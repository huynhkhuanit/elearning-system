const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtwooouoathntzzgmxir.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d29vb3VvYXRobnR6emdteGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5NDEyOCwiZXhwIjoyMDc4MTcwMTI4fQ._KdCN5Dp6P42F4-pWMimjhiZUusxXjrijYfOwBx03tA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Unsplash image URLs cho từng course
// Format: https://images.unsplash.com/photo-{photo_id}?w=800&h=450&fit=crop
// Sử dụng Unsplash Source API để có URL ổn định và chất lượng cao
const courseThumbnails = {
  'c1111111-1111-1111-1111-111111111111': {
    title: 'Lập trình JavaScript Nâng Cao',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop&q=80',
    // JavaScript code on screen - Advanced programming
  },
  'c2222222-2222-2222-2222-222222222222': {
    title: 'Lập trình C++ Cơ Bản Đến Nâng Cao',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop&q=80',
    // Programming code on laptop screen
  },
  'c3333333-3333-3333-3333-333333333333': {
    title: 'HTML CSS Cơ Bản Đến Nâng Cao',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop&q=80',
    // Web development workspace
  },
  'c4444444-4444-4444-4444-444444444444': {
    title: 'Cấu Trúc Dữ Liệu Và Giải Thuật',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop&q=80',
    // Algorithm and data structures visualization
  },
  'c5555555-5555-5555-5555-555555555555': {
    title: 'Lập trình JavaScript Cơ Bản',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop&q=80',
    // JavaScript beginner friendly code
  },
};

async function updateCourseThumbnails() {
  console.log('🖼️  Updating course thumbnails from Unsplash...\n');

  for (const [courseId, data] of Object.entries(courseThumbnails)) {
    try {
      console.log(`📝 Updating: ${data.title}`);
      console.log(`   Course ID: ${courseId}`);
      console.log(`   Thumbnail URL: ${data.thumbnail}`);

      const { data: updated, error } = await supabase
        .from('courses')
        .update({ thumbnail_url: data.thumbnail })
        .eq('id', courseId)
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
      } else {
        console.log(`   ✅ Successfully updated!\n`);
      }
    } catch (error) {
      console.error(`   ❌ Exception: ${error.message}\n`);
    }
  }

  console.log('✅ All thumbnails updated!');
}

updateCourseThumbnails().catch(console.error);

