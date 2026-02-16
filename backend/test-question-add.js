const { Exam, Question, ExamQuestion } = require('./src/models');
const sequelize = require('./src/config/database');

async function testAddQuestions() {
  try {
    console.log('Testing question addition to exam...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Check if we have any exams
    const exams = await Exam.findAll({ limit: 1 });
    if (exams.length === 0) {
      console.log('❌ No exams found. Please create an exam first.');
      process.exit(1);
    }
    const exam = exams[0];
    console.log(`✅ Found exam: ${exam.title} (ID: ${exam.id})\n`);

    // Check if we have any questions
    const questions = await Question.findAll({ limit: 3 });
    if (questions.length === 0) {
      console.log('❌ No questions found. Please create questions first.');
      process.exit(1);
    }
    console.log(`✅ Found ${questions.length} questions\n`);

    // Try to add questions to exam
    console.log('Attempting to add questions to exam...');
    const questionIds = questions.map(q => q.id);
    
    for (let i = 0; i < questionIds.length; i++) {
      try {
        await ExamQuestion.create({
          examId: exam.id,
          questionId: questionIds[i],
          displayOrder: i + 1,
        });
        console.log(`✅ Added question ${questionIds[i]} to exam`);
      } catch (error) {
        console.log(`❌ Failed to add question ${questionIds[i]}: ${error.message}`);
      }
    }

    // Check exam questions
    const examQuestions = await ExamQuestion.findAll({
      where: { examId: exam.id }
    });
    console.log(`\n✅ Exam now has ${examQuestions.length} questions`);

    // Get exam with questions
    const examWithQuestions = await Exam.findByPk(exam.id, {
      include: [{
        model: Question,
        through: { attributes: [] }
      }]
    });
    console.log(`✅ Exam loaded with ${examWithQuestions.Questions?.length || 0} questions via association\n`);

    console.log('🎉 Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testAddQuestions();
