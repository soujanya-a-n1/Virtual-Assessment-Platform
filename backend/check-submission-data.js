const { ExamSubmission, StudentAnswer, Question } = require('./src/models');

async function checkSubmissionData() {
  try {
    console.log('=== CHECKING SUBMISSION DATA ===\n');

    // Get the most recent submission
    const submission = await ExamSubmission.findOne({
      order: [['createdAt', 'DESC']],
      include: [
        {
          association: 'exam',
          attributes: ['id', 'title', 'totalMarks', 'passingMarks']
        },
        {
          association: 'student',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!submission) {
      console.log('No submissions found');
      process.exit(0);
    }

    console.log('Submission Details:');
    console.log('  ID:', submission.id);
    console.log('  Status:', submission.status);
    console.log('  Obtained Marks:', submission.obtainedMarks);
    console.log('  Is Passed:', submission.isPassed);
    console.log('  Submit Time:', submission.submitTime);
    console.log('  Exam:', submission.exam?.title);
    console.log('  Total Marks:', submission.exam?.totalMarks);
    console.log('  Passing Marks:', submission.exam?.passingMarks);

    // Get student answers
    const answers = await StudentAnswer.findAll({
      where: { submissionId: submission.id },
      include: {
        association: 'question',
        attributes: ['id', 'questionText', 'correctAnswer', 'marks']
      }
    });

    console.log(`\nTotal Answers: ${answers.length}`);
    console.log('\nAnswer Details:');
    
    let calculatedTotal = 0;
    answers.forEach((answer, index) => {
      console.log(`\n  Answer ${index + 1}:`);
      console.log(`    Question ID: ${answer.questionId}`);
      console.log(`    Student Answer: "${answer.studentAnswer}"`);
      console.log(`    Correct Answer: "${answer.question?.correctAnswer}"`);
      console.log(`    Is Correct: ${answer.isCorrect}`);
      console.log(`    Marks Obtained: ${answer.marksObtained}`);
      console.log(`    Question Marks: ${answer.question?.marks}`);
      
      calculatedTotal += parseFloat(answer.marksObtained || 0);
    });

    console.log(`\n=== SUMMARY ===`);
    console.log(`Calculated Total: ${calculatedTotal}`);
    console.log(`Stored Total: ${submission.obtainedMarks}`);
    console.log(`Match: ${calculatedTotal === parseFloat(submission.obtainedMarks || 0)}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSubmissionData();
