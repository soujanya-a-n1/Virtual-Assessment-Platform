const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
  console.log('🔍 Checking Database Connection...\n');

  try {
    // Test connection without database
    console.log('Step 1: Testing MySQL connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });
    console.log('✅ MySQL connection successful\n');

    // Check if database exists
    console.log('Step 2: Checking if database exists...');
    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME}'`
    );
    
    if (databases.length === 0) {
      console.log('❌ Database does not exist');
      console.log(`\n📝 To create the database, run:`);
      console.log(`   node setup-db.js\n`);
      await connection.end();
      return;
    }
    console.log('✅ Database exists\n');

    // Connect to database
    console.log('Step 3: Connecting to database...');
    await connection.changeUser({ database: process.env.DB_NAME });
    console.log('✅ Connected to database\n');

    // Check tables
    console.log('Step 4: Checking tables...');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database');
      console.log(`\n📝 To create tables, run:`);
      console.log(`   node setup-db.js\n`);
      await connection.end();
      return;
    }

    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    console.log('');

    // Check roles
    console.log('Step 5: Checking roles...');
    const [roles] = await connection.query('SELECT * FROM roles');
    
    if (roles.length === 0) {
      console.log('❌ No roles found');
      console.log(`\n📝 To insert initial data, run:`);
      console.log(`   node setup-db.js\n`);
      await connection.end();
      return;
    }

    console.log(`✅ Found ${roles.length} roles:`);
    roles.forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.id})`);
    });
    console.log('');

    // Check users
    console.log('Step 6: Checking users...');
    const [users] = await connection.query('SELECT id, firstName, lastName, email FROM users LIMIT 5');
    
    if (users.length === 0) {
      console.log('⚠️  No users found');
      console.log(`\n📝 To insert demo users, run:`);
      console.log(`   node setup-db.js\n`);
    } else {
      console.log(`✅ Found ${users.length} users (showing first 5):`);
      users.forEach(user => {
        console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
      });
      console.log('');
    }

    await connection.end();

    console.log('\n✅ Database check completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log(`   Tables: ${tables.length}`);
    console.log(`   Roles: ${roles.length}`);
    console.log(`   Users: ${users.length}`);
    console.log('\n🚀 You can now start the server with: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Database check failed:', error.message);
    console.error('\n📝 Troubleshooting steps:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check credentials in backend/.env file');
    console.error('   3. Verify MySQL user has proper permissions');
    console.error('   4. Try running: node setup-db.js\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   ⚠️  Cannot connect to MySQL. Is it running?');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   ⚠️  Access denied. Check username and password in .env');
    }
    console.error('');
  }
}

checkDatabase();
