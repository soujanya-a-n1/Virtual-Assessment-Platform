const mysql = require('mysql2/promise');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function fixDatabaseIssues() {
  let connection;
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║     Virtual Assessment Platform - Database Fixer      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database\n');

    console.log('Select what you want to fix:\n');
    console.log('1. Fix questions table (add missing courseId column)');
    console.log('2. Fix exam_questions table (create/update structure)');
    console.log('3. Fix all tables (comprehensive fix)');
    console.log('4. Check database status');
    console.log('5. Exit\n');

    const choice = await question('Enter your choice (1-5): ');

    switch (choice.trim()) {
      case '1':
        await fixQuestionsTable(connection);
        break;
      case '2':
        await fixExamQuestionsTable(connection);
        break;
      case '3':
        await fixAllTables(connection);
        break;
      case '4':
        await checkDatabaseStatus(connection);
        break;
      case '5':
        console.log('\n👋 Goodbye!');
        break;
      default:
        console.log('\n❌ Invalid choice');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
    rl.close();
  }
}

async function fixQuestionsTable(connection) {
  console.log('\n🔧 Fixing questions table...\n');

  try {
    // Check current structure
    const [columns] = await connection.query('DESCRIBE questions');
    const columnNames = columns.map(col => col.Field);

    console.log('Current columns:', columnNames.join(', '));

    // Add missing courseId column
    if (!columnNames.includes('courseId')) {
      console.log('\n➕ Adding courseId column...');
      await connection.query(`
        ALTER TABLE questions 
        ADD COLUMN courseId INT NULL AFTER topic
      `);
      console.log('✅ courseId column added');

      // Add foreign key
      try {
        await connection.query(`
          ALTER TABLE questions
          ADD CONSTRAINT fk_questions_courseId 
          FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
        `);
        console.log('✅ Foreign key constraint added');
      } catch (err) {
        console.log('⚠️  Foreign key might already exist or courses table missing');
      }
    } else {
      console.log('✅ courseId column already exists');
    }

    // Show final structure
    console.log('\n📋 Final questions table structure:');
    const [finalColumns] = await connection.query('DESCRIBE questions');
    console.table(finalColumns);

    console.log('\n✅ Questions table fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing questions table:', error.message);
  }
}

async function fixExamQuestionsTable(connection) {
  console.log('\n🔧 Fixing exam_questions table...\n');

  try {
    // Check if table exists
    const [tables] = await connection.query("SHOW TABLES LIKE 'exam_questions'");
    
    if (tables.length === 0) {
      console.log('Creating exam_questions table...');
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
      console.log('✅ exam_questions table created');
    } else {
      console.log('✅ exam_questions table exists');
      
      // Check and add missing columns
      const [columns] = await connection.query('DESCRIBE exam_questions');
      const columnNames = columns.map(col => col.Field);

      if (!columnNames.includes('examId')) {
        await connection.query('ALTER TABLE exam_questions ADD COLUMN examId INT NOT NULL AFTER id');
        console.log('✅ examId column added');
      }

      if (!columnNames.includes('questionId')) {
        await connection.query('ALTER TABLE exam_questions ADD COLUMN questionId INT NOT NULL AFTER examId');
        console.log('✅ questionId column added');
      }

      if (!columnNames.includes('displayOrder')) {
        await connection.query('ALTER TABLE exam_questions ADD COLUMN displayOrder INT NOT NULL DEFAULT 1 AFTER questionId');
        console.log('✅ displayOrder column added');
      }
    }

    // Show final structure
    console.log('\n📋 Final exam_questions table structure:');
    const [finalColumns] = await connection.query('DESCRIBE exam_questions');
    console.table(finalColumns);

    console.log('\n✅ exam_questions table fixed successfully!');
  } catch (error) {
    console.error('❌ Error fixing exam_questions table:', error.message);
  }
}

async function fixAllTables(connection) {
  console.log('\n🔧 Running comprehensive database fix...\n');

  await fixQuestionsTable(connection);
  console.log('\n' + '─'.repeat(60) + '\n');
  await fixExamQuestionsTable(connection);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ All tables fixed successfully!');
  console.log('═'.repeat(60));
}

async function checkDatabaseStatus(connection) {
  console.log('\n📊 Checking database status...\n');

  try {
    // Check questions table
    console.log('📋 Questions table:');
    const [qColumns] = await connection.query('DESCRIBE questions');
    console.table(qColumns);
    const [qCount] = await connection.query('SELECT COUNT(*) as count FROM questions');
    console.log(`Total questions: ${qCount[0].count}\n`);

    // Check exam_questions table
    const [eqTables] = await connection.query("SHOW TABLES LIKE 'exam_questions'");
    if (eqTables.length > 0) {
      console.log('📋 exam_questions table:');
      const [eqColumns] = await connection.query('DESCRIBE exam_questions');
      console.table(eqColumns);
      const [eqCount] = await connection.query('SELECT COUNT(*) as count FROM exam_questions');
      console.log(`Total exam-question links: ${eqCount[0].count}\n`);
    } else {
      console.log('❌ exam_questions table does not exist\n');
    }

    // Check exams table
    console.log('📋 Exams:');
    const [exams] = await connection.query('SELECT id, title, status FROM exams LIMIT 5');
    if (exams.length > 0) {
      console.table(exams);
    } else {
      console.log('No exams found\n');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
}

// Run the script
fixDatabaseIssues();
