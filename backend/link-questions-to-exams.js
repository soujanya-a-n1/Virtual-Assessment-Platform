const mysql = require('mysql2/promise');
require('dotenv').config();

async function linkQuestionsToExams() {
  console.log('🔗 Linking Questions to Exams...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Get all exams
    const [exams] = await connection.query('SELECT id, title, totalQuestions FROM exams');
    
    if (exams.length === 0) {
      console.log('❌ No exams found\n');
      await connection.end();
      return;
    }

    console.log(`Found ${exams.length} exams\n`);

    // Get all questions
    const [questions] = await connection.query('SELECT id FROM questions');
    
    if (questions.length === 0) {
      console.log('❌ No questions found\n');
      await connection.end();
      return;
    }

    console.log(`Found ${questions.length} questions\n`);

    // Link questions to each exam
    for (const exam of exams) {
      console.log(`Processing: ${exam.title}`);
      
      // Check if already has questions
      const [existing] = await connection.query(
        'SELECT COUNT(*) as count FROM exam_questions WHERE examId = ?',
        [exam.id]
      );

      if (existing[0].count > 0) {
        console.log(`   ✅ Already has ${existing[0].count} questions\n`);
        continue;
      }

      // Link all available questions to this exam
      const questionsToLink = Math.min(exam.totalQuestions, questions.length);
      
      for (let i = 0; i < questionsToLink; i++) {
        try {
          await connection.query(
            'INSERT INTO exam_questions (examId, questionId) VALUES (?, ?)',
            [exam.id, questions[i].id]
          );
        } catch (err) {
          // Ignore duplicate errors
          if (!err.message.includes('Duplicate')) {
            console.log(`   ⚠️  Error linking question: ${err.message}`);
          }
        }
      }

      console.log(`   ✅ Linked ${questionsToLink} questions\n`);
    }

    // Verify results
    console.log('═══════════════════════════════════════');
    console.log('📊 VERIFICATION');
    console.log('═══════════════════════════════════════\n');

    for (const exam of exams) {
      const [count] = await connection.query(
        'SELECT COUNT(*) as count FROM exam_questions WHERE examId = ?',
        [exam.id]
      );
      console.log(`${exam.title}: ${count[0].count} questions`);
    }

    await connection.end();

    console.log('\n✅ QUESTIONS LINKED SUCCESSFULLY!\n');
    console.log('🚀 Next steps:');
    console.log('1. Publish an exam (change status to "Published")');
    console.log('2. Login as student');
    console.log('3. Go to Exams page');
    console.log('4. Click "Take Exam" on a published exam\n');

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

linkQuestionsToExams();
