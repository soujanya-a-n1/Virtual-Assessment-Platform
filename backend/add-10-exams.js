const { Exam, Course, User } = require('./src/models');
const sequelize = require('./src/config/database');

const examsToAdd = [
  {
    title: 'C Programming Mid Exam',
    courseCode: 'CS101',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-10',
    description: 'Mid-semester exam covering C basics, loops, arrays, and functions.'
  },
  {
    title: 'OOP Internal Assessment',
    courseCode: 'CS102',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-12',
    description: 'Exam covering OOP concepts and Java fundamentals.'
  },
  {
    title: 'Data Structures Mid Exam',
    courseCode: 'CS201',
    totalMarks: 75,
    duration: 90,
    examDate: '2025-03-15',
    description: 'Exam on stacks, queues, linked lists, and trees.'
  },
  {
    title: 'DBMS Internal Test',
    courseCode: 'CS301',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-18',
    description: 'SQL queries, normalization, and ER diagrams.'
  },
  {
    title: 'Operating Systems Test',
    courseCode: 'CS302',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-20',
    description: 'Process scheduling and memory management concepts.'
  },
  {
    title: 'Digital Electronics Exam',
    courseCode: 'EC101',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-22',
    description: 'Logic gates, flip-flops, and number systems.'
  },
  {
    title: 'Microprocessors Test',
    courseCode: 'EC201',
    totalMarks: 75,
    duration: 90,
    examDate: '2025-03-25',
    description: 'Microprocessor architecture and programming.'
  },
  {
    title: 'Engineering Mechanics Exam',
    courseCode: 'ME101',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-27',
    description: 'Force systems and equilibrium problems.'
  },
  {
    title: 'Structural Analysis Test',
    courseCode: 'CIV101',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-03-29',
    description: 'Beam analysis and structural calculations.'
  },
  {
    title: 'Principles of Management Exam',
    courseCode: 'MBA101',
    totalMarks: 50,
    duration: 60,
    examDate: '2025-04-02',
    description: 'Management theories and organizational behavior.'
  }
];

async function add10Exams() {
  try {
    console.log('🔍 Creating 10 scheduled exams...\n');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get the first active user to use as createdBy
    const adminUser = await User.findOne({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    if (!adminUser) {
      console.log('❌ No active user found in database!');
      console.log('   Please create a user first.\n');
      return;
    }

    console.log(`✅ Using user: ${adminUser.firstName} ${adminUser.lastName} (ID: ${adminUser.id})\n`);

    let examsAdded = 0;
    let examsSkipped = 0;
    let coursesMissing = 0;

    for (const examData of examsToAdd) {
      // Check if exam already exists
      const existingExam = await Exam.findOne({
        where: { title: examData.title }
      });

      if (existingExam) {
        console.log(`⏭️  Exam "${examData.title}" already exists - skipping`);
        examsSkipped++;
        continue;
      }

      // Find course by code
      const course = await Course.findOne({
        where: { code: examData.courseCode }
      });

      if (!course) {
        console.log(`❌ Course ${examData.courseCode} not found for exam "${examData.title}"`);
        console.log(`   Please create course first\n`);
        coursesMissing++;
        continue;
      }

      // Create start and end times
      const startTime = new Date(`${examData.examDate}T09:00:00`);
      const endTime = new Date(startTime.getTime() + examData.duration * 60000);

      // Create the exam
      const newExam = await Exam.create({
        title: examData.title,
        description: examData.description,
        duration: examData.duration,
        totalQuestions: examData.totalMarks === 75 ? 15 : 10,
        totalMarks: examData.totalMarks,
        passingMarks: examData.totalMarks * 0.4, // 40% passing
        examType: 'Online',
        status: 'Published',
        startTime: startTime,
        endTime: endTime,
        requiresProctoring: true,
        shuffleQuestions: false,
        negativeMarkingEnabled: false,
        courseId: course.id,
        createdBy: adminUser.id
      });

      console.log(`✅ Created exam: ${examData.title}`);
      console.log(`   Course: ${course.code} - ${course.name}`);
      console.log(`   Date: ${examData.examDate} at 09:00 AM`);
      console.log(`   Duration: ${examData.duration} minutes`);
      console.log(`   Marks: ${examData.totalMarks} (Passing: ${examData.totalMarks * 0.4})`);
      console.log(`   Status: Published\n`);
      examsAdded++;
    }

    console.log('\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Exams created: ${examsAdded}`);
    console.log(`⏭️  Exams already exist: ${examsSkipped}`);
    console.log(`❌ Courses missing: ${coursesMissing}`);
    console.log(`📝 Total exams checked: ${examsToAdd.length}`);
    console.log('='.repeat(70) + '\n');

    if (coursesMissing > 0) {
      console.log('⚠️  WARNING: Some courses are missing!');
      console.log('   Run this command first: node add-missing-courses.js\n');
    }

    // Display all exams with Published status
    console.log('📋 All Published Exams:');
    console.log('='.repeat(70));
    const publishedExams = await Exam.findAll({
      where: { status: 'Published' },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['code', 'name']
      }],
      order: [['startTime', 'ASC']]
    });

    publishedExams.forEach(exam => {
      const courseInfo = exam.course 
        ? `${exam.course.code}` 
        : 'No Course';
      const examDate = exam.startTime 
        ? new Date(exam.startTime).toLocaleDateString('en-GB')
        : 'No Date';
      console.log(`${examDate} | ${exam.title.padEnd(35)} | ${courseInfo.padEnd(8)} | ${exam.totalMarks}m`);
    });
    console.log('='.repeat(70) + '\n');

    if (examsAdded > 0) {
      console.log('✅ SUCCESS! Exams have been created with Published status.');
      console.log('🌐 Open Exam Management in your browser to see them.');
      console.log('🔄 You may need to refresh the page.\n');
    } else if (examsSkipped === examsToAdd.length) {
      console.log('✅ All exams already exist. No action needed.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await sequelize.close();
    console.log('👋 Database connection closed');
  }
}

// Run the script
add10Exams();
