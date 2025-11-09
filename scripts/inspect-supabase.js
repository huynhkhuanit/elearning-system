const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtwooouoathntzzgmxir.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d29vb3VvYXRobnR6emdteGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5NDEyOCwiZXhwIjoyMDc4MTcwMTI4fQ._KdCN5Dp6P42F4-pWMimjhiZUusxXjrijYfOwBx03tA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Danh sách đầy đủ 36 bảng trong database
const ALL_TABLES = [
  'blog_bookmarks',
  'blog_categories',
  'blog_comments',
  'blog_likes',
  'blog_post_categories',
  'blog_post_tags',
  'blog_posts',
  'blog_tags',
  'categories',
  'chapters',
  'comment_likes',
  'comments',
  'courses',
  'enrollments',
  'flashcard_sessions',
  'flashcards',
  'forum_categories',
  'forum_replies',
  'forum_topics',
  'learning_activities',
  'lesson_answer_likes',
  'lesson_answers',
  'lesson_progress',
  'lesson_question_likes',
  'lesson_questions',
  'lessons',
  'notes',
  'payments',
  'quiz_attempts',
  'quiz_questions',
  'quizzes',
  'roadmap_courses',
  'roadmaps',
  'user_metadata',
  'user_roadmaps',
  'users'
];

async function inspectTable(tableName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TABLE: ${tableName}`);
  console.log('='.repeat(80));

  try {
    // Note: Schema query via information_schema requires direct PostgreSQL access
    // For now, we'll infer structure from data or show that table exists but is empty

    // Get sample data to infer structure
    const { data: sample, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error(`❌ Error: ${sampleError.message}`);
      return;
    }

    // Get row count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    const rowCount = count || 0;
    console.log(`\n📊 Row Count: ${rowCount}`);

    // Display column structure
    if (sample && sample.length > 0) {
      console.log('\n📋 Column Structure (inferred from data):');
      const columnNames = Object.keys(sample[0]);
      columnNames.forEach(key => {
        const value = sample[0][key];
        let type = value === null ? 'null' : typeof value;
        if (Array.isArray(value)) type = 'array';
        if (value instanceof Date) type = 'date';
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) type = 'date-string';
        const nullable = value === null ? ' (nullable)' : '';
        console.log(`  - ${key}: ${type}${nullable}`);
      });
      console.log(`\n  Total columns: ${columnNames.length}`);
    } else {
      // Table exists but has no data - try to get column names from empty query metadata
      console.log('\n📋 Column Structure:');
      console.log('  ⚠️  Table exists but has no data - cannot infer column structure');
      console.log('  💡 To see column structure, you need to query the database schema directly');
      console.log('     or insert a test row and then delete it.');
    }

    // Get sample data (first 3 rows) if available
    if (rowCount > 0) {
      const { data: sampleData, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .limit(3);

      if (!fetchError && sampleData && sampleData.length > 0) {
        console.log(`\n📝 Sample Data (first ${Math.min(3, sampleData.length)} rows):`);
        sampleData.forEach((row, idx) => {
          console.log(`\n  Row ${idx + 1}:`);
          Object.entries(row).forEach(([key, value]) => {
            let displayValue;
            if (value === null) {
              displayValue = 'NULL';
            } else if (typeof value === 'object') {
              displayValue = JSON.stringify(value).substring(0, 100);
            } else {
              displayValue = String(value).substring(0, 100);
            }
            console.log(`    ${key}: ${displayValue}`);
          });
        });
      }
    } else {
      console.log('\n📝 Sample Data: No data available');
    }

  } catch (error) {
    console.error(`❌ Error inspecting table ${tableName}:`, error.message);
  }
}

async function listAllTables() {
  console.log('\n' + '='.repeat(80));
  console.log('LISTING ALL TABLES');
  console.log('='.repeat(80));

  try {
    const existingTables = [];
    
    // Check each table in the complete list
    console.log('\n🔍 Checking tables...');
    for (const table of ALL_TABLES) {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (!error) {
        existingTables.push(table);
      }
    }

    if (existingTables.length > 0) {
      console.log(`\n📚 Found ${existingTables.length} accessible tables:`);
      existingTables.forEach((table, idx) => {
        console.log(`  ${idx + 1}. ${table}`);
      });
      return existingTables;
    } else {
      console.log('⚠️  No tables found or could not access');
      return ALL_TABLES; // Return all tables anyway for inspection attempt
    }
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
    return ALL_TABLES; // Return all tables anyway
  }
}

async function main() {
  console.log('🔍 Supabase Database Inspector - Complete Database Analysis');
  console.log(`📍 URL: ${supabaseUrl}`);
  console.log(`📊 Inspecting ${ALL_TABLES.length} tables...\n`);

  // List all tables first
  const tables = await listAllTables();

  // Use all tables from the complete list
  const tablesToInspect = tables && tables.length > 0 ? tables : ALL_TABLES;

  console.log(`\n\n🔍 Inspecting ${tablesToInspect.length} Tables...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < tablesToInspect.length; i++) {
    const tableName = tablesToInspect[i];
    console.log(`\n[${i + 1}/${tablesToInspect.length}] Processing: ${tableName}`);
    try {
      await inspectTable(tableName);
      successCount++;
    } catch (error) {
      console.error(`\n❌ Failed to inspect ${tableName}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Inspection Complete');
  console.log(`📊 Summary: ${successCount} tables inspected successfully, ${errorCount} errors`);
  console.log('='.repeat(80));
}

main().catch(console.error);

