/**
 * Helper Script: Lấy Lesson IDs từ API
 * 
 * Cách sử dụng:
 * 1. Mở DevTools (F12) trên một trang learn course
 * 2. Copy toàn bộ code này vào Console
 * 3. Script sẽ in ra tất cả lesson IDs với format chuẩn JSON
 * 
 * Ví dụ output:
 * {
 *   "lesson-id-1": { "title": "Bài 1", "content": "" },
 *   "lesson-id-2": { "title": "Bài 2", "content": "" },
 * }
 */

(async function getLessonIds() {
  try {
    // Lấy URL từ current page
    const slug = window.location.pathname.split('/').pop();
    
    if (!slug) {
      console.error('❌ Không tìm thấy course slug từ URL');
      return;
    }
    
    console.log(`📚 Đang fetch chapters cho course: ${slug}`);
    
    // Fetch chapters data
    const response = await fetch(`/api/courses/${slug}/chapters`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API returned error');
    }
    
    // Xử lý dữ liệu và tạo template JSON
    const lessons = {};
    const chapters = data.data.chapters;
    
    chapters.forEach(chapter => {
      if (chapter.lessons && Array.isArray(chapter.lessons)) {
        chapter.lessons.forEach(lesson => {
          lessons[lesson.id] = {
            title: lesson.title || 'Untitled',
            content: '# ' + (lesson.title || 'Untitled') + '\n\n(Thêm nội dung markdown ở đây...)'
          };
        });
      }
    });
    
    // In ra format JSON sạch
    console.log('✅ Copy JSON dưới đây và paste vào public/data/lessonContent.json:');
    console.log('');
    console.log(JSON.stringify({ lessons }, null, 2));
    console.log('');
    console.log('📝 Tổng số bài học:', Object.keys(lessons).length);
    
    // Cũng log ra CSV format để dễ tracking
    console.log('');
    console.log('📋 Format CSV (để tracking):');
    console.log('Lesson ID | Title');
    console.log('-'.repeat(80));
    Object.entries(lessons).forEach(([id, lesson]) => {
      console.log(`${id} | ${lesson.title}`);
    });
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
})();
