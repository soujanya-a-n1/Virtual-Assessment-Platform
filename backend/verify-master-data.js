const sequelize = require('./src/config/database');
const { Department, Course, Role } = require('./src/models/index');

async function verifyMasterData() {
  try {
    console.log('========================================');
    console.log('Master Data Verification');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    // Check Roles
    console.log('Checking Roles...');
    console.log('-----------------');
    const roles = await Role.findAll({ order: [['id', 'ASC']] });
    
    if (roles.length === 0) {
      console.log('⚠️  No roles found in database');
    } else {
      console.log(`✓ Found ${roles.length} roles:`);
      roles.forEach(role => {
        console.log(`  ${role.id}. ${role.name.padEnd(15)} - ${role.description}`);
      });
    }
    console.log('');

    // Check Departments
    console.log('Checking Departments...');
    console.log('------------------------');
    const departments = await Department.findAll({ order: [['code', 'ASC']] });
    
    if (departments.length === 0) {
      console.log('⚠️  No departments found in database');
      console.log('   Run: node add-departments.js');
    } else {
      console.log(`✓ Found ${departments.length} departments:`);
      departments.forEach(dept => {
        const status = dept.isActive ? '✓ Active' : '✗ Inactive';
        console.log(`  ${dept.code.padEnd(8)} | ${dept.name.padEnd(45)} | ${status}`);
      });
    }
    console.log('');

    // Check Courses
    console.log('Checking Courses...');
    console.log('-------------------');
    const courses = await Course.findAll({ 
      include: [{ model: Department, as: 'department' }],
      order: [['code', 'ASC']] 
    });
    
    if (courses.length === 0) {
      console.log('⚠️  No courses found in database');
      console.log('   Run: node add-courses.js');
    } else {
      console.log(`✓ Found ${courses.length} courses:\n`);
      
      // Group by department
      const coursesByDept = {};
      courses.forEach(course => {
        const deptName = course.department ? course.department.name : 'No Department';
        if (!coursesByDept[deptName]) {
          coursesByDept[deptName] = [];
        }
        coursesByDept[deptName].push(course);
      });

      Object.keys(coursesByDept).sort().forEach(deptName => {
        console.log(`${deptName}:`);
        coursesByDept[deptName].forEach(course => {
          const status = course.isActive ? '✓' : '✗';
          console.log(`  ${status} ${course.code.padEnd(8)} | ${course.name.padEnd(40)} | ${course.credits} credits`);
        });
        console.log('');
      });
    }

    // Summary
    console.log('========================================');
    console.log('Summary');
    console.log('========================================');
    console.log(`Roles:       ${roles.length}/5 expected`);
    console.log(`Departments: ${departments.length}/5 expected`);
    console.log(`Courses:     ${courses.length}/10 expected`);
    console.log('');

    // Recommendations
    if (departments.length < 5) {
      console.log('⚠️  Missing departments. Run: node add-departments.js');
    }
    if (courses.length < 10) {
      console.log('⚠️  Missing courses. Run: node add-courses.js');
    }
    if (departments.length >= 5 && courses.length >= 10) {
      console.log('✅ All master data is complete!');
    }
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

verifyMasterData();
