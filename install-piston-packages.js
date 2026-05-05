const axios = require('axios');

const PISTON_URL = 'http://localhost:2000';

const packages = [
  { language: 'python', version: '3.10.0' },
  { language: 'gcc', version: '10.2.0' },
  { language: 'java', version: '15.0.2' },
  { language: 'node', version: '18.15.0' },
];

async function installPackages() {
  console.log('Installing Piston language packages...\n');
  
  for (const pkg of packages) {
    try {
      console.log(`Installing ${pkg.language} ${pkg.version}...`);
      const response = await axios.post(`${PISTON_URL}/api/v2/packages`, pkg);
      console.log(`✓ ${pkg.language} installed successfully`);
    } catch (error) {
      console.error(`✗ Failed to install ${pkg.language}:`, error.response?.data || error.message);
    }
  }
  
  console.log('\nChecking installed runtimes...');
  try {
    const response = await axios.get(`${PISTON_URL}/api/v2/runtimes`);
    console.log(`\nInstalled runtimes: ${response.data.length}`);
    response.data.forEach(runtime => {
      console.log(`  - ${runtime.language} ${runtime.version}`);
    });
  } catch (error) {
    console.error('Failed to fetch runtimes:', error.message);
  }
}

installPackages();
