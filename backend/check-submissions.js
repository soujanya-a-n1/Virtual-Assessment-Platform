const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkSubmissions() {
  console.log('🔍 Checking Submission & Result System...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Check exam_submissions table
    console.log('Step 1: Checking exam_submissions table...');
    const [submissionTables] = await connection.query("SHOW TABLES LIKE 'exam_submissions'");
    
    if (submissionTables.length === 0) {
      console.log('❌ exam_submissions table does NOT exist\n');
      await connection.end();
      return;
    }
    console.log('✅ exam_submissions table exists\n');

    // Check table structure
    console.log('Step 2: Checking table structure...');
    const [columns] = await connection.query('DESCRIBE exam_submissions');
    
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`   ${col.Field} (${col.Type}) ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    console.log('');

    // Check for missing startedAt column
    const hasStartedAt = columns.some(col => col.Field === 'startedAt');
    if (!hasStartedAt) {
      console.log('⚠️  Missing startedAt column - adding it...');
      await connection.query(`
        ALTER TABLE exam_submissions 
        ADD COLUMN startedAt DATETIME AFTER status
      `);
      console.log('✅ Added startedAt column\n');
    }

    // Check student_answers table
    console.log('Step 3: Checking student_answers table...');
    const [answerTables] = await connection.query("SHOW TABLES LIKE 'student_answers'");
    
    if (answerTables.length === 0) {
      console.log('❌ student_answers table does NOT exist\n');
      await connection.end();
      return;
    }
    console.log('✅ student_answers table exists\n');

    // Check data
    console.log('Step 4: Checking data...');
    const [submissionCount] = await connection.query('SELECT COUNT(*) as count FROM exam_submissions');
    const [answerCount] = await connection.query('SELECT COUNT(*) as count FROM student_answers');
    
    console.log(`   Submissions: ${submissionCount[0].count}`);
    console.log(`   Student Answers: ${answerCount[0].count}`);
    console.log('');

    // Check published exams
    console.log('Step 5: Checking available exams...');
    const [publishedExams] = await connection.query(`
      SELECT id, title, status, totalQuestions, totalMarks, startTime, endTime
      FROM exams
      WHERE status IN ('Published', 'Active')
      ORDER BY createdAt DESC
    `);

    if (publishedExams.length > 0) {
      console.log('Published/Active exams:');
      publishedExams.forEach(exam => {
        console.log(`   ${exam.id}. ${exam.title} (${exam.status})`);
        console.log(`      Questions: ${exam.totalQuestions} | Marks: ${exam.totalMarks}`);
        if (exam.startTime) {
          console.log(`      Start: ${new Date(exam.startTime).toLocaleString()}`);
        }
      });
      console.log('');
    } else {
      console.log('⚠️  No published exams found');
      console.log('   Students need published exams to take\n');
    }

    // Check if exams have questions
    console.log('Step 6: Checking exam questions...');
    const [examQuestions] = await connection.query(`
      SELECT e.id, e.title, COUNT(eq.questionId) as questionCount
      FROM exams e
      LEFT JOIN exam_questions eq ON e.id = eq.examId
      WHERE e.status IN ('Published', 'Active')
      GROUP BY e.id
    `);

    if (examQuestions.length > 0) {
      console.log('Exam question counts:');
      examQuestions.forEach(exam => {
        const status = exam.questionCount > 0 ? '✅' : '❌';
        console.log(`   ${status} ${exam.title}: ${exam.questionCount} questions`);
      });
      console.log('');
    }

    // Check existing submissions
    if (submissionCount[0].count > 0) {
      console.log('Step 7: Sample submissions...');
      const [submissions] = await connection.query(`
        SELECT es.id, es.status, es.obtainedMarks, es.isPassed, es.submitTime,
               e.title as examTitle, u.firstName, u.lastName
        FROM exam_submissions es
        JOIN exams e ON es.examId = e.id
        JOIN users u ON es.userId = u.id
        ORDER BY es.createdAt DESC
        LIMIT 5
      `);

      submissions.forEach(sub => {
        console.log(`   ${sub.id}. ${sub.examTitle}`);
        console.log(`      Student: ${sub.firstName} ${sub.lastName}`);
        console.log(`      Status: ${sub.status}`);
        if (sub.obtainedMarks !== null) {
          console.log(`      Score: ${sub.obtainedMarks} | Passed: ${sub.isPassed ? 'Yes' : 'No'}`);
        }
        if (sub.submitTime) {
          console.log(`      Submitted: ${new Date(sub.submitTime).toLocaleString()}`);
        }
      });
      console.log('');
    }

    await connection.end();

    console.log('═══════════════════════════════════════');
    console.log('📊 SUBMISSION SYSTEM STATUS');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Tables: exam_submissions, student_answers`);
    console.log(`📝 Submissions: ${submissionCount[0].count}`);
    console.log(`📋 Answers: ${answerCount[0].count}`);
    console.log(`📚 Published Exams: ${publishedExams.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('💡 HOW TO USE SUBMISSION SYSTEM:\n');
    
    if (publishedExams.length === 0) {
      console.log('⚠️  STEP 1: Publish an exam');
      console.log('   1. Go to Exams page');
      console.log('   2. Edit an exam');
      console.log('   3. Change status to "Published"');
      console.log('   4. Save the exam\n');
    } else {
      console.log('✅ STEP 1: Exams are published\n');
    }

    console.log('STEP 2: Take exam as student');
    console.log('   1. Login as student (student1@gmail.com / Admin@123)');
    console.log('   2. Go to Exams page');
    console.log('   3. Click on a published exam');
    console.log('   4. Click "Start Exam"');
    console.log('   5. Answer questions');
    console.log('   6. Click "Submit Exam"\n');

    console.log('STEP 3: View results');
    console.log('   1. Go to Results page');
    console.log('   2. See your exam scores');
    console.log('   3. Click "View Details" for full report\n');

    console.log('STEP 4: Admin/Examiner review');
    console.log('   1. Login as admin/examiner');
    console.log('   2. Go to Submissions page');
    console.log('   3. Review student submissions');
    console.log('   4. Evaluate if needed\n');

  } catch (error) {
    console.error('\n❌ Check failed:', error.message);
    process.exit(1);
  }
}

checkSubmissions();
