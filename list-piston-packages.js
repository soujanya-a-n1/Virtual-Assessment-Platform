const axios = require('axios');

async function listPackages() {
  try {
    const response = await axios.get('http://localhost:2000/api/v2/packages');
    const packages = response.data;
    
    // Group by language
    const byLang = {};
    packages.forEach(pkg => {
      if (!byLang[pkg.language]) {
        byLang[pkg.language] = [];
      }
      byLang[pkg.language].push({
        version: pkg.language_version,
        installed: pkg.installed
      });
    });
    
    // Show C-related languages
    console.log('C/C++ related packages:');
    ['c', 'cpp', 'gcc', 'g++', 'clang', 'clang++'].forEach(lang => {
      if (byLang[lang]) {
        console.log(`\n${lang}:`);
        byLang[lang].forEach(v => {
          console.log(`  ${v.version} ${v.installed ? '(installed)' : ''}`);
        });
      }
    });
    
    console.log('\n\nJavaScript related:');
    ['javascript', 'js', 'node', 'nodejs'].forEach(lang => {
      if (byLang[lang]) {
        console.log(`\n${lang}:`);
        byLang[lang].forEach(v => {
          console.log(`  ${v.version} ${v.installed ? '(installed)' : ''}`);
        });
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listPackages();
