const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtwooouoathntzzgmxir.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d29vb3VvYXRobnR6emdteGlyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjU5NDEyOCwiZXhwIjoyMDc4MTcwMTI4fQ._KdCN5Dp6P42F4-pWMimjhiZUusxXjrijYfOwBx03tA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable(tableName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TABLE: ${tableName}`);
  console.log('='.repeat(80));

  try {
    // Get sample data to infer structure
    const { data: sample, error: sampleError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error(`❌ Error: ${sampleError.message}`);
      return;
    }

    if (sample && sample.length > 0) {
      console.log('\n📋 Column Structure (inferred from data):');
      Object.keys(sample[0]).forEach(key => {
        const value = sample[0][key];
        let type = value === null ? 'null' : typeof value;
        if (Array.isArray(value)) type = 'array';
        if (value instanceof Date) type = 'date';
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) type = 'date-string';
        console.log(`  - ${key}: ${type}`);
      });
    } else {
      console.log('⚠️  Table exists but has no data');
      // Try to get structure by attempting to select
      const { error: testError } = await supabase
        .from(tableName)
        .select('*')
        .limit(0);
      
      if (testError) {
        console.log(`   Error details: ${testError.message}`);
      }
      return;
    }

    // Get row count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`\n📊 Row Count: ${count || 0}`);
    }

    // Get sample data (first 3 rows)
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

  } catch (error) {
    console.error(`❌ Error inspecting table ${tableName}:`, error.message);
  }
}

async function listAllTables() {
  console.log('\n' + '='.repeat(80));
  console.log('LISTING ALL TABLES');
  console.log('='.repeat(80));

  try {
    // Try common table names
    const commonTables = [
      'users', 'courses', 'chapters', 'lessons', 'enrollments',
      'lesson_progress', 'learning_activities', 'blog_posts',
      'blog_categories', 'blog_tags', 'blog_post_categories', 'blog_post_tags',
      'user_metadata', 'categories', 'course_categories'
    ];
    
    const existingTables = [];
    for (const table of commonTables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (!error) existingTables.push(table);
    }

    if (existingTables.length > 0) {
      console.log('\n📚 Available Tables:');
      existingTables.forEach((table, idx) => {
        console.log(`  ${idx + 1}. ${table}`);
      });
      return existingTables;
    } else {
      console.log('⚠️  No tables found or could not access');
    }
  } catch (error) {
    console.error('❌ Error listing tables:', error.message);
  }
}

async function main() {
  console.log('🔍 Supabase Database Inspector');
  console.log(`📍 URL: ${supabaseUrl}`);

  // List all tables first
  const tables = await listAllTables();

  // Inspect key tables (use tables from listAllTables or fallback to common ones)
  const keyTables = tables || [
    'users',
    'courses',
    'chapters',
    'lessons',
    'enrollments',
    'lesson_progress',
    'learning_activities',
    'blog_posts',
    'blog_categories',
    'blog_tags',
    'blog_post_categories',
    'blog_post_tags'
  ];

  console.log('\n\n🔍 Inspecting Key Tables...\n');

  for (const tableName of keyTables) {
    await inspectTable(tableName);
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Inspection Complete');
  console.log('='.repeat(80));
}

main().catch(console.error);

