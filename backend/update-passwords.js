const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function updatePasswords() {
  console.log('🔐 Updating user passwords to Admin@123...\n');

  try {
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Generate hash for Admin@123
    const newPassword = 'Admin@123';
    const hash = await bcrypt.hash(newPassword, 10);
    
    console.log(`Generated hash for password: ${newPassword}\n`);

    // Update all users
    const [result] = await connection.query(
      'UPDATE users SET password = ?',
      [hash]
    );

    console.log(`✅ Updated ${result.affectedRows} user passwords\n`);

    // Show updated users
    const [users] = await connection.query(
      'SELECT id, firstName, lastName, email FROM users'
    );

    console.log('📋 Updated users:');
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
    });

    await connection.end();

    console.log('\n✅ Password update completed successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   Email: superadmin@gmail.com (or any user email)');
    console.log('   Password: Admin@123\n');

  } catch (error) {
    console.error('\n❌ Password update failed:', error.message);
    console.error('\n📝 Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. Database exists (run: node setup-db.js)');
    console.error('   3. Credentials in .env are correct\n');
  }
}

updatePasswords();
