const { Question, sequelize } = require('./src/models');

async function diagnoseQuestionError() {
  try {
    console.log('=== Diagnosing Question Creation Error ===\n');

    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Test 2: Check table structure
    console.log('2. Checking questions table structure...');
    const [results] = await sequelize.query('DESCRIBE questions');
    console.log('Table columns:');
    results.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(REQUIRED)' : '(optional)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    console.log('');

    // Test 3: Try creating a minimal question
    console.log('3. Testing minimal question creation...');
    const testQuestion = {
      questionText: 'Test Question',
      questionType: 'Multiple Choice',
      marks: 5,
      difficulty: 'Medium',
      correctAnswer: 'A',
      optionA: 'Option A',
      optionB: 'Option B',
      optionC: 'Option C',
      optionD: 'Option D'
    };

    console.log('Test data:', testQuestion);
    
    try {
      const created = await Question.create(testQuestion);
      console.log('✓ Question created successfully with ID:', created.id);
      
      // Clean up
      await created.destroy();
      console.log('✓ Test question deleted\n');
    } catch (createError) {
      console.error('✗ Error creating question:');
      console.error('  Message:', createError.message);
      console.error('  Name:', createError.name);
      if (createError.errors) {
        console.error('  Validation errors:');
        createError.errors.forEach(err => {
          console.error(`    - ${err.path}: ${err.message}`);
        });
      }
      console.log('');
    }

    // Test 4: Check for existing questions
    console.log('4. Checking existing questions...');
    const count = await Question.count();
    console.log(`Found ${count} existing questions\n`);

    // Test 5: Check enum values
    console.log('5. Checking enum constraints...');
    const [enumResults] = await sequelize.query(`
      SELECT COLUMN_NAME, COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'questions' 
      AND TABLE_SCHEMA = DATABASE()
      AND COLUMN_TYPE LIKE 'enum%'
    `);
    
    if (enumResults.length > 0) {
      console.log('Enum columns:');
      enumResults.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
      });
    } else {
      console.log('No enum columns found');
    }

    console.log('\n=== Diagnosis Complete ===');
    process.exit(0);

  } catch (error) {
    console.error('Fatal error during diagnosis:', error);
    process.exit(1);
  }
}

diagnoseQuestionError();
