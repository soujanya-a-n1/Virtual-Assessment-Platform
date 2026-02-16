const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixQuestionsTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database\n');

    // Check current table structure
    console.log('📋 Current questions table structure:');
    const [columns] = await connection.query('DESCRIBE questions');
    console.table(columns);

    const columnNames = columns.map(col => col.Field);

    // Add missing courseId column
    if (!columnNames.includes('courseId')) {
      console.log('\n🔧 Adding courseId column...');
      await connection.query(`
        ALTER TABLE questions 
        ADD COLUMN courseId INT NULL AFTER topic,
        ADD CONSTRAINT fk_questions_courseId 
        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
      `);
      console.log('✅ courseId column added successfully');
    } else {
      console.log('\n✅ courseId column already exists');
    }

    // Show final structure
    console.log('\n📋 Final questions table structure:');
    const [finalColumns] = await connection.query('DESCRIBE questions');
    console.table(finalColumns);

    console.log('\n✅ Questions table fixed successfully!');
    console.log('\nNext steps:');
    console.log('1. Restart your backend server (Ctrl+C then npm start)');
    console.log('2. Refresh your browser');
    console.log('3. Try adding questions to exam again');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixQuestionsTable();
