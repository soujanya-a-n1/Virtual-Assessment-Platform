const mysql = require('mysql2/promise');
require('dotenv').config();

async function testSystem() {
  console.log('🧪 Testing Virtual Assessment Platform...\n');
  console.log('═══════════════════════════════════════\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Database connection successful\n');

    // Test 1: Check all tables
    console.log('Test 1: Checking database tables...');
    const requiredTables = [
      'users', 'roles', 'user_roles', 'exams', 'questions', 
      'exam_questions', 'exam_submissions', 'student_answers',
      'proctoring_logs', 'students', 'departments', 'classes',
      'courses', 'lecturers', 'course_lecturers'
    ];

    const missingTables = [];
    for (const table of requiredTables) {
      const [tables] = await connection.query(`SHOW TABLES LIKE '${table}'`);
      if (tables.length === 0) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('   Run: node complete-fix.js\n');
      await connection.end();
      return;
    }
    console.log('✅ All required tables exist\n');

    // Test 2: Check data counts
    console.log('Test 2: Checking data counts...');
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [examCount] = await connection.query('SELECT COUNT(*) as count FROM exams');
    const [questionCount] = await connection.query('SELECT COUNT(*) as count FROM questions');
    const [submissionCount] = await connection.query('SELECT COUNT(*) as count FROM exam_submissions');
    const [studentCount] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [departmentCount] = await connection.query('SELECT COUNT(*) as count FROM departments');
    const [classCount] = await connection.query('SELECT COUNT(*) as count FROM classes');

    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Exams: ${examCount[0].count}`);
    console.log(`   Questions: ${questionCount[0].count}`);
    console.log(`   Submissions: ${submissionCount[0].count}`);
    console.log(`   Students: ${studentCount[0].count}`);
    console.log(`   Departments: ${departmentCount[0].count}`);
    console.log(`   Classes: ${classCount[0].count}`);
    console.log('');

    // Test 3: Check user authentication data
    console.log('Test 3: Checking user authentication...');
    const [users] = await connection.query(`
      SELECT u.id, u.firstName, u.lastName, u.email, u.isActive,
             GROUP_CONCAT(r.name) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.userId
      LEFT JOIN roles r ON ur.roleId = r.id
      GROUP BY u.id
      ORDER BY u.id
      LIMIT 5
    `);

    if (users.length > 0) {
      console.log('Sample users:');
      users.forEach(user => {
        console.log(`   ${user.email}`);
        console.log(`      Name: ${user.firstName} ${user.lastName}`);
        console.log(`      Roles: ${user.roles || 'None'}`);
        console.log(`      Active: ${user.isActive ? 'Yes' : 'No'}`);
      });
      console.log('');
    } else {
      console.log('❌ No users found\n');
    }

    // Test 4: Check exam data
    console.log('Test 4: Checking exam data...');
    if (examCount[0].count > 0) {
      const [exams] = await connection.query(`
        SELECT e.id, e.title, e.status, e.duration, e.totalQuestions, 
               e.totalMarks, e.startTime, e.endTime,
               u.firstName, u.lastName
        FROM exams e
        LEFT JOIN users u ON e.createdBy = u.id
        ORDER BY e.createdAt DESC
        LIMIT 3
      `);

      console.log('Sample exams:');
      exams.forEach(exam => {
        console.log(`   ${exam.id}. ${exam.title}`);
        console.log(`      Status: ${exam.status}`);
        console.log(`      Duration: ${exam.duration} min | Questions: ${exam.totalQuestions} | Marks: ${exam.totalMarks}`);
        console.log(`      Created by: ${exam.firstName} ${exam.lastName}`);
        if (exam.startTime) {
          console.log(`      Start: ${new Date(exam.startTime).toLocaleString()}`);
        }
      });
      console.log('');
    } else {
      console.log('⚠️  No exams found (create some via the UI)\n');
    }

    // Test 5: Check analytics calculations
    console.log('Test 5: Checking analytics...');
    if (submissionCount[0].count > 0) {
      const [passedCount] = await connection.query(
        'SELECT COUNT(*) as count FROM exam_submissions WHERE isPassed = TRUE'
      );
      const [failedCount] = await connection.query(
        'SELECT COUNT(*) as count FROM exam_submissions WHERE isPassed = FALSE'
      );
      const [avgScore] = await connection.query(
        'SELECT AVG(obtainedMarks) as avg FROM exam_submissions WHERE obtainedMarks IS NOT NULL'
      );

      const passRate = ((passedCount[0].count / submissionCount[0].count) * 100).toFixed(2);

      console.log(`   Total Submissions: ${submissionCount[0].count}`);
      console.log(`   Passed: ${passedCount[0].count}`);
      console.log(`   Failed: ${failedCount[0].count}`);
      console.log(`   Pass Rate: ${passRate}%`);
      console.log(`   Average Score: ${avgScore[0].avg ? avgScore[0].avg.toFixed(2) : 'N/A'}`);
      console.log('');
    } else {
      console.log('⚠️  No submissions yet (students need to take exams)\n');
    }

    // Test 6: Check master data
    console.log('Test 6: Checking master data...');
    if (departmentCount[0].count > 0) {
      const [departments] = await connection.query('SELECT * FROM departments LIMIT 5');
      console.log('Departments:');
      departments.forEach(dept => {
        console.log(`   ${dept.id}. ${dept.name} (${dept.code})`);
      });
      console.log('');
    } else {
      console.log('⚠️  No departments found\n');
      console.log('   Run: node add-master-data-tables.js\n');
    }

    if (classCount[0].count > 0) {
      const [classes] = await connection.query(`
        SELECT c.id, c.name, d.name as deptName
        FROM classes c
        LEFT JOIN departments d ON c.departmentId = d.id
        LIMIT 5
      `);
      console.log('Classes:');
      classes.forEach(cls => {
        console.log(`   ${cls.id}. ${cls.name} (${cls.deptName || 'No Dept'})`);
      });
      console.log('');
    }

    await connection.end();

    // Final summary
    console.log('═══════════════════════════════════════');
    console.log('📊 SYSTEM STATUS SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Database: Connected`);
    console.log(`✅ Tables: ${requiredTables.length} tables exist`);
    console.log(`📈 Users: ${userCount[0].count}`);
    console.log(`📝 Exams: ${examCount[0].count}`);
    console.log(`❓ Questions: ${questionCount[0].count}`);
    console.log(`📤 Submissions: ${submissionCount[0].count}`);
    console.log(`👨‍🎓 Students: ${studentCount[0].count}`);
    console.log(`🏢 Departments: ${departmentCount[0].count}`);
    console.log(`🎓 Classes: ${classCount[0].count}`);
    console.log('═══════════════════════════════════════\n');

    // Recommendations
    console.log('💡 RECOMMENDATIONS:\n');
    
    if (userCount[0].count === 0) {
      console.log('⚠️  No users found');
      console.log('   → Run: node complete-fix.js\n');
    }

    if (departmentCount[0].count === 0) {
      console.log('⚠️  No departments found');
      console.log('   → Run: node add-master-data-tables.js\n');
    }

    if (examCount[0].count === 0) {
      console.log('⚠️  No exams found');
      console.log('   → Create exams via the UI (Exams page)\n');
    }

    if (questionCount[0].count === 0) {
      console.log('⚠️  No questions found');
      console.log('   → Questions were added automatically\n');
    }

    console.log('🚀 NEXT STEPS:\n');
    console.log('1. Start backend: cd backend && npm start');
    console.log('2. Start frontend: cd frontend && npm start');
    console.log('3. Login with: admin@gmail.com / Admin@123');
    console.log('4. Check Dashboard for correct counts');
    console.log('5. Test Exam Management (create/edit/delete)');
    console.log('6. Test Student Management\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   • MySQL is not running');
      console.error('   • Start MySQL service');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   • Check database credentials in .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   • Database does not exist');
      console.error('   • Run: node complete-fix.js');
    }
    console.error('');
    process.exit(1);
  }
}

testSystem();
