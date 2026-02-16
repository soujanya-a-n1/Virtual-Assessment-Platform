const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkExamQuestionsTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // Check if exam_questions table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'exam_questions'");
    
    if (tables.length === 0) {
      console.log('❌ exam_questions table does NOT exist');
      console.log('\nCreating exam_questions table...\n');
      
      await connection.query(`
        CREATE TABLE exam_questions (
          id INT PRIMARY KEY AUTO_INCREMENT,
          examId INT NOT NULL,
          questionId INT NOT NULL,
          displayOrder INT NOT NULL DEFAULT 1,
          createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
          UNIQUE KEY unique_exam_question (examId, questionId)
        )
      `);
      
      console.log('✅ exam_questions table created successfully\n');
    } else {
      console.log('✅ exam_questions table exists\n');
    }

    // Show table structure
    const [columns] = await connection.query('DESCRIBE exam_questions');
    console.log('Table structure:');
    console.table(columns);

    // Check if there are any records
    const [count] = await connection.query('SELECT COUNT(*) as count FROM exam_questions');
    console.log(`\nTotal records in exam_questions: ${count[0].count}`);

    // Show sample records if any
    if (count[0].count > 0) {
      const [records] = await connection.query('SELECT * FROM exam_questions LIMIT 5');
      console.log('\nSample records:');
      console.table(records);
    }

    await connection.end();
    console.log('\n✅ Check completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

checkExamQuestionsTable();
