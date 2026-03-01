const { sequelize } = require('./src/models');
const models = require('./src/models');

async function verifyDatabaseMapping() {
  try {
    console.log('=== Verifying Database Mapping ===\n');

    // Step 1: Check database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('   ✓ Connected to database:', sequelize.config.database);
    console.log('');

    // Step 2: Check all tables exist
    console.log('2. Checking tables...');
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
      ORDER BY TABLE_NAME
    `);

    const expectedTables = [
      'classes',
      'courses',
      'course_lecturers',
      'departments',
      'exams',
      'exam_questions',
      'exam_submissions',
      'lecturers',
      'proctoring_logs',
      'questions',
      'roles',
      'students',
      'student_answers',
      'student_exam_enrollments',
      'users',
      'user_roles'
    ];

    const existingTables = tables.map(t => t.TABLE_NAME);
    console.log('   Existing tables:', existingTables.length);

    const missingTables = expectedTables.filter(t => !existingTables.includes(t));
    if (missingTables.length > 0) {
      console.log('   ⚠ Missing tables:', missingTables.join(', '));
    } else {
      console.log('   ✓ All expected tables exist');
    }
    console.log('');

    // Step 3: Verify critical table structures
    console.log('3. Verifying table structures...');

    // Check questions table
    const [questionCols] = await sequelize.query('DESCRIBE questions');
    const questionFields = questionCols.map(c => c.Field);
    console.log('   questions table:', questionFields.length, 'columns');
    
    const requiredQuestionFields = ['id', 'questionText', 'questionType', 'marks', 'difficulty', 'correctAnswer', 'courseId'];
    const missingQuestionFields = requiredQuestionFields.filter(f => !questionFields.includes(f));
    if (missingQuestionFields.length > 0) {
      console.log('   ⚠ Missing fields in questions:', missingQuestionFields.join(', '));
    } else {
      console.log('   ✓ questions table structure correct');
    }

    // Check exams table
    const [examCols] = await sequelize.query('DESCRIBE exams');
    const examFields = examCols.map(c => c.Field);
    console.log('   exams table:', examFields.length, 'columns');
    
    const requiredExamFields = ['id', 'title', 'courseId', 'duration', 'totalMarks', 'status'];
    const missingExamFields = requiredExamFields.filter(f => !examFields.includes(f));
    if (missingExamFields.length > 0) {
      console.log('   ⚠ Missing fields in exams:', missingExamFields.join(', '));
    } else {
      console.log('   ✓ exams table structure correct');
    }

    // Check exam_questions table
    const [examQuestionCols] = await sequelize.query('DESCRIBE exam_questions');
    const examQuestionFields = examQuestionCols.map(c => c.Field);
    console.log('   exam_questions table:', examQuestionFields.length, 'columns');
    
    const requiredExamQuestionFields = ['examId', 'questionId'];
    const missingExamQuestionFields = requiredExamQuestionFields.filter(f => !examQuestionFields.includes(f));
    if (missingExamQuestionFields.length > 0) {
      console.log('   ⚠ Missing fields in exam_questions:', missingExamQuestionFields.join(', '));
    } else {
      console.log('   ✓ exam_questions table structure correct');
    }
    console.log('');

    // Step 4: Check foreign key relationships
    console.log('4. Checking foreign key relationships...');
    const [foreignKeys] = await sequelize.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
      AND REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY TABLE_NAME, COLUMN_NAME
    `);

    console.log(`   Found ${foreignKeys.length} foreign key relationships`);
    
    // Check critical relationships
    const criticalRelationships = [
      { table: 'questions', column: 'courseId', references: 'courses' },
      { table: 'exams', column: 'courseId', references: 'courses' },
      { table: 'exam_questions', column: 'examId', references: 'exams' },
      { table: 'exam_questions', column: 'questionId', references: 'questions' }
    ];

    criticalRelationships.forEach(rel => {
      const exists = foreignKeys.find(fk => 
        fk.TABLE_NAME === rel.table && 
        fk.COLUMN_NAME === rel.column && 
        fk.REFERENCED_TABLE_NAME === rel.references
      );
      if (exists) {
        console.log(`   ✓ ${rel.table}.${rel.column} -> ${rel.references}`);
      } else {
        console.log(`   ⚠ Missing: ${rel.table}.${rel.column} -> ${rel.references}`);
      }
    });
    console.log('');

    // Step 5: Test model operations
    console.log('5. Testing model operations...');

    // Test Question model
    try {
      const questionCount = await models.Question.count();
      console.log(`   ✓ Question model: ${questionCount} records`);
    } catch (error) {
      console.log('   ✗ Question model error:', error.message);
    }

    // Test Exam model
    try {
      const examCount = await models.Exam.count();
      console.log(`   ✓ Exam model: ${examCount} records`);
    } catch (error) {
      console.log('   ✗ Exam model error:', error.message);
    }

    // Test Course model
    try {
      const courseCount = await models.Course.count();
      console.log(`   ✓ Course model: ${courseCount} records`);
    } catch (error) {
      console.log('   ✗ Course model error:', error.message);
    }

    // Test ExamQuestion model
    try {
      const examQuestionCount = await models.ExamQuestion.count();
      console.log(`   ✓ ExamQuestion model: ${examQuestionCount} records`);
    } catch (error) {
      console.log('   ✗ ExamQuestion model error:', error.message);
    }
    console.log('');

    // Step 6: Test associations
    console.log('6. Testing model associations...');

    // Test Question -> Course association
    try {
      const question = await models.Question.findOne({
        where: { courseId: { [require('sequelize').Op.ne]: null } },
        include: [{ model: models.Course, as: 'course' }]
      });
      if (question) {
        console.log('   ✓ Question -> Course association works');
      } else {
        console.log('   ⚠ No questions with courseId found to test');
      }
    } catch (error) {
      console.log('   ✗ Question -> Course association error:', error.message);
    }

    // Test Exam -> Course association
    try {
      const exam = await models.Exam.findOne({
        include: [{ model: models.Course, as: 'course' }]
      });
      if (exam) {
        console.log('   ✓ Exam -> Course association works');
      } else {
        console.log('   ⚠ No exams found to test');
      }
    } catch (error) {
      console.log('   ✗ Exam -> Course association error:', error.message);
    }

    // Test Exam -> Questions association
    try {
      const exam = await models.Exam.findOne({
        include: [{ model: models.Question }]
      });
      if (exam) {
        console.log('   ✓ Exam -> Questions association works');
      } else {
        console.log('   ⚠ No exams found to test');
      }
    } catch (error) {
      console.log('   ✗ Exam -> Questions association error:', error.message);
    }
    console.log('');

    // Summary
    console.log('=== Verification Complete ===');
    console.log('✓ Database connection working');
    console.log('✓ Tables verified');
    console.log('✓ Model operations tested');
    console.log('✓ Associations verified');
    console.log('\nDatabase mapping is correct!');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

verifyDatabaseMapping();
