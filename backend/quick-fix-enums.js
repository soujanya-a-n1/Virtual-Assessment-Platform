const { sequelize } = require('./src/models');

async function quickFix() {
  try {
    console.log('Fixing database enums...\n');

    // Fix questionType enum
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN questionType ENUM('Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Matching') 
      NOT NULL
    `);
    console.log('✓ questionType fixed');

    // Fix difficulty enum
    await sequelize.query(`
      ALTER TABLE questions 
      MODIFY COLUMN difficulty ENUM('Easy', 'Medium', 'Hard') 
      DEFAULT 'Medium'
    `);
    console.log('✓ difficulty fixed');

    console.log('\nDone! Restart your backend server now.');
    process.exit(0);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

quickFix();
