const { sequelize } = require('./src/models');

async function fixExamQuestionsTable() {
  try {
    console.log('=== Fixing exam_questions Table ===\n');

    // Check current table structure
    console.log('1. Checking current table structure...');
    const [columns] = await sequelize.query('DESCRIBE exam_questions');
    console.log('Current columns:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(REQUIRED)' : '(optional)'} ${col.Key ? `[${col.Key}]` : ''} ${col.Extra ? `[${col.Extra}]` : ''}`);
    });
    console.log('');

    // Check for issues
    console.log('2. Checking for common issues...');
    
    const issues = [];
    
    // Check if questionId column exists and is correct
    const questionIdCol = columns.find(c => c.Field === 'questionId');
    if (!questionIdCol) {
      issues.push('Missing questionId column');
    } else if (questionIdCol.Type !== 'int(11)') {
      issues.push(`questionId type is ${questionIdCol.Type}, should be int(11)`);
    }

    // Check if examId column exists and is correct
    const examIdCol = columns.find(c => c.Field === 'examId');
    if (!examIdCol) {
      issues.push('Missing examId column');
    } else if (examIdCol.Type !== 'int(11)') {
      issues.push(`examId type is ${examIdCol.Type}, should be int(11)`);
    }

    // Check if displayOrder exists
    const displayOrderCol = columns.find(c => c.Field === 'displayOrder');
    if (!displayOrderCol) {
      issues.push('Missing displayOrder column');
    }

    // Check timestamps
    const createdAtCol = columns.find(c => c.Field === 'createdAt');
    const updatedAtCol = columns.find(c => c.Field === 'updatedAt');
    if (!createdAtCol) issues.push('Missing createdAt column');
    if (!updatedAtCol) issues.push('Missing updatedAt column');

    if (issues.length > 0) {
      console.log('⚠ Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
      console.log('3. Fixing issues...');
      
      // Recreate table with correct structure
      await sequelize.query(`
        DROP TABLE IF EXISTS exam_questions_backup;
      `);
      
      await sequelize.query(`
        CREATE TABLE exam_questions_backup AS SELECT * FROM exam_questions;
      `);
      console.log('✓ Backup created');

      await sequelize.query(`
        DROP TABLE exam_questions;
      `);

      await sequelize.query(`
        CREATE TABLE exam_questions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          examId INT NOT NULL,
          questionId INT NOT NULL,
          displayOrder INT DEFAULT 0,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY unique_exam_question (examId, questionId),
          FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log('✓ Table recreated with correct structure');

      // Restore data if backup has records
      const [backupCount] = await sequelize.query('SELECT COUNT(*) as count FROM exam_questions_backup');
      if (backupCount[0].count > 0) {
        await sequelize.query(`
          INSERT INTO exam_questions (examId, questionId, displayOrder, createdAt, updatedAt)
          SELECT examId, questionId, 
                 COALESCE(displayOrder, 0) as displayOrder,
                 COALESCE(createdAt, NOW()) as createdAt,
                 COALESCE(updatedAt, NOW()) as updatedAt
          FROM exam_questions_backup
          ON DUPLICATE KEY UPDATE displayOrder = VALUES(displayOrder);
        `);
        console.log(`✓ Restored ${backupCount[0].count} records from backup`);
      }

    } else {
      console.log('✓ No issues found - table structure is correct\n');
    }

    // Verify final structure
    console.log('4. Verifying final structure...');
    const [finalColumns] = await sequelize.query('DESCRIBE exam_questions');
    console.log('Final table structure:');
    finalColumns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(REQUIRED)' : '(optional)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    console.log('');

    // Check indexes
    console.log('5. Checking indexes...');
    const [indexes] = await sequelize.query('SHOW INDEX FROM exam_questions');
    console.log('Indexes:');
    const uniqueIndexes = [...new Set(indexes.map(i => i.Key_name))];
    uniqueIndexes.forEach(indexName => {
      const indexCols = indexes.filter(i => i.Key_name === indexName).map(i => i.Column_name);
      console.log(`  ${indexName}: ${indexCols.join(', ')}`);
    });
    console.log('');

    // Test the table
    console.log('6. Testing table operations...');
    const { ExamQuestion, Exam, Question } = require('./src/models');
    
    // Get first exam and question for testing
    const exam = await Exam.findOne();
    const question = await Question.findOne();
    
    if (exam && question) {
      // Check if association already exists
      const existing = await ExamQuestion.findOne({
        where: { examId: exam.id, questionId: question.id }
      });

      if (!existing) {
        const testRecord = await ExamQuestion.create({
          examId: exam.id,
          questionId: question.id,
          displayOrder: 999
        });
        console.log('✓ Test record created successfully');
        
        await testRecord.destroy();
        console.log('✓ Test record deleted successfully');
      } else {
        console.log('✓ Table is working (test skipped - association already exists)');
      }
    } else {
      console.log('⚠ Cannot test - no exam or question found in database');
    }

    console.log('\n=== Fix Complete ===');
    console.log('The exam_questions table is now properly configured.');

    process.exit(0);

  } catch (error) {
    console.error('Error fixing table:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

fixExamQuestionsTable();
