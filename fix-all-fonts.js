const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'frontend/src/pages/Auth.css',
  'frontend/src/styles/Auth.css',
  'frontend/src/components/Sidebar.css',
  'frontend/src/pages/ExamPage.css',
  'frontend/src/pages/ExamsList.css',
  'frontend/src/pages/UsersList.css',
  'frontend/src/styles/ListPages.css'
];

// Pattern to find and replace
const gradientPattern = /background:\s*linear-gradient\([^)]+\);\s*-webkit-background-clip:\s*text;\s*-webkit-text-fill-color:\s*transparent;\s*background-clip:\s*text;/g;

const replacement = 'color: #ff8c00;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);';

console.log('🔧 Fixing font visibility across all modules...\n');

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace gradient text with solid color
      content = content.replace(gradientPattern, replacement);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
      } else {
        console.log(`⏭️  Skipped: ${filePath} (no changes needed)`);
      }
    } else {
      console.log(`⚠️  Not found: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\n✅ Font visibility fix complete!');
console.log('All gradient text has been replaced with solid orange color.\n');
