const { Question } = require('./src/models');
const sequelize = require('./src/config/database');

async function testQuestionFetch() {
  try {
    console.log('=== Testing Question Fetch ===\n');

    // Test 1: Fetch question #42 using Sequelize
    console.log('1. Fetching question #42 using Sequelize...');
    const question = await Question.findByPk(42);
    
    if (question) {
      console.log('Question found:');
      console.log('  ID:', question.id);
      console.log('  Text:', question.questionText);
      console.log('  Type:', question.questionType);
      console.log('  Option A:', question.optionA || '(empty)');
      console.log('  Option B:', question.optionB || '(empty)');
      console.log('  Option C:', question.optionC || '(empty)');
      console.log('  Option D:', question.optionD || '(empty)');
      console.log('  Correct Answer:', question.correctAnswer);
    } else {
      console.log('Question #42 not found');
    }

    // Test 2: Raw SQL query
    console.log('\n2. Fetching question #42 using raw SQL...');
    const [results] = await sequelize.query('SELECT * FROM questions WHERE id = 42');
    
    if (results.length > 0) {
      const q = results[0];
      console.log('Question found:');
      console.log('  ID:', q.id);
      console.log('  Text:', q.questionText);
      console.log('  Type:', q.questionType);
      console.log('  Option A:', q.optionA || '(empty)');
      console.log('  Option B:', q.optionB || '(empty)');
      console.log('  Option C:', q.optionC || '(empty)');
      console.log('  Option D:', q.optionD || '(empty)');
      console.log('  Correct Answer:', q.correctAnswer);
    }

    // Test 3: Check all questions with courseId 4
    console.log('\n3. Checking all questions with courseId 4...');
    const allQuestions = await Question.findAll({
      where: { courseId: 4 },
      order: [['id', 'ASC']],
      limit: 5
    });

    console.log(`Found ${allQuestions.length} questions:`);
    allQuestions.forEach(q => {
      console.log(`\n  Q${q.id}: ${q.questionText.substring(0, 50)}...`);
      console.log(`    Type: ${q.questionType}`);
      console.log(`    Options: A="${q.optionA || 'empty'}", B="${q.optionB || 'empty'}", C="${q.optionC || 'empty'}", D="${q.optionD || 'empty'}"`);
    });

    console.log('\n=== Test Complete ===');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testQuestionFetch();
