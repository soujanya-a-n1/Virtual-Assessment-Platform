const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDatabaseColumns() {
  console.log('🔧 Checking and fixing database column names...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log('✅ Connected to database\n');

    // Check current table structure
    console.log('📋 Checking current users table structure...');
    const [columns] = await connection.query('DESCRIBE users');
    
    console.log('\nCurrent columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });

    // Check if columns are in snake_case
    const hasSnakeCase = columns.some(col => 
      col.Field === 'first_name' || col.Field === 'last_name'
    );

    if (hasSnakeCase) {
      console.log('\n⚠️  Found snake_case columns. Converting to camelCase...\n');

      // Rename columns to camelCase
      const renameQueries = [
        'ALTER TABLE users CHANGE COLUMN first_name firstName VARCHAR(100) NOT NULL',
        'ALTER TABLE users CHANGE COLUMN last_name lastName VARCHAR(100) NOT NULL',
        'ALTER TABLE users CHANGE COLUMN is_active isActive BOOLEAN DEFAULT TRUE',
        'ALTER TABLE users CHANGE COLUMN last_login lastLogin DATETIME',
        'ALTER TABLE users CHANGE COLUMN created_at createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        'ALTER TABLE users CHANGE COLUMN updated_at updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
      ];

      for (const query of renameQueries) {
        try {
          await connection.query(query);
          const columnName = query.match(/CHANGE COLUMN (\w+)/)[1];
          const newName = query.match(/CHANGE COLUMN \w+ (\w+)/)[1];
          console.log(`   ✅ Renamed ${columnName} → ${newName}`);
        } catch (error) {
          if (error.code === 'ER_BAD_FIELD_ERROR') {
            // Column doesn't exist, skip
            continue;
          }
          throw error;
        }
      }

      console.log('\n✅ Column names updated successfully!\n');
    } else {
      console.log('\n✅ Columns are already in camelCase format!\n');
    }

    // Show final structure
    console.log('📋 Final users table structure:');
    const [finalColumns] = await connection.query('DESCRIBE users');
    finalColumns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });

    await connection.end();

    console.log('\n✅ Database fix completed!');
    console.log('\n🚀 Now restart your backend server:');
    console.log('   1. Stop the server (Ctrl+C)');
    console.log('   2. Run: npm run dev');
    console.log('   3. Try logging in again\n');

  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n📝 MySQL is not running. Start MySQL first!');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n📝 Check your database credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n📝 Database does not exist. Run: node setup-db.js');
    }
    console.error('');
  }
}

fixDatabaseColumns();
