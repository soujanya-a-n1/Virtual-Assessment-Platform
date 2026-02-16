const bcrypt = require('bcryptjs');

async function generatePassword() {
  const password = 'Admin@123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('\n=================================');
  console.log('Password Hash Generator');
  console.log('=================================\n');
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}\n`);
  console.log('Copy this hash to use in dummy_data.sql');
  console.log('=================================\n');
}

generatePassword();
