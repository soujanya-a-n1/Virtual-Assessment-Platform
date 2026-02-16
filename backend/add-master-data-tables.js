const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function addMasterDataTables() {
  console.log('🔧 Adding Master Data Tables...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    });

    console.log('✅ Connected to database\n');

    // Read master data schema
    console.log('Step 1: Reading master data schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'master_data_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    console.log('✅ Schema loaded\n');

    // Execute schema
    console.log('Step 2: Creating master data tables...');
    const statements = schema.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Ignore duplicate column errors
          if (!err.message.includes('Duplicate column') && 
              !err.message.includes('USE') &&
              !err.message.includes('already exists')) {
            console.log('Warning:', err.message);
          }
        }
      }
    }
    console.log('✅ Tables created\n');

    // Insert sample departments
    console.log('Step 3: Inserting sample departments...');
    const departments = [
      ['Computer Science', 'CS', 'Department of Computer Science and Engineering', true],
      ['Information Technology', 'IT', 'Department of Information Technology', true],
      ['Electronics', 'ECE', 'Department of Electronics and Communication', true],
      ['Mechanical', 'ME', 'Department of Mechanical Engineering', true],
      ['Civil', 'CE', 'Department of Civil Engineering', true]
    ];

    for (const dept of departments) {
      try {
        await connection.query(
          'INSERT INTO departments (name, code, description, isActive) VALUES (?, ?, ?, ?)',
          dept
        );
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.log('Warning:', err.message);
        }
      }
    }
    console.log('✅ Departments inserted\n');

    // Insert sample classes
    console.log('Step 4: Inserting sample classes...');
    const classes = [
      ['CS Year 1', 'CS-Y1', 1, '2024-2025', 'Semester 1', true],
      ['CS Year 2', 'CS-Y2', 1, '2024-2025', 'Semester 1', true],
      ['IT Year 1', 'IT-Y1', 2, '2024-2025', 'Semester 1', true],
      ['IT Year 2', 'IT-Y2', 2, '2024-2025', 'Semester 1', true]
    ];

    for (const cls of classes) {
      try {
        await connection.query(
          'INSERT INTO classes (name, code, departmentId, academicYear, semester, isActive) VALUES (?, ?, ?, ?, ?, ?)',
          cls
        );
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.log('Warning:', err.message);
        }
      }
    }
    console.log('✅ Classes inserted\n');

    // Insert sample courses
    console.log('Step 5: Inserting sample courses...');
    const courses = [
      ['Data Structures', 'CS101', 'Introduction to Data Structures and Algorithms', 4, 1, true],
      ['Database Systems', 'CS201', 'Database Management Systems', 4, 1, true],
      ['Web Development', 'CS301', 'Full Stack Web Development', 3, 1, true],
      ['Operating Systems', 'CS202', 'Operating System Concepts', 4, 1, true],
      ['Computer Networks', 'IT201', 'Computer Networks and Security', 4, 2, true]
    ];

    for (const course of courses) {
      try {
        await connection.query(
          'INSERT INTO courses (name, code, description, credits, departmentId, isActive) VALUES (?, ?, ?, ?, ?, ?)',
          course
        );
      } catch (err) {
        if (!err.message.includes('Duplicate entry')) {
          console.log('Warning:', err.message);
        }
      }
    }
    console.log('✅ Courses inserted\n');

    // Verify
    console.log('Step 6: Verifying setup...');
    const [deptCount] = await connection.query('SELECT COUNT(*) as count FROM departments');
    const [classCount] = await connection.query('SELECT COUNT(*) as count FROM classes');
    const [courseCount] = await connection.query('SELECT COUNT(*) as count FROM courses');
    
    console.log(`   Departments: ${deptCount[0].count}`);
    console.log(`   Classes: ${classCount[0].count}`);
    console.log(`   Courses: ${courseCount[0].count}`);

    await connection.end();

    console.log('\n✅ MASTER DATA TABLES ADDED SUCCESSFULLY!\n');
    console.log('🚀 Restart your backend server:');
    console.log('   1. Stop server (Ctrl+C)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Navigate to Students, Departments, etc.\n');

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   • MySQL is not running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   • Check database credentials in .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   • Database does not exist');
      console.error('   • Run: node complete-fix.js first');
    } else if (error.code === 'ENOENT') {
      console.error('   • master_data_schema.sql not found');
    }
    console.error('');
    process.exit(1);
  }
}

addMasterDataTables();
