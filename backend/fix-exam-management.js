const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixExamManagement() {
  console.log('🔧 Fixing Exam Management System...\n');

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

    // Check if exams table exists
    console.log('Step 1: Checking exams table...');
    const [examTables] = await connection.query("SHOW TABLES LIKE 'exams'");
    
    if (examTables.length === 0) {
      console.log('❌ Exams table does NOT exist\n');
      console.log('📝 Run: node complete-fix.js to create all tables\n');
      await connection.end();
      return;
    }
    console.log('✅ Exams table exists\n');

    // Check table structure
    console.log('Step 2: Checking exams table structure...');
    const [columns] = await connection.query('DESCRIBE exams');
    
    const requiredColumns = [
      'id', 'title', 'description', 'duration', 'totalQuestions', 
      'totalMarks', 'passingMarks', 'examType', 'status', 
      'startTime', 'endTime', 'requiresProctoring', 'shuffleQuestions',
      'negativeMarkingEnabled', 'negativeMarks', 'createdBy', 'courseId'
    ];

    const existingColumns = columns.map(col => col.Field);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('⚠️  Missing columns:', missingColumns.join(', '));
      console.log('\nAdding missing columns...');

      // Add courseId if missing
      if (missingColumns.includes('courseId')) {
        try {
          await connection.query(`
            ALTER TABLE exams 
            ADD COLUMN courseId INT AFTER createdBy,
            ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
          `);
          console.log('   ✅ Added courseId column');
        } catch (err) {
          if (!err.message.includes('Duplicate')) {
            console.log('   ⚠️  Could not add courseId:', err.message);
          }
        }
      }
    } else {
      console.log('✅ All required columns exist\n');
    }

    // Check questions table
    console.log('Step 3: Checking questions table...');
    const [questionTables] = await connection.query("SHOW TABLES LIKE 'questions'");
    
    if (questionTables.length === 0) {
      console.log('❌ Questions table does NOT exist\n');
      await connection.end();
      return;
    }
    console.log('✅ Questions table exists\n');

    // Check exam_questions junction table
    console.log('Step 4: Checking exam_questions table...');
    const [examQuestionTables] = await connection.query("SHOW TABLES LIKE 'exam_questions'");
    
    if (examQuestionTables.length === 0) {
      console.log('❌ exam_questions table does NOT exist\n');
      await connection.end();
      return;
    }
    console.log('✅ exam_questions table exists\n');

    // Check data
    console.log('Step 5: Checking data...');
    const [examCount] = await connection.query('SELECT COUNT(*) as count FROM exams');
    const [questionCount] = await connection.query('SELECT COUNT(*) as count FROM questions');
    
    console.log(`   Exams: ${examCount[0].count}`);
    console.log(`   Questions: ${questionCount[0].count}`);
    console.log('');

    // Show sample exams
    if (examCount[0].count > 0) {
      console.log('Step 6: Sample exams:');
      const [exams] = await connection.query(`
        SELECT e.id, e.title, e.status, e.duration, e.totalQuestions, e.totalMarks,
               u.firstName, u.lastName
        FROM exams e
        LEFT JOIN users u ON e.createdBy = u.id
        ORDER BY e.createdAt DESC
        LIMIT 5
      `);
      
      exams.forEach(exam => {
        console.log(`   ${exam.id}. ${exam.title}`);
        console.log(`      Status: ${exam.status}`);
        console.log(`      Duration: ${exam.duration} min | Questions: ${exam.totalQuestions} | Marks: ${exam.totalMarks}`);
        console.log(`      Created by: ${exam.firstName} ${exam.lastName}`);
      });
      console.log('');
    } else {
      console.log('Step 6: No exams found (this is normal for new setup)\n');
    }

    // Insert sample questions if none exist
    if (questionCount[0].count === 0) {
      console.log('Step 7: Inserting sample questions...');
      
      const sampleQuestions = [
        ['What is 2 + 2?', 'Multiple Choice', 1, 'Easy', '3', '4', '5', '6', 'B', 'Basic arithmetic'],
        ['What is the capital of France?', 'Multiple Choice', 1, 'Easy', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Geography'],
        ['JavaScript is a programming language', 'True/False', 1, 'Easy', 'True', 'False', null, null, 'A', 'Programming basics'],
        ['What does HTML stand for?', 'Multiple Choice', 2, 'Medium', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language', 'A', 'Web development'],
        ['What is the largest planet?', 'Multiple Choice', 1, 'Easy', 'Earth', 'Jupiter', 'Saturn', 'Mars', 'B', 'Astronomy']
      ];

      for (const q of sampleQuestions) {
        try {
          await connection.query(
            'INSERT INTO questions (questionText, questionType, marks, difficulty, optionA, optionB, optionC, optionD, correctAnswer, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            q
          );
        } catch (err) {
          console.log('   Warning:', err.message);
        }
      }
      console.log('✅ Sample questions inserted\n');
    }

    await connection.end();

    console.log('✅ EXAM MANAGEMENT FIX COMPLETE!\n');
    console.log('═══════════════════════════════════════');
    console.log('📋 Summary:');
    console.log(`   • Exams: ${examCount[0].count}`);
    console.log(`   • Questions: ${questionCount[0].count > 0 ? questionCount[0].count : '5 (sample)'}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('🚀 Next steps:');
    console.log('1. Restart backend server');
    console.log('2. Go to Exams page');
    console.log('3. Click "Create New Exam"');
    console.log('4. Fill in exam details and add questions\n');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   • MySQL is not running');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   • Check database credentials in .env');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('   • Database does not exist');
      console.error('   • Run: node complete-fix.js');
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      console.error('   • Foreign key constraint failed');
      console.error('   • Make sure courses table exists');
      console.error('   • Run: node add-master-data-tables.js');
    }
    console.error('');
    process.exit(1);
  }
}

fixExamManagement();
