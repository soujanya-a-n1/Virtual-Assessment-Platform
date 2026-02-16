const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTopicField() {
  console.log('🔧 Adding Topic/Category field to Questions...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Check if topic column already exists
    console.log('Step 1: Checking questions table structure...');
    const [columns] = await connection.query('DESCRIBE questions');
    
    const hasTopic = columns.some(col => col.Field === 'topic');
    
    if (hasTopic) {
      console.log('✅ Topic column already exists\n');
    } else {
      console.log('⚠️  Topic column not found, adding it...');
      
      await connection.query(`
        ALTER TABLE questions 
        ADD COLUMN topic VARCHAR(100) AFTER difficulty
      `);
      
      console.log('✅ Topic column added successfully\n');
    }

    // Add some sample topics to existing questions
    console.log('Step 2: Adding sample topics to existing questions...');
    
    const [questions] = await connection.query('SELECT id, questionText FROM questions');
    
    if (questions.length > 0) {
      console.log(`Found ${questions.length} questions\n`);
      
      // Sample topics based on question content
      const topics = [
        'Mathematics',
        'Geography',
        'Programming',
        'Web Development',
        'Science',
        'General Knowledge',
        'Computer Science',
        'History',
        'English',
        'Physics'
      ];
      
      for (const question of questions) {
        // Assign topic based on question content
        let topic = 'General Knowledge';
        
        const text = question.questionText.toLowerCase();
        if (text.includes('capital') || text.includes('country')) {
          topic = 'Geography';
        } else if (text.includes('javascript') || text.includes('programming') || text.includes('code')) {
          topic = 'Programming';
        } else if (text.includes('html') || text.includes('css') || text.includes('web')) {
          topic = 'Web Development';
        } else if (text.includes('math') || text.includes('+') || text.includes('calculate')) {
          topic = 'Mathematics';
        } else if (text.includes('planet') || text.includes('earth') || text.includes('science')) {
          topic = 'Science';
        }
        
        await connection.query(
          'UPDATE questions SET topic = ? WHERE id = ?',
          [topic, question.id]
        );
      }
      
      console.log('✅ Topics assigned to existing questions\n');
    }

    // Show summary
    console.log('Step 3: Summary of topics...');
    const [topicSummary] = await connection.query(`
      SELECT topic, COUNT(*) as count 
      FROM questions 
      WHERE topic IS NOT NULL
      GROUP BY topic 
      ORDER BY count DESC
    `);
    
    if (topicSummary.length > 0) {
      console.log('\nQuestions by Topic:');
      topicSummary.forEach(row => {
        console.log(`   ${row.topic}: ${row.count} questions`);
      });
      console.log('');
    }

    await connection.end();

    console.log('═══════════════════════════════════════');
    console.log('✅ TOPIC FIELD ADDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════\n');
    
    console.log('📝 Available Topics:');
    console.log('   • Mathematics');
    console.log('   • Geography');
    console.log('   • Programming');
    console.log('   • Web Development');
    console.log('   • Science');
    console.log('   • Computer Science');
    console.log('   • General Knowledge');
    console.log('   • History');
    console.log('   • English');
    console.log('   • Physics\n');
    
    console.log('🚀 Next steps:');
    console.log('1. Restart backend server');
    console.log('2. Go to Question Bank');
    console.log('3. Create questions with topics');
    console.log('4. Filter questions by topic\n');

  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

addTopicField();
