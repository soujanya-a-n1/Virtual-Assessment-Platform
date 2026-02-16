const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixExamQuestions() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // Check if exam_questions table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'exam_questions'");
    
    if (tables.length === 0) {
      console.log('Creating exam_questions table...\n');
      
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
      console.log('✅ exam_questions table already exists\n');
      
      // Check table structure
      const [columns] = await connection.query('DESCRIBE exam_questions');
      const columnNames = columns.map(col => col.Field);
      
      console.log('Current columns:', columnNames.join(', '));
      
      // Check if examId and questionId columns exist
      if (!columnNames.includes('examId')) {
        console.log('Adding examId column...');
        await connection.query(`
          ALTER TABLE exam_questions 
          ADD COLUMN examId INT NOT NULL AFTER id
        `);
        console.log('✅ examId column added');
      }
      
      if (!columnNames.includes('questionId')) {
        console.log('Adding questionId column...');
        await connection.query(`
          ALTER TABLE exam_questions 
          ADD COLUMN questionId INT NOT NULL AFTER examId
        `);
        console.log('✅ questionId column added');
      }
      
      if (!columnNames.includes('displayOrder')) {
        console.log('Adding displayOrder column...');
        await connection.query(`
          ALTER TABLE exam_questions 
          ADD COLUMN displayOrder INT NOT NULL DEFAULT 1 AFTER questionId
        `);
        console.log('✅ displayOrder column added');
      }
      
      // Add foreign keys if they don't exist
      const [foreignKeys] = await connection.query(`
        SELECT CONSTRAINT_NAME 
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'exam_questions' 
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      `, [process.env.DB_NAME]);
      
      if (foreignKeys.length === 0) {
        console.log('Adding foreign key constraints...');
        
        try {
          await connection.query(`
            ALTER TABLE exam_questions
            ADD CONSTRAINT fk_exam_questions_examId 
            FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE
          `);
          console.log('✅ Foreign key for examId added');
        } catch (err) {
          console.log('Foreign key for examId might already exist');
        }
        
        try {
          await connection.query(`
            ALTER TABLE exam_questions
            ADD CONSTRAINT fk_exam_questions_questionId 
            FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
          `);
          console.log('✅ Foreign key for questionId added');
        } catch (err) {
          console.log('Foreign key for questionId might already exist');
        }
      }
      
      // Add unique constraint if it doesn't exist
      const [indexes] = await connection.query(`
        SHOW INDEX FROM exam_questions WHERE Key_name = 'unique_exam_question'
      `);
      
      if (indexes.length === 0) {
        console.log('Adding unique constraint...');
        try {
          await connection.query(`
            ALTER TABLE exam_questions
            ADD UNIQUE KEY unique_exam_question (examId, questionId)
          `);
          console.log('✅ Unique constraint added');
        } catch (err) {
          console.log('Unique constraint might already exist');
        }
      }
    }

    // Show final table structure
    console.log('\n📋 Final table structure:');
    const [finalColumns] = await connection.query('DESCRIBE exam_questions');
    console.table(finalColumns);

    // Show constraints
    console.log('\n🔗 Foreign keys:');
    const [constraints] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'exam_questions'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [process.env.DB_NAME]);
    
    if (constraints.length > 0) {
      console.table(constraints);
    } else {
      console.log('No foreign keys found');
    }

    console.log('\n✅ All fixes applied successfully!');
    console.log('\nYou can now:');
    console.log('1. Restart your backend server');
    console.log('2. Try adding questions to exams again');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixExamQuestions();
