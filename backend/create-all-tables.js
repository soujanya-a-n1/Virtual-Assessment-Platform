const sequelize = require('./src/config/database');
const models = require('./src/models');

async function createAllTables() {
  try {
    console.log('🔄 Connecting to database...\n');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    console.log('🔄 Creating/updating all tables...\n');
    
    // Force sync will drop existing tables and recreate them
    // Use { alter: true } instead if you want to keep existing data
    await sequelize.sync({ alter: true });
    
    console.log('✅ All tables created/updated successfully!\n');
    
    console.log('📋 Tables created:');
    const tables = [
      'users',
      'roles', 
      'user_roles',
      'departments',
      'courses',
      'classes',
      'lecturers',
      'students',
      'course_lecturers',
      'questions',
      'exams',
      'exam_questions',
      'exam_submissions',
      'student_answers',
      'proctoring_logs',
      'student_exam_enrollments'
    ];
    
    tables.forEach(table => console.log(`  ✅ ${table}`));
    
    console.log('\n🎉 Database setup complete!');
    console.log('\nYou can now:');
    console.log('1. Restart your backend server');
    console.log('2. Login to the application');
    console.log('3. Create exams and add questions');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAllTables();
