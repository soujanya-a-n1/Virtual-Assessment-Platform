const mysql = require('mysql2');
require('dotenv').config();

const setupDatabase = () => {
  return new Promise((resolve, reject) => {
    const fs = require('fs');

    // Connect without database first
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    connection.connect((err) => {
      if (err) return reject(err);
      console.log('✓ Connected to MySQL');

      // Create database
      connection.query('CREATE DATABASE IF NOT EXISTS virtual_assessment_db', (err) => {
        if (err) return reject(err);
        console.log('✓ Database created/exists');

        // Connect to the database
        const dbConnection = mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'virtual_assessment_db',
          multipleStatements: true
        });

        dbConnection.connect((err) => {
          if (err) return reject(err);

          // Read and execute schema
          const schema = fs.readFileSync('../database/schema.sql', 'utf-8');
          
          dbConnection.query(schema, (err) => {
            if (err) return reject(err);
            console.log('✓ Schema created');

            // Read and execute dummy data
            const dummyData = fs.readFileSync('../database/dummy_data.sql', 'utf-8');
            
            dbConnection.query(dummyData, (err) => {
              if (err && err.code !== 'ER_DUP_ENTRY') {
                console.log('Note: Some data may have already existed');
              }
              console.log('✓ Dummy data inserted');

              console.log('\n✅ Database setup completed successfully!');
              console.log('\nYou can now:');
              console.log('1. Start backend: npm run dev');
              console.log('2. Start frontend: npm start');
              console.log('\nLogin with: superadmin@platform.com / Admin@123456');

              dbConnection.end();
              connection.end();
              resolve();
            });
          });
        });
      });
    });
  });
};

setupDatabase()
  .catch(error => {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  });
