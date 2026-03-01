const sequelize = require('./src/config/database');
const { Question, Course } = require('./src/models');

async function addSampleQuestions() {
  try {
    console.log('📚 Adding sample questions...\n');
    
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Get a course to link questions to
    const courses = await Course.findAll({ limit: 5 });
    
    if (courses.length === 0) {
      console.log('⚠ No courses found. Creating questions without course link.');
    } else {
      console.log(`Found ${courses.length} courses:`);
      courses.forEach(c => console.log(`  - ${c.code}: ${c.name}`));
      console.log('');
    }

    const sampleQuestions = [
      {
        questionText: 'What is the time complexity of binary search?',
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Medium',
        topic: 'Algorithms',
        courseId: courses[0]?.id || null,
        optionA: 'O(n)',
        optionB: 'O(log n)',
        optionC: 'O(n²)',
        optionD: 'O(1)',
        correctAnswer: 'B',
        explanation: 'Binary search divides the search space in half with each iteration, resulting in O(log n) complexity.'
      },
      {
        questionText: 'Which data structure uses LIFO (Last In First Out) principle?',
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Easy',
        topic: 'Data Structures',
        courseId: courses[0]?.id || null,
        optionA: 'Queue',
        optionB: 'Stack',
        optionC: 'Array',
        optionD: 'Linked List',
        correctAnswer: 'B',
        explanation: 'Stack follows LIFO principle where the last element added is the first one to be removed.'
      },
      {
        questionText: 'What is the purpose of a constructor in object-oriented programming?',
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Medium',
        topic: 'OOP',
        courseId: courses[1]?.id || courses[0]?.id || null,
        optionA: 'To destroy objects',
        optionB: 'To initialize objects',
        optionC: 'To copy objects',
        optionD: 'To compare objects',
        correctAnswer: 'B',
        explanation: 'A constructor is a special method used to initialize objects when they are created.'
      },
      {
        questionText: 'In a binary tree, what is the maximum number of nodes at level L?',
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Hard',
        topic: 'Trees',
        courseId: courses[0]?.id || null,
        optionA: '2^L',
        optionB: 'L^2',
        optionC: '2L',
        optionD: 'L!',
        correctAnswer: 'A',
        explanation: 'At each level L, a binary tree can have at most 2^L nodes.'
      },
      {
        questionText: 'Which sorting algorithm has the best average-case time complexity?',
        questionType: 'Multiple Choice',
        marks: 5,
        difficulty: 'Medium',
        topic: 'Sorting',
        courseId: courses[0]?.id || null,
        optionA: 'Bubble Sort',
        optionB: 'Selection Sort',
        optionC: 'Quick Sort',
        optionD: 'Insertion Sort',
        correctAnswer: 'C',
        explanation: 'Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting.'
      }
    ];

    console.log(`Creating ${sampleQuestions.length} sample questions...\n`);
    
    for (let i = 0; i < sampleQuestions.length; i++) {
      const q = sampleQuestions[i];
      const created = await Question.create(q);
      console.log(`✓ Question ${i + 1}: ${q.questionText.substring(0, 50)}... (ID: ${created.id})`);
    }

    console.log('\n✅ Sample questions added successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Refresh your browser');
    console.log('   3. Go to Exam Management > Questions to see them');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

addSampleQuestions();
