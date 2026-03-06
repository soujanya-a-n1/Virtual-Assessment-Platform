const { ExamSubmission, StudentAnswer, Exam } = require('./src/models');

async function fixSubmissionScores() {
  try {
    console.log('=== FIXING SUBMISSION SCORES ===\n');

    // Get all submissions
    const submissions = await ExamSubmission.findAll({
      where: {
        status: ['Submitted', 'Evaluated']
      }
    });

    console.log(`Found ${submissions.length} submissions to check\n`);

    for (const submission of submissions) {
      console.log(`\nProcessing Submission ID: ${submission.id}`);
      
      // Get all student answers for this submission
      const answers = await StudentAnswer.findAll({
        where: { submissionId: submission.id }
      });

      // Calculate total marks from student answers
      let calculatedTotal = 0;
      answers.forEach(answer => {
        const marks = parseFloat(answer.marksObtained || 0);
        calculatedTotal += marks;
      });

      console.log(`  Current stored marks: ${submission.obtainedMarks}`);
      console.log(`  Calculated marks: ${calculatedTotal}`);

      // Get exam details
      const exam = await Exam.findByPk(submission.examId);
      const isPassed = calculatedTotal >= exam.passingMarks;

      // Update if different
      if (parseFloat(submission.obtainedMarks || 0) !== calculatedTotal) {
        await submission.update({
          obtainedMarks: calculatedTotal,
          isPassed: isPassed,
          status: 'Evaluated'
        });
        console.log(`  ✅ FIXED: Updated to ${calculatedTotal} marks, isPassed: ${isPassed}`);
      } else {
        console.log(`  ✓ OK: Marks are correct`);
      }
    }

    console.log('\n=== FIX COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixSubmissionScores();
