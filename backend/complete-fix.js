const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function completeFix() {
  console.log('🔧 COMPLETE DATABASE FIX\n');
  console.log('This will:');
  console.log('1. Drop and recreate the database');
  console.log('2. Create tables with correct column names');
  console.log('3. Insert roles and demo users');
  console.log('4. Set password to Admin@123\n');

  try {
    // Connect without database first
    console.log('Step 1: Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      multipleStatements: true
    });
    console.log('✅ Connected\n');

    // Drop and create database
    console.log('Step 2: Recreating database...');
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log('✅ Database recreated\n');

    // Read and execute schema
    console.log('Step 3: Creating tables...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Ignore errors for USE database and comments
          if (!err.message.includes('USE') && !err.message.includes('comment')) {
            console.log('Warning:', err.message);
          }
        }
      }
    }
    console.log('✅ Tables created\n');

    // Generate password hash
    console.log('Step 4: Generating password hash...');
    const password = 'Admin@123';
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Password hash generated\n');

    // Insert demo users
    console.log('Step 5: Inserting demo users...');
    const users = [
      ['Super', 'Admin', 'superadmin@gmail.com', hash, '+1-800-ADMIN', true],
      ['John', 'Admin', 'admin@gmail.com', hash, '+1-800-0001', true],
      ['Jane', 'Examiner', 'examiner@gmail.com', hash, '+1-800-0002', true],
      ['Alice', 'Proctor', 'proctor@gmail.com', hash, '+1-800-0003', true],
      ['Bob', 'Student', 'student1@gmail.com', hash, '+1-800-0004', true],
      ['Carol', 'Student', 'student2@gmail.com', hash, '+1-800-0005', true],
      ['David', 'Student', 'student3@gmail.com', hash, '+1-800-0006', true]
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (firstName, lastName, email, password, phone, isActive) VALUES (?, ?, ?, ?, ?, ?)',
        user
      );
    }
    console.log('✅ Users inserted\n');

    // Assign roles
    console.log('Step 6: Assigning roles...');
    const roleAssignments = [
      [1, 1], // Super Admin
      [2, 2], // Admin
      [3, 3], // Examiner
      [4, 4], // Proctor
      [5, 5], // Student
      [6, 5], // Student
      [7, 5]  // Student
    ];

    for (const [userId, roleId] of roleAssignments) {
      await connection.query(
        'INSERT INTO user_roles (userId, roleId) VALUES (?, ?)',
        [userId, roleId]
      );
    }
    console.log('✅ Roles assigned\n');

    // Verify
    console.log('Step 7: Verifying setup...');
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [roleCount] = await connection.query('SELECT COUNT(*) as count FROM roles');
    
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Roles: ${roleCount[0].count}`);

    // Show users
    const [allUsers] = await connection.query('SELECT id, firstName, lastName, email FROM users');
    console.log('\n📋 Created users:');
    allUsers.forEach(user => {
      console.log(`   ${user.id}. ${user.firstName} ${user.lastName} (${user.email})`);
    });

    await connection.end();

    console.log('\n✅ COMPLETE FIX SUCCESSFUL!\n');
    console.log('═══════════════════════════════════════');
    console.log('🔑 LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('Email: superadmin@gmail.com');
    console.log('Password: Admin@123');
    console.log('═══════════════════════════════════════\n');
    console.log('🚀 Next steps:');
    console.log('1. Restart backend: npm run dev');
    console.log('2. Go to http://localhost:3000');
    console.log('3. Login with credentials above\n');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.error('\n📝 Troubleshooting:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   • MySQL is not running');
      console.error('   • Start MySQL service and try again');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   • Wrong username or password in .env');
      console.error('   • Check DB_USER and DB_PASSWORD');
    } else if (error.code === 'ENOENT') {
      console.error('   • schema.sql file not found');
      console.error('   • Make sure database/schema.sql exists');
    } else {
      console.error('   • Error:', error.message);
    }
    console.error('');
    process.exit(1);
  }
}

completeFix();
