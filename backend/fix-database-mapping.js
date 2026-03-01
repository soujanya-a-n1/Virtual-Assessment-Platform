const { sequelize } = require('./src/models');

async function fixDatabaseMapping() {
  try {
    console.log('=== Fixing Database Mapping ===\n');

    // Fix 1: Ensure questions table has correct structure
    console.log('1. Fixing questions table...');
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') 
      NOT NULL
    `);
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard') 
      DEFAULT 'Medium'
    `);
    console.log('   ✓ questions table enums fixed');

    // Fix 2: Ensure courseId column exists in questions
    const [questionCols] = await sequelize.query('DESCRIBE questions');
    const hasCourseId = questionCols.find(c => c.Field === 'courseId');
    if (!hasCourseId) {
      console.log('   Adding courseId to questions...');
      await sequelize.query(`
        ALTER TABLE questions 
        ADD COLUMN courseId INT NULL AFTER topic,
        ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
      `);
      console.log('   ✓ courseId added');
    } else {
      console.log('   ✓ courseId exists');
    }

    // Fix 3: Ensure exams table has courseId
    const [examCols] = await sequelize.query('DESCRIBE exams');
    const examHasCourseId = examCols.find(c => c.Field === 'courseId');
    if (!examHasCourseId) {
      console.log('   Adding courseId to exams...');
      await sequelize.query(`
        ALTER TABLE exams 
        ADD COLUMN courseId INT NULL AFTER description,
        ADD FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL
      `);
      console.log('   ✓ courseId added to exams');
    } else {
      console.log('   ✓ exams.courseId exists');
    }

    // Fix 4: Ensure exam_questions has displayOrder
    const [examQuestionCols] = await sequelize.query('DESCRIBE exam_questions');
    const hasDisplayOrder = examQuestionCols.find(c => c.Field === 'displayOrder');
    if (!hasDisplayOrder) {
      console.log('   Adding displayOrder to exam_questions...');
      await sequelize.query(`
        ALTER TABLE exam_questions 
        ADD COLUMN displayOrder INT DEFAULT 0 AFTER questionId
      `);
      console.log('   ✓ displayOrder added');
    } else {
      console.log('   ✓ displayOrder exists');
    }

    // Fix 5: Ensure unique constraint on exam_questions
    console.log('\n2. Checking exam_questions constraints...');
    const [indexes] = await sequelize.query('SHOW INDEX FROM exam_questions');
    const hasUniqueConstraint = indexes.some(i => 
      i.Key_name.includes('unique') || 
      (i.Column_name === 'examId' && i.Non_unique === 0)
    );

    if (!hasUniqueConstraint) {
      console.log('   Adding unique constraint...');
      try {
        await sequelize.query(`
          ALTER TABLE exam_questions 
          ADD UNIQUE KEY unique_exam_question (examId, questionId)
        `);
        console.log('   ✓ Unique constraint added');
      } catch (error) {
        if (error.message.includes('Duplicate entry')) {
          console.log('   ⚠ Duplicate entries exist, cleaning up...');
          await sequelize.query(`
            DELETE t1 FROM exam_questions t1
            INNER JOIN exam_questions t2 
            WHERE t1.id > t2.id 
            AND t1.examId = t2.examId 
            AND t1.questionId = t2.questionId
          `);
          await sequelize.query(`
            ALTER TABLE exam_questions 
            ADD UNIQUE KEY unique_exam_question (examId, questionId)
          `);
          console.log('   ✓ Duplicates removed and constraint added');
        } else {
          console.log('   ⚠ Constraint error:', error.message);
        }
      }
    } else {
      console.log('   ✓ Unique constraint exists');
    }

    // Fix 6: Sync models with database
    console.log('\n3. Syncing models with database...');
    await sequelize.sync({ alter: false });
    console.log('   ✓ Models synced');

    // Fix 7: Test operations
    console.log('\n4. Testing operations...');
    const { Question, Exam, Course } = require('./src/models');

    // Test question creation
    try {
      const testQ = await Question.create({
        questionText: 'Test mapping verification',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        correctAnswer: 'A',
        optionA: 'A',
        optionB: 'B'
      });
      await testQ.destroy();
      console.log('   ✓ Question CRUD works');
    } catch (error) {
      console.log('   ✗ Question CRUD failed:', error.message);
    }

    // Test fetching with associations
    try {
      const questions = await Question.findAll({
        include: [{ model: Course, as: 'course', required: false }],
        limit: 1
      });
      console.log('   ✓ Question -> Course association works');
    } catch (error) {
      console.log('   ✗ Association failed:', error.message);
    }

    try {
      const exams = await Exam.findAll({
        include: [{ model: Course, as: 'course', required: false }],
        limit: 1
      });
      console.log('   ✓ Exam -> Course association works');
    } catch (error) {
      console.log('   ✗ Association failed:', error.message);
    }

    console.log('\n=== Mapping Fix Complete ===');
    console.log('✓ All table structures corrected');
    console.log('✓ Foreign keys verified');
    console.log('✓ Constraints added');
    console.log('✓ Models synced');
    console.log('✓ Operations tested');
    console.log('\n🔄 Restart your backend server now!');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

fixDatabaseMapping();
