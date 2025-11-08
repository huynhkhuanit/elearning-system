/**
 * Script to generate bcrypt password hash
 * Usage: node generate_password_hash.js
 */

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Aa123456';
  const saltRounds = 10;
  
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nCopy the hash above and use it in your SQL file.');
    console.log('\nYou can now update the password_hash in supabase_courses_sample_data.sql');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();

