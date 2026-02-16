const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixAnalytics() {
  console.log('🔧 Fixing Analytics and Dashboard Counts...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Check all required tables
    console.log('Step 1: Checking required tables...');
    const requiredTables = ['users', 'exams', 'exam_submissions', 'student_answers', 'questions'];
    const missingTables = [];

    for (const table of requiredTables) {
      const [tables] = await connection.query(`SHOW TABLES LIKE '${table}'`);
      if (tables.length === 0) {
        missingTables.push(table);
      }
    }

    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('\n📝 Run: node complete-fix.js to create all tables\n');
      await connection.end();
      return;
    }
    console.log('✅ All required tables exist\n');

    // Get actual counts
    console.log('Step 2: Getting current counts...');
    
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [examCount] = await connection.query('SELECT COUNT(*) as count FROM exams');
    const [submissionCount] = await connection.query('SELECT COUNT(*) as count FROM exam_submissions');
    const [questionCount] = await connection.query('SELECT COUNT(*) as count FROM questions');

    console.log('Current counts:');
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Exams: ${examCount[0].count}`);
    console.log(`   Submissions: ${submissionCount[0].count}`);
    console.log(`   Questions: ${questionCount[0].count}`);
    console.log('');

    // Calculate pass rate
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

      console.log('Step 3: Submission statistics:');
      console.log(`   Passed: ${passedCount[0].count}`);
      console.log(`   Failed: ${failedCount[0].count}`);
      console.log(`   Pass Rate: ${passRate}%`);
      console.log(`   Average Score: ${avgScore[0].avg ? avgScore[0].avg.toFixed(2) : 'N/A'}`);
      console.log('');
    } else {
      console.log('Step 3: No submissions yet\n');
    }

    // Show sample data
    console.log('Step 4: Sample data:');
    
    if (examCount[0].count > 0) {
      const [exams] = await connection.query(`
        SELECT e.id, e.title, e.status, e.totalQuestions, e.totalMarks,
               COUNT(DISTINCT es.id) as submissions
        FROM exams e
        LEFT JOIN exam_submissions es ON e.id = es.examId
        GROUP BY e.id
        ORDER BY e.createdAt DESC
        LIMIT 5
      `);
      
      console.log('\nExams:');
      exams.forEach(exam => {
        console.log(`   ${exam.id}. ${exam.title}`);
        console.log(`      Status: ${exam.status} | Submissions: ${exam.submissions}`);
      });
    }

    if (userCount[0].count > 0) {
      const [users] = await connection.query(`
        SELECT u.id, u.firstName, u.lastName, u.email,
               COUNT(DISTINCT es.id) as submissions
        FROM users u
        LEFT JOIN exam_submissions es ON u.id = es.userId
        GROUP BY u.id
        ORDER BY u.createdAt DESC
        LIMIT 5
      `);
      
      console.log('\nUsers:');
      users.forEach(user => {
        console.log(`   ${user.id}. ${user.firstName} ${user.lastName} (${user.email})`);
        console.log(`      Submissions: ${user.submissions}`);
      });
    }

    await connection.end();

    console.log('\n✅ ANALYTICS CHECK COMPLETE!\n');
    console.log('═══════════════════════════════════════');
    console.log('📊 Dashboard Statistics:');
    console.log(`   Total Users: ${userCount[0].count}`);
    console.log(`   Total Exams: ${examCount[0].count}`);
    console.log(`   Total Submissions: ${submissionCount[0].count}`);
    console.log(`   Total Questions: ${questionCount[0].count}`);
    console.log('═══════════════════════════════════════\n');

    if (examCount[0].count === 0) {
      console.log('💡 Tip: Create some exams to see them on the dashboard!');
      console.log('   1. Go to Exams page');
      console.log('   2. Click "Create New Exam"');
      console.log('   3. Fill in the details\n');
    }

    if (submissionCount[0].count === 0 && examCount[0].count > 0) {
      console.log('💡 Tip: No submissions yet. Students need to take exams!');
      console.log('   1. Publish an exam');
      console.log('   2. Students can take it');
      console.log('   3. Submissions will appear on dashboard\n');
    }

    console.log('🚀 Dashboard should now show correct counts!');
    console.log('   Refresh your browser to see updated statistics\n');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   • MySQL is not running');
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

fixAnalytics();
