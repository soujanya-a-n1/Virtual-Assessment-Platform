const { sequelize } = require('./src/models');

async function fixQuestionEnums() {
  try {
    console.log('=== Fixing Question Table Enum Values ===\n');

    // Check current enum values
    console.log('1. Checking current enum values...');
    const [currentEnums] = await sequelize.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'questions' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_TYPE LIKE 'enum%'
    `);

    console.log('Current enum columns:');
    currentEnums.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
    });
    console.log('');

    // Fix questionType enum
    console.log('2. Fixing questionType enum...');
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') 
      NOT NULL
    `);
    console.log('✓ questionType enum updated\n');

    // Fix difficulty enum
    console.log('3. Fixing difficulty enum...');
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard') 
      DEFAULT 'Medium'
    `);
    console.log('✓ difficulty enum updated\n');

    // Verify the changes
    console.log('4. Verifying changes...');
    const [newEnums] = await sequelize.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'questions' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_TYPE LIKE 'enum%'
    `);

    console.log('Updated enum columns:');
    newEnums.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
    });
    console.log('');

    // Test creating a question
    console.log('5. Testing question creation...');
    const { Question } = require('./src/models');
    
    const testQuestion = {
      questionText: 'Test Question - What is 2+2?',
      questionType: 'Multiple Choice',
      marks: 5,
      difficulty: 'Medium',
      correctAnswer: 'B',
      optionA: '3',
      optionB: '4',
      optionC: '5',
      optionD: '6'
    };

    const created = await Question.create(testQuestion);
    console.log('✓ Test question created successfully with ID:', created.id);
    
    // Clean up test question
    await created.destroy();
    console.log('✓ Test question deleted\n');

    console.log('=== Enum Fix Complete ===');
    console.log('✓ questionType: Multiple Choice, True/False, Short Answer, Essay, Matching');
    console.log('✓ difficulty: Easy, Medium, Hard');
    console.log('\nYou can now create questions in the UI!');
    console.log('Remember to restart the backend server if it was running.');

    process.exit(0);

  } catch (error) {
    console.error('Error fixing enums:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

fixQuestionEnums();
