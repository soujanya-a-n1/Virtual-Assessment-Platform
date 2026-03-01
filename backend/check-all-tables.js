const { sequelize } = require('./src/models');

async function checkAllTables() {
  try {
    console.log('=== Checking All Database Tables ===\n');

    const tablesToCheck = [
      'questions',
      'exams', 
      'exam_questions',
      'courses',
      'departments',
      'classes',
      'students',
      'lecturers',
      'users',
      'roles',
      'user_roles'
    ];

    const issues = [];

    for (const table of tablesToCheck) {
      console.log(`\n--- Checking ${table} ---`);
      
      try {
        // Check if table exists
        const [tableExists] = await sequelize.query(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = DATABASE() 
          AND table_name = '${table}'
        `);

        if (tableExists[0].count === 0) {
          console.log(`✗ Table does not exist`);
          issues.push(`${table}: Table missing`);
          continue;
        }

        // Get table structure
        const [columns] = await sequelize.query(`DESCRIBE ${table}`);
        console.log(`✓ Table exists with ${columns.length} columns`);

        // Check for enum columns
        const [enums] = await sequelize.query(`
          SELECT COLUMN_NAME, COLUMN_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = '${table}' 
          AND TABLE_SCHEMA = DATABASE()
          AND COLUMN_TYPE LIKE 'enum%'
        `);

        if (enums.length > 0) {
          console.log(`  Enum columns:`);
          enums.forEach(col => {
            console.log(`    ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
          });
        }

        // Check record count
        const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  Records: ${count[0].count}`);

        // Specific checks for important tables
        if (table === 'questions') {
          const questionTypeCol = columns.find(c => c.Field === 'questionType');
          if (questionTypeCol && !questionTypeCol.Type.includes('Multiple Choice')) {
            issues.push(`questions.questionType: Enum values don't include 'Multiple Choice'`);
          }
        }

        if (table === 'exam_questions') {
          const hasExamId = columns.find(c => c.Field === 'examId');
          const hasQuestionId = columns.find(c => c.Field === 'questionId');
          const hasDisplayOrder = columns.find(c => c.Field === 'displayOrder');
          
          if (!hasExamId) issues.push(`exam_questions: Missing examId column`);
          if (!hasQuestionId) issues.push(`exam_questions: Missing questionId column`);
          if (!hasDisplayOrder) issues.push(`exam_questions: Missing displayOrder column`);
        }

      } catch (error) {
        console.log(`✗ Error checking table: ${error.message}`);
        issues.push(`${table}: ${error.message}`);
      }
    }

    console.log('\n\n=== Summary ===');
    if (issues.length === 0) {
      console.log('✓ All tables are properly configured!');
    } else {
      console.log(`⚠ Found ${issues.length} issue(s):\n`);
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue}`);
      });
      console.log('\nRun the appropriate fix scripts to resolve these issues.');
    }

    process.exit(0);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

checkAllTables();
