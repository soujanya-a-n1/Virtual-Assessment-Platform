const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
  console.log('🔧 Virtual Assessment Platform - Database Setup\n');
  console.log('This script will help you set up the database.\n');

  try {
    // Get MySQL credentials
    const host = await question('MySQL Host (default: localhost): ') || 'localhost';
    const user = await question('MySQL User (default: root): ') || 'root';
    const password = await question('MySQL Password (press Enter if none): ');
    const dbName = await question('Database Name (default: virtual_assessment_db): ') || 'virtual_assessment_db';

    console.log('\n🔌 Connecting to MySQL...');

    // Connect to MySQL (without database)
    const connection = await mysql.createConnection({
      host,
      user,
      password: password || undefined,
    });

    console.log('✅ Connected to MySQL');

    // Create database
    console.log(`\n📦 Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created/verified`);

    // Close connection
    await connection.end();

    // Update .env file
    console.log('\n📝 Updating .env file...');
    const fs = require('fs');
    const envPath = require('path').join(__dirname, '.env');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add database configuration
    const dbConfig = `
# Database Configuration
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${dbName}
DB_PORT=3306
`;

    // Replace existing DB config or append
    if (envContent.includes('DB_HOST=')) {
      envContent = envContent.replace(
        /# Database Configuration[\s\S]*?DB_PORT=\d+/,
        dbConfig.trim()
      );
    } else {
      envContent += '\n' + dbConfig;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated');

    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the backend: npm start');
    console.log('2. Add sample questions: node add-sample-questions-with-topics.js');
    console.log('3. Open frontend: http://localhost:3000');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nPlease check:');
    console.error('- MySQL is running');
    console.error('- Credentials are correct');
    console.error('- User has permission to create databases');
  } finally {
    rl.close();
  }
}

setupDatabase();
