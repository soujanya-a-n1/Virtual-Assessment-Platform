const { Question } = require('./src/models');
const sequelize = require('./src/config/database');

const sampleQuestions = [
  // Mathematics Questions
  {
    questionText: 'What is the value of π (pi) approximately?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Mathematics',
    optionA: '3.14159',
    optionB: '2.71828',
    optionC: '1.41421',
    optionD: '2.30258',
    correctAnswer: 'A',
    explanation: 'Pi (π) is approximately 3.14159, representing the ratio of a circle\'s circumference to its diameter.'
  },
  {
    questionText: 'What is the derivative of x² with respect to x?',
    questionType: 'Multiple Choice',
    marks: 2,
    difficulty: 'Medium',
    topic: 'Mathematics',
    optionA: 'x',
    optionB: '2x',
    optionC: 'x²',
    optionD: '2x²',
    correctAnswer: 'B',
    explanation: 'Using the power rule, d/dx(x²) = 2x¹ = 2x'
  },
  {
    questionText: 'Is the square root of 16 equal to 4?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Mathematics',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'A',
    explanation: '√16 = 4 because 4 × 4 = 16'
  },

  // Programming Questions
  {
    questionText: 'Which of the following is NOT a JavaScript data type?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Programming',
    optionA: 'String',
    optionB: 'Boolean',
    optionC: 'Float',
    optionD: 'Undefined',
    correctAnswer: 'C',
    explanation: 'JavaScript uses "Number" for all numeric types, not separate "Float" type.'
  },
  {
    questionText: 'What does SQL stand for?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Programming',
    optionA: 'Structured Query Language',
    optionB: 'Simple Question Language',
    optionC: 'Standard Query Logic',
    optionD: 'System Quality Language',
    correctAnswer: 'A',
    explanation: 'SQL stands for Structured Query Language, used for managing relational databases.'
  },
  {
    questionText: 'Is Python an interpreted language?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Programming',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'A',
    explanation: 'Python is an interpreted language, meaning code is executed line by line.'
  },

  // Web Development Questions
  {
    questionText: 'What does HTML stand for?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Web Development',
    optionA: 'Hyper Text Markup Language',
    optionB: 'High Tech Modern Language',
    optionC: 'Home Tool Markup Language',
    optionD: 'Hyperlinks and Text Markup Language',
    correctAnswer: 'A',
    explanation: 'HTML stands for Hyper Text Markup Language, the standard markup language for web pages.'
  },
  {
    questionText: 'Which CSS property is used to change text color?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Web Development',
    optionA: 'text-color',
    optionB: 'font-color',
    optionC: 'color',
    optionD: 'text-style',
    correctAnswer: 'C',
    explanation: 'The "color" property in CSS is used to set the color of text.'
  },
  {
    questionText: 'Is React a JavaScript framework?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Medium',
    topic: 'Web Development',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'B',
    explanation: 'React is technically a library, not a framework. It focuses on the view layer only.'
  },

  // Computer Science Questions
  {
    questionText: 'What is the time complexity of binary search?',
    questionType: 'Multiple Choice',
    marks: 2,
    difficulty: 'Medium',
    topic: 'Computer Science',
    optionA: 'O(n)',
    optionB: 'O(log n)',
    optionC: 'O(n²)',
    optionD: 'O(1)',
    correctAnswer: 'B',
    explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each iteration.'
  },
  {
    questionText: 'Which data structure uses LIFO (Last In First Out)?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Computer Science',
    optionA: 'Queue',
    optionB: 'Stack',
    optionC: 'Array',
    optionD: 'Tree',
    correctAnswer: 'B',
    explanation: 'Stack follows LIFO principle where the last element added is the first to be removed.'
  },

  // Science Questions
  {
    questionText: 'What is the chemical symbol for water?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Science',
    optionA: 'H2O',
    optionB: 'CO2',
    optionC: 'O2',
    optionD: 'H2',
    correctAnswer: 'A',
    explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.'
  },
  {
    questionText: 'Is the speed of light approximately 300,000 km/s?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Science',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'A',
    explanation: 'The speed of light in vacuum is approximately 299,792 km/s, commonly rounded to 300,000 km/s.'
  },

  // Geography Questions
  {
    questionText: 'What is the capital of France?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'Geography',
    optionA: 'London',
    optionB: 'Berlin',
    optionC: 'Paris',
    optionD: 'Madrid',
    correctAnswer: 'C',
    explanation: 'Paris is the capital and largest city of France.'
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
    explanation: 'The Pacific Ocean is the largest and deepest ocean, covering about 46% of Earth\'s water surface.'
  },

  // History Questions
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
    explanation: 'World War II ended in 1945 with Germany surrendering in May and Japan in September.'
  },

  // English Questions
  {
    questionText: 'What is a synonym for "happy"?',
    questionType: 'Multiple Choice',
    marks: 1,
    difficulty: 'Easy',
    topic: 'English',
    optionA: 'Sad',
    optionB: 'Joyful',
    optionC: 'Angry',
    optionD: 'Tired',
    correctAnswer: 'B',
    explanation: 'Joyful is a synonym for happy, both meaning feeling pleasure or contentment.'
  },
  {
    questionText: 'Is "their" a possessive pronoun?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Easy',
    topic: 'English',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'A',
    explanation: '"Their" is a possessive pronoun used to show ownership by multiple people.'
  },

  // General Knowledge Questions
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
    explanation: 'There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia, and South America.'
  },
  {
    questionText: 'Is the Great Wall of China visible from space?',
    questionType: 'True/False',
    marks: 1,
    difficulty: 'Medium',
    topic: 'General Knowledge',
    optionA: 'True',
    optionB: 'False',
    optionC: null,
    optionD: null,
    correctAnswer: 'B',
    explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye.'
  }
];

async function addSampleQuestions() {
  try {
    console.log('🔌 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    console.log('\n📝 Adding sample questions with topics...');
    
    for (const questionData of sampleQuestions) {
      const question = await Question.create(questionData);
      console.log(`✅ Added: [${question.topic}] ${question.questionText.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Successfully added ${sampleQuestions.length} questions!`);
    console.log('\n📊 Questions by topic:');
    
    const topics = {};
    sampleQuestions.forEach(q => {
      topics[q.topic] = (topics[q.topic] || 0) + 1;
    });
    
    Object.entries(topics).forEach(([topic, count]) => {
      console.log(`   ${topic}: ${count} questions`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSampleQuestions();
