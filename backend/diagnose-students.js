const mysql = require('mysql2/promise');
require('dotenv').config();

async function diagnoseStudents() {
  console.log('🔍 Diagnosing Student Management Issues...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Check if students table exists
    console.log('Step 1: Checking if students table exists...');
    const [tables] = await connection.query("SHOW TABLES LIKE 'students'");
    
    if (tables.length === 0) {
      console.log('❌ Students table does NOT exist\n');
      console.log('📝 Solution: Run this command:');
      console.log('   node add-master-data-tables.js\n');
      await connection.end();
      return;
    }
    console.log('✅ Students table exists\n');

    // Check table structure
    console.log('Step 2: Checking students table structure...');
    const [columns] = await connection.query('DESCRIBE students');
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    console.log('');

    // Check if departments table exists
    console.log('Step 3: Checking if departments table exists...');
    const [deptTables] = await connection.query("SHOW TABLES LIKE 'departments'");
    
    if (deptTables.length === 0) {
      console.log('❌ Departments table does NOT exist\n');
      console.log('📝 Solution: Run this command:');
      console.log('   node add-master-data-tables.js\n');
      await connection.end();
      return;
    }
    console.log('✅ Departments table exists\n');

    // Check if classes table exists
    console.log('Step 4: Checking if classes table exists...');
    const [classTables] = await connection.query("SHOW TABLES LIKE 'classes'");
    
    if (classTables.length === 0) {
      console.log('❌ Classes table does NOT exist\n');
      console.log('📝 Solution: Run this command:');
      console.log('   node add-master-data-tables.js\n');
      await connection.end();
      return;
    }
    console.log('✅ Classes table exists\n');

    // Check data
    console.log('Step 5: Checking data...');
    const [studentCount] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [deptCount] = await connection.query('SELECT COUNT(*) as count FROM departments');
    const [classCount] = await connection.query('SELECT COUNT(*) as count FROM classes');
    
    console.log(`   Students: ${studentCount[0].count}`);
    console.log(`   Departments: ${deptCount[0].count}`);
    console.log(`   Classes: ${classCount[0].count}`);
    console.log('');

    if (deptCount[0].count === 0) {
      console.log('⚠️  No departments found\n');
      console.log('📝 Solution: Run this command:');
      console.log('   node add-master-data-tables.js\n');
    }

    if (classCount[0].count === 0) {
      console.log('⚠️  No classes found\n');
      console.log('📝 Solution: Run this command:');
      console.log('   node add-master-data-tables.js\n');
    }

    // Show sample data
    if (studentCount[0].count > 0) {
      console.log('Step 6: Sample students:');
      const [students] = await connection.query(`
        SELECT s.id, s.studentId, u.firstName, u.lastName, u.email, 
               d.name as department, c.name as class
        FROM students s
        LEFT JOIN users u ON s.userId = u.id
        LEFT JOIN departments d ON s.departmentId = d.id
        LEFT JOIN classes c ON s.classId = c.id
        LIMIT 5
      `);
      
      students.forEach(student => {
        console.log(`   ${student.id}. ${student.firstName} ${student.lastName} (${student.email})`);
        console.log(`      Student ID: ${student.studentId || 'N/A'}`);
        console.log(`      Department: ${student.department || 'N/A'}`);
        console.log(`      Class: ${student.class || 'N/A'}`);
      });
      console.log('');
    }

    await connection.end();

    console.log('✅ DIAGNOSIS COMPLETE!\n');
    
    if (studentCount[0].count === 0 && deptCount[0].count > 0 && classCount[0].count > 0) {
      console.log('📋 Summary:');
      console.log('   • All tables exist ✅');
      console.log('   • Departments and classes are set up ✅');
      console.log('   • No students yet (this is normal) ⚠️\n');
      console.log('🚀 You can now:');
      console.log('   1. Restart backend if not running');
      console.log('   2. Go to Students page');
      console.log('   3. Click "Add Student" to create students\n');
    } else if (deptCount[0].count === 0 || classCount[0].count === 0) {
      console.log('📋 Summary:');
      console.log('   • Tables exist but missing data ⚠️\n');
      console.log('🚀 Run this to fix:');
      console.log('   node add-master-data-tables.js\n');
    } else {
      console.log('📋 Summary:');
      console.log('   • Everything looks good! ✅\n');
      console.log('🚀 If students page still not working:');
      console.log('   1. Check backend console for errors');
      console.log('   2. Check browser console (F12)');
      console.log('   3. Make sure backend is running on port 5000\n');
    }

  } catch (error) {
    console.error('\n❌ Diagnosis failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n📝 MySQL is not running. Start MySQL first!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n📝 Check database credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n📝 Database does not exist. Run: node complete-fix.js');
    }
    console.error('');
  }
}

diagnoseStudents();
