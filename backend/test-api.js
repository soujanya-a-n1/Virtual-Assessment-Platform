const sequelize = require('./src/config/database');
const { Question, ExamSubmission, User, Exam } = require('./src/models');

async function testAPI() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('\n📊 Testing Question model...');
    const questionCount = await Question.count();
    console.log(`✅ Questions in database: ${questionCount}`);

    console.log('\n📊 Testing ExamSubmission model...');
    const submissionCount = await ExamSubmission.count();
    console.log(`✅ Submissions in database: ${submissionCount}`);

    console.log('\n📊 Testing User model...');
    const userCount = await User.count();
    console.log(`✅ Users in database: ${userCount}`);

    console.log('\n📊 Testing Exam model...');
    const examCount = await Exam.count();
    console.log(`✅ Exams in database: ${examCount}`);

    console.log('\n🎉 All models working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testAPI();
