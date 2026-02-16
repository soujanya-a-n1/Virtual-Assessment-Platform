const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSampleQuestions() {
  console.log('📚 Adding Sample Questions by Topic...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Sample questions organized by topic
    const sampleQuestions = [
      // Mathematics
      {
        questionText: 'What is 15 × 8?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Mathematics',
        optionA: '110',
        optionB: '120',
        optionC: '130',
        optionD: '140',
        correctAnswer: 'B',
        explanation: '15 multiplied by 8 equals 120'
      },
      {
        questionText: 'What is the square root of 169?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Mathematics',
        optionA: '11',
        optionB: '12',
        optionC: '13',
        optionD: '14',
        correctAnswer: 'C',
        explanation: '13 × 13 = 169'
      },
      {
        questionText: 'What is 25% of 200?',
        questionType: 'Multiple Choice',
        marks: 2,
        difficulty: 'Medium',
        topic: 'Mathematics',
        optionA: '40',
        optionB: '50',
        optionC: '60',
        optionD: '70',
        correctAnswer: 'B',
        explanation: '25% of 200 = (25/100) × 200 = 50'
      },

      // Programming
      {
        questionText: 'Which programming language is known as the "language of the web"?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Programming',
        optionA: 'Python',
        optionB: 'Java',
        optionC: 'JavaScript',
        optionD: 'C++',
        correctAnswer: 'C',
        explanation: 'JavaScript is the primary language for web development'
      },
      {
        questionText: 'What does API stand for?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Programming',
        optionA: 'Application Programming Interface',
        optionB: 'Advanced Programming Integration',
        optionC: 'Automated Program Interaction',
        optionD: 'Application Process Integration',
        correctAnswer: 'A',
        explanation: 'API stands for Application Programming Interface'
      },
      {
        questionText: 'Python is an interpreted language',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Programming',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'A',
        explanation: 'Python is indeed an interpreted language'
      },

      // Web Development
      {
        questionText: 'What does CSS stand for?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Web Development',
        optionA: 'Computer Style Sheets',
        optionB: 'Cascading Style Sheets',
        optionC: 'Creative Style Sheets',
        optionD: 'Colorful Style Sheets',
        correctAnswer: 'B',
        explanation: 'CSS stands for Cascading Style Sheets'
      },
      {
        questionText: 'Which HTML tag is used for creating a hyperlink?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Web Development',
        optionA: '<link>',
        optionB: '<a>',
        optionC: '<href>',
        optionD: '<url>',
        correctAnswer: 'B',
        explanation: 'The <a> tag is used to create hyperlinks in HTML'
      },
      {
        questionText: 'React is a JavaScript library',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Web Development',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'A',
        explanation: 'React is a JavaScript library for building user interfaces'
      },

      // Science
      {
        questionText: 'What is the chemical symbol for water?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Science',
        optionA: 'H2O',
        optionB: 'O2',
        optionC: 'CO2',
        optionD: 'H2',
        correctAnswer: 'A',
        explanation: 'Water is composed of two hydrogen atoms and one oxygen atom (H2O)'
      },
      {
        questionText: 'What is the speed of light in vacuum?',
        questionType: 'Multiple Choice',
        marks: 2,
        difficulty: 'Medium',
        topic: 'Science',
        optionA: '300,000 km/s',
        optionB: '150,000 km/s',
        optionC: '450,000 km/s',
        optionD: '600,000 km/s',
        correctAnswer: 'A',
        explanation: 'The speed of light in vacuum is approximately 300,000 km/s'
      },

      // Geography
      {
        questionText: 'What is the capital of Japan?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Geography',
        optionA: 'Beijing',
        optionB: 'Seoul',
        optionC: 'Tokyo',
        optionD: 'Bangkok',
        correctAnswer: 'C',
        explanation: 'Tokyo is the capital city of Japan'
      },
      {
        questionText: 'Which is the largest ocean on Earth?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Geography',
        optionA: 'Atlantic Ocean',
        optionB: 'Indian Ocean',
        optionC: 'Arctic Ocean',
        optionD: 'Pacific Ocean',
        correctAnswer: 'D',
        explanation: 'The Pacific Ocean is the largest ocean on Earth'
      },
      {
        questionText: 'Mount Everest is the tallest mountain in the world',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Geography',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'A',
        explanation: 'Mount Everest is the highest mountain above sea level'
      },

      // Computer Science
      {
        questionText: 'What does RAM stand for?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Computer Science',
        optionA: 'Random Access Memory',
        optionB: 'Read Access Memory',
        optionC: 'Rapid Access Memory',
        optionD: 'Remote Access Memory',
        correctAnswer: 'A',
        explanation: 'RAM stands for Random Access Memory'
      },
      {
        questionText: 'Which data structure uses LIFO (Last In First Out)?',
        questionType: 'Multiple Choice',
        marks: 2,
        difficulty: 'Medium',
        topic: 'Computer Science',
        optionA: 'Queue',
        optionB: 'Stack',
        optionC: 'Array',
        optionD: 'Tree',
        correctAnswer: 'B',
        explanation: 'Stack follows the LIFO principle'
      },

      // History
      {
        questionText: 'In which year did World War II end?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Medium',
        topic: 'History',
        optionA: '1943',
        optionB: '1944',
        optionC: '1945',
        optionD: '1946',
        correctAnswer: 'C',
        explanation: 'World War II ended in 1945'
      },
      {
        questionText: 'Who was the first President of the United States?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'History',
        optionA: 'Thomas Jefferson',
        optionB: 'George Washington',
        optionC: 'Abraham Lincoln',
        optionD: 'John Adams',
        correctAnswer: 'B',
        explanation: 'George Washington was the first U.S. President'
      },

      // English
      {
        questionText: 'What is the plural of "child"?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'English',
        optionA: 'Childs',
        optionB: 'Childes',
        optionC: 'Children',
        optionD: 'Childrens',
        correctAnswer: 'C',
        explanation: 'The plural of child is children'
      },
      {
        questionText: 'A noun is a person, place, or thing',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Easy',
        topic: 'English',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'A',
        explanation: 'A noun represents a person, place, thing, or idea'
      },

      // Physics
      {
        questionText: 'What is the SI unit of force?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Medium',
        topic: 'Physics',
        optionA: 'Joule',
        optionB: 'Newton',
        optionC: 'Watt',
        optionD: 'Pascal',
        correctAnswer: 'B',
        explanation: 'The SI unit of force is Newton (N)'
      },
      {
        questionText: 'Gravity accelerates objects at 9.8 m/s² on Earth',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Easy',
        topic: 'Physics',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'A',
        explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s²'
      },

      // General Knowledge
      {
        questionText: 'How many continents are there on Earth?',
        questionType: 'Multiple Choice',
        marks: 1,
        difficulty: 'Easy',
        topic: 'General Knowledge',
        optionA: '5',
        optionB: '6',
        optionC: '7',
        optionD: '8',
        correctAnswer: 'C',
        explanation: 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, and South America'
      },
      {
        questionText: 'The Great Wall of China is visible from space',
        questionType: 'True/False',
        marks: 1,
        difficulty: 'Medium',
        topic: 'General Knowledge',
        optionA: 'True',
        optionB: 'False',
        correctAnswer: 'B',
        explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye'
      }
    ];

    console.log(`Adding ${sampleQuestions.length} sample questions...\n`);

    let addedCount = 0;
    for (const question of sampleQuestions) {
      try {
        await connection.query(
          `INSERT INTO questions 
          (questionText, questionType, marks, difficulty, topic, optionA, optionB, optionC, optionD, correctAnswer, explanation) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.questionText,
            question.questionType,
            question.marks,
            question.difficulty,
            question.topic,
            question.optionA,
            question.optionB,
            question.optionC,
            question.optionD,
            question.correctAnswer,
            question.explanation
          ]
        );
        addedCount++;
        console.log(`✅ Added: ${question.topic} - ${question.questionText.substring(0, 50)}...`);
      } catch (err) {
        console.log(`⚠️  Skipped: ${question.questionText.substring(0, 50)}... (${err.message})`);
      }
    }

    console.log(`\n✅ Successfully added ${addedCount} questions!\n`);

    // Show summary by topic
    console.log('═══════════════════════════════════════');
    console.log('📊 QUESTIONS BY TOPIC');
    console.log('═══════════════════════════════════════\n');

    const [topicSummary] = await connection.query(`
      SELECT topic, COUNT(*) as count, 
             SUM(CASE WHEN difficulty = 'Easy' THEN 1 ELSE 0 END) as easy,
             SUM(CASE WHEN difficulty = 'Medium' THEN 1 ELSE 0 END) as medium,
             SUM(CASE WHEN difficulty = 'Hard' THEN 1 ELSE 0 END) as hard
      FROM questions 
      WHERE topic IS NOT NULL
      GROUP BY topic 
      ORDER BY count DESC
    `);

    topicSummary.forEach(row => {
      console.log(`📚 ${row.topic}: ${row.count} questions`);
      console.log(`   Easy: ${row.easy} | Medium: ${row.medium} | Hard: ${row.hard}`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log(`✅ Total Questions: ${topicSummary.reduce((sum, row) => sum + row.count, 0)}`);
    console.log('═══════════════════════════════════════\n');

    await connection.end();

    console.log('🚀 Next Steps:');
    console.log('1. Go to Question Bank page');
    console.log('2. Use topic filter to view questions by subject');
    console.log('3. Create exams using topic-specific questions');
    console.log('4. Add more questions as needed\n');

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

addSampleQuestions();
