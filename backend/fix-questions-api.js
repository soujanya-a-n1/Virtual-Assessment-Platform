const sequelize = require('./src/config/database');
const { Question, Course } = require('./src/models');

async function fixQuestionsAPI() {
  try {
    console.log('🔧 Fixing Questions API...\n');
    
    // Step 1: Check database connection
    console.log('Step 1: Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    // Step 2: Check if questions table exists
    console.log('Step 2: Checking questions table...');
    try {
      const [results] = await sequelize.query('DESCRIBE questions');
      console.log('✓ Questions table exists with columns:');
      results.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
    } catch (error) {
      if (error.message.includes("doesn't exist")) {
        console.log('✗ Questions table does not exist!');
        console.log('\n🔨 Creating questions table...');
        await sequelize.sync({ alter: true });
        console.log('✓ Questions table created successfully');
      } else {
        throw error;
      }
    }

    // Step 3: Test Question model
    console.log('\nStep 3: Testing Question model...');
    const count = await Question.count();
    console.log(`✓ Question model working. Total questions: ${count}`);

    // Step 4: Test fetching questions
    console.log('\nStep 4: Testing question fetch...');
    const questions = await Question.findAll({ 
      limit: 5,
      order: [['createdAt', 'DESC']]
    });
    console.log(`✓ Successfully fetched ${questions.length} questions`);

    if (questions.length > 0) {
      console.log('\nSample question:');
      const q = questions[0];
      console.log(`  ID: ${q.id}`);
      console.log(`  Text: ${q.questionText.substring(0, 60)}...`);
      console.log(`  Type: ${q.questionType}`);
      console.log(`  Marks: ${q.marks}`);
      console.log(`  Course ID: ${q.courseId || 'None'}`);
    } else {
      console.log('\n⚠ No questions found in database');
      console.log('  You can add questions using the Exam Management UI');
    }

    // Step 5: Test with courseId filter
    console.log('\nStep 5: Testing courseId filter...');
    const courses = await Course.findAll({ limit: 1 });
    if (courses.length > 0) {
      const testCourseId = courses[0].id;
      const courseQuestions = await Question.findAll({
        where: { courseId: testCourseId }
      });
      console.log(`✓ Filter test passed. Questions for course ${testCourseId}: ${courseQuestions.length}`);
    } else {
      console.log('⚠ No courses found to test filter');
    }

    console.log('\n✅ ALL CHECKS PASSED!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend server (Ctrl+C then npm start)');
    console.log('   2. Refresh your browser (F5 or Ctrl+F5)');
    console.log('   3. Try accessing the Questions page again');
    
    if (count === 0) {
      console.log('\n💡 To add sample questions, you can:');
      console.log('   - Use the "Add Question" button in Exam Management');
      console.log('   - Or run: node add-sample-questions.js');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error details:');
    console.error(error);
    
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Make sure MySQL is running');
    console.log('   2. Check your .env file has correct database credentials');
    console.log('   3. Verify database "virtual_assessment_db" exists');
    console.log('   4. Try running: node src/models/sync.js');
  } finally {
    await sequelize.close();
  }
}

fixQuestionsAPI();
