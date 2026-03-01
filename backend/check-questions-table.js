const sequelize = require('./src/config/database');
const { Question } = require('./src/models');

async function checkQuestionsTable() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    console.log('\nChecking questions table...');
    
    // Try to describe the table
    const [results] = await sequelize.query('DESCRIBE questions');
    console.log('✓ Questions table exists with columns:');
    results.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Count questions
    const count = await Question.count();
    console.log(`\n✓ Total questions in database: ${count}`);

    // Try to fetch questions
    const questions = await Question.findAll({ limit: 3 });
    console.log(`\n✓ Sample questions fetched: ${questions.length}`);
    
    if (questions.length > 0) {
      console.log('\nFirst question:');
      console.log(JSON.stringify(questions[0].toJSON(), null, 2));
    }

    console.log('\n✓ All checks passed! Questions API should work.');
    
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes("doesn't exist")) {
      console.log('\n⚠ SOLUTION: Run this command to create tables:');
      console.log('   node src/models/sync.js');
    }
  } finally {
    await sequelize.close();
  }
}

checkQuestionsTable();
