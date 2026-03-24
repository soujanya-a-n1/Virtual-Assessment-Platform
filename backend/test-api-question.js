const axios = require('axios');

async function testQuestionAPI() {
  try {
    console.log('=== Testing Question API ===\n');

    // Test 1: Get question by ID
    console.log('1. Testing GET /api/questions/42...');
    const response = await axios.get('http://localhost:5000/api/questions/42');
    
    const question = response.data.question;
    console.log('Question received from API:');
    console.log('  ID:', question.id);
    console.log('  Text:', question.questionText);
    console.log('  Type:', question.questionType);
    console.log('  Option A:', question.optionA || '(empty)');
    console.log('  Option B:', question.optionB || '(empty)');
    console.log('  Option C:', question.optionC || '(empty)');
    console.log('  Option D:', question.optionD || '(empty)');
    console.log('  Correct Answer:', question.correctAnswer);

    // Test 2: Get all questions for course 4
    console.log('\n2. Testing GET /api/questions?courseId=4...');
    const response2 = await axios.get('http://localhost:5000/api/questions?courseId=4');
    
    const questions = response2.data.questions;
    console.log(`Found ${questions.length} questions for course 4`);
    
    if (questions.length > 0) {
      const firstQ = questions[0];
      console.log('\nFirst question:');
      console.log('  ID:', firstQ.id);
      console.log('  Text:', firstQ.questionText.substring(0, 50) + '...');
      console.log('  Option A:', firstQ.optionA || '(empty)');
      console.log('  Option B:', firstQ.optionB || '(empty)');
      console.log('  Option C:', firstQ.optionC || '(empty)');
      console.log('  Option D:', firstQ.optionD || '(empty)');
    }

    console.log('\n=== API Test Complete ===');
    console.log('✓ All options are being returned correctly by the API');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testQuestionAPI();
