/**
 * Script to test and seed user_metadata table
 * Usage: node scripts/test-user-metadata.js
 */

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Aa123456',
  database: process.env.DB_NAME || 'learning_platform_db',
};

async function testUserMetadata() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected successfully!\n');

    // 1. Check if user_metadata table exists
    console.log('📋 Checking user_metadata table...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'user_metadata'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Table user_metadata does not exist!');
      console.log('Please run: database/user_metadata.sql\n');
      return;
    }
    console.log('✅ Table user_metadata exists\n');

    // 2. Get sample user
    console.log('👤 Finding user "huynhkhuanit"...');
    const [users] = await connection.execute(
      'SELECT id, username, full_name FROM users WHERE username = ? LIMIT 1',
      ['huynhkhuanit']
    );

    if (users.length === 0) {
      console.log('❌ User not found! Please update username in script.\n');
      
      // Show available users
      console.log('📋 Available users:');
      const [allUsers] = await connection.execute(
        'SELECT username, full_name FROM users LIMIT 5'
      );
      console.table(allUsers);
      return;
    }

    const user = users[0];
    console.log('✅ Found user:', user.username, '-', user.full_name);
    console.log('   User ID:', user.id, '\n');

    // 3. Check existing metadata
    console.log('🔍 Checking existing metadata...');
    const [existingMetadata] = await connection.execute(
      'SELECT meta_key, meta_value FROM user_metadata WHERE user_id = ?',
      [user.id]
    );

    if (existingMetadata.length > 0) {
      console.log('📦 Existing metadata:');
      console.table(existingMetadata);
    } else {
      console.log('⚠️  No metadata found for this user');
    }
    console.log();

    // 4. Insert sample metadata
    console.log('➕ Inserting sample social links...');
    
    const socialLinks = [
      { key: 'social_website', value: 'https://huynhkhuan.dev' },
      { key: 'social_linkedin', value: 'https://linkedin.com/in/huynhkhuanit' },
      { key: 'social_github', value: 'https://github.com/huynhkhuanit' },
      { key: 'social_twitter', value: 'https://twitter.com/huynhkhuanit' },
      { key: 'social_facebook', value: 'https://facebook.com/huynhkhuanit' },
    ];

    for (const link of socialLinks) {
      await connection.execute(
        `INSERT INTO user_metadata (id, user_id, meta_key, meta_value)
         VALUES (UUID(), ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           meta_value = VALUES(meta_value),
           updated_at = CURRENT_TIMESTAMP`,
        [user.id, link.key, link.value]
      );
    }

    console.log('✅ Inserted/updated', socialLinks.length, 'social links\n');

    // 5. Verify insertion
    console.log('✅ Verifying data...');
    const [newMetadata] = await connection.execute(
      'SELECT meta_key, meta_value, created_at FROM user_metadata WHERE user_id = ? ORDER BY meta_key',
      [user.id]
    );

    console.log('📦 Current metadata:');
    console.table(newMetadata);
    console.log();

    // 6. Test the query used in API
    console.log('🧪 Testing API query...');
    const [apiResult] = await connection.execute(
      `SELECT 
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio
      FROM users u
      WHERE u.username = ?`,
      ['huynhkhuanit']
    );

    const [metadataResult] = await connection.execute(
      `SELECT meta_key, meta_value FROM user_metadata WHERE user_id = ?`,
      [user.id]
    );

    // Build metadata object
    const metadata = {};
    for (const row of metadataResult) {
      metadata[row.meta_key] = row.meta_value;
    }

    const profileData = {
      ...apiResult[0],
      website: metadata.social_website || null,
      linkedin: metadata.social_linkedin || null,
      github: metadata.social_github || null,
      twitter: metadata.social_twitter || null,
      facebook: metadata.social_facebook || null,
    };

    console.log('📊 API Response Preview:');
    console.log(JSON.stringify(profileData, null, 2));
    console.log();

    console.log('🎉 All tests passed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your Next.js server');
    console.log('   2. Visit: http://localhost:3000/huynhkhuanit');
    console.log('   3. Or test API: curl http://localhost:3000/api/users/profile');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the test
testUserMetadata();
