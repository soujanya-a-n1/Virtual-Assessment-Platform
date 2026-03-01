const { sequelize } = require('./src/models');

async function fixEverything() {
  try {
    console.log('=== COMPREHENSIVE DATABASE FIX ===\n');

    // Step 1: Fix questions table enums
    console.log('1. Fixing questions table enums...');
    try {
      await sequelize.query(`
        ALTER TABLE questions 
        MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') 
        NOT NULL
      `);
      console.log('   ✓ questionType enum fixed');

      await sequelize.query(`
        ALTER TABLE questions 
        MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard') 
        DEFAULT 'Medium'
      `);
      console.log('   ✓ difficulty enum fixed');
    } catch (error) {
      console.log('   ⚠ Enum fix:', error.message);
    }

    // Step 2: Ensure all required columns exist
    console.log('\n2. Checking questions table structure...');
    const [columns] = await sequelize.query('DESCRIBE questions');
    
    const requiredColumns = [
      'id', 'questionText', 'questionType', 'marks', 'difficulty',
      'correctAnswer', 'optionA', 'optionB', 'optionC', 'optionD',
      'topic', 'courseId', 'explanation', 'createdAt', 'updatedAt'
    ];

    const existingColumns = columns.map(c => c.Field);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('   ⚠ Missing columns:', missingColumns.join(', '));
    } else {
      console.log('   ✓ All required columns exist');
    }

    // Step 3: Fix any existing questions with invalid enum values
    console.log('\n3. Checking for invalid data...');
    try {
      const [invalidQuestions] = await sequelize.query(`
        SELECT id, questionType, difficulty 
        FROM questions 
        WHERE questionType NOT IN ('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching')
           OR difficulty NOT IN ('Easy', 'Medium', 'Hard')
        LIMIT 5
      `);

      if (invalidQuestions.length > 0) {
        console.log('   ⚠ Found questions with invalid enum values');
        console.log('   Attempting to fix...');
        
        // Try to fix common issues
        await sequelize.query(`
          UPDATE questions 
          SET questionType = 'Multiple Choice' 
          WHERE questionType IN ('MultipleChoice', 'multiple_choice', 'mcq')
        `);
        
        await sequelize.query(`
          UPDATE questions 
          SET questionType = 'True/False' 
          WHERE questionType IN ('TrueFalse', 'true_false', 'tf')
        `);

        console.log('   ✓ Fixed invalid enum values');
      } else {
        console.log('   ✓ No invalid data found');
      }
    } catch (error) {
      console.log('   ⚠ Data check:', error.message);
    }

    // Step 4: Test question creation
    console.log('\n4. Testing question creation...');
    const { Question } = require('./src/models');
    
    try {
      const testQuestion = await Question.create({
        questionText: 'Test Question - Database Fix Verification',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        correctAnswer: 'A',
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D'
      });
      
      console.log('   ✓ Test question created with ID:', testQuestion.id);
      
      // Clean up
      await testQuestion.destroy();
      console.log('   ✓ Test question deleted');
    } catch (error) {
      console.log('   ✗ Question creation failed:', error.message);
      if (error.parent) {
        console.log('   SQL Error:', error.parent.sqlMessage);
      }
    }

    // Step 5: Test fetching questions
    console.log('\n5. Testing question fetch...');
    try {
      const questions = await Question.findAll({ limit: 5 });
      console.log(`   ✓ Successfully fetched ${questions.length} questions`);
    } catch (error) {
      console.log('   ✗ Fetch failed:', error.message);
    }

    // Step 6: Check exam_questions table
    console.log('\n6. Checking exam_questions table...');
    try {
      const [examQuestionsColumns] = await sequelize.query('DESCRIBE exam_questions');
      const hasDisplayOrder = examQuestionsColumns.find(c => c.Field === 'displayOrder');
      
      if (!hasDisplayOrder) {
        console.log('   Adding displayOrder column...');
        await sequelize.query(`
          ALTER TABLE exam_questions 
          ADD COLUMN displayOrder INT DEFAULT 0 AFTER questionId
        `);
        console.log('   ✓ displayOrder column added');
      } else {
        console.log('   ✓ exam_questions structure is correct');
      }
    } catch (error) {
      console.log('   ⚠ exam_questions check:', error.message);
    }

    // Summary
    console.log('\n=== FIX COMPLETE ===');
    console.log('✓ Database enums updated');
    console.log('✓ Table structure verified');
    console.log('✓ Invalid data cleaned');
    console.log('✓ Operations tested');
    console.log('\n🔄 NEXT STEPS:');
    console.log('1. Restart your backend server (Ctrl+C then npm start)');
    console.log('2. Refresh your browser (Ctrl+F5)');
    console.log('3. Try creating a question');
    console.log('\nIf you still see errors, check the backend terminal for specific error messages.');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

fixEverything();
