const sequelize = require('./src/config/database');
const { Course, Department } = require('./src/models/index');

const courses = [
  {
    code: 'CS101',
    name: 'Programming in C',
    departmentCode: 'CSE',
    credits: 4,
    description: 'Basics of C programming and problem solving.',
    isActive: true
  },
  {
    code: 'CS102',
    name: 'Object Oriented Programming',
    departmentCode: 'CSE',
    credits: 4,
    description: 'OOP concepts using Java.',
    isActive: true
  },
  {
    code: 'CS201',
    name: 'Data Structures',
    departmentCode: 'CSE',
    credits: 4,
    description: 'Stacks, queues, linked lists, trees, and graphs.',
    isActive: true
  },
  {
    code: 'CS301',
    name: 'Database Management Systems',
    departmentCode: 'CSE',
    credits: 4,
    description: 'SQL, normalization, and database design.',
    isActive: true
  },
  {
    code: 'CS302',
    name: 'Operating Systems',
    departmentCode: 'CSE',
    credits: 3,
    description: 'Process management and memory management concepts.',
    isActive: true
  },
  {
    code: 'EC101',
    name: 'Digital Electronics',
    departmentCode: 'ECE',
    credits: 3,
    description: 'Logic gates and digital circuits.',
    isActive: true
  },
  {
    code: 'EC201',
    name: 'Microprocessors',
    departmentCode: 'ECE',
    credits: 3,
    description: 'Architecture and programming of microprocessors.',
    isActive: true
  },
  {
    code: 'ME101',
    name: 'Engineering Mechanics',
    departmentCode: 'MECH',
    credits: 3,
    description: 'Fundamentals of forces and equilibrium.',
    isActive: true
  },
  {
    code: 'CIV101',
    name: 'Structural Analysis',
    departmentCode: 'CIVIL',
    credits: 3,
    description: 'Analysis of beams and structures.',
    isActive: true
  },
  {
    code: 'MBA101',
    name: 'Principles of Management',
    departmentCode: 'MBA',
    credits: 3,
    description: 'Basics of management and organizational behavior.',
    isActive: true
  }
];

async function addCourses() {
  try {
    console.log('========================================');
    console.log('Course Setup Script');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    console.log('Syncing models...');
    await Department.sync();
    await Course.sync();
    console.log('✓ Models synced\n');

    // Get all departments first
    const departments = await Department.findAll();
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.code] = dept.id;
    });

    console.log('Found departments:');
    departments.forEach(dept => {
      console.log(`  ${dept.code} (ID: ${dept.id}) - ${dept.name}`);
    });
    console.log('');

    console.log('Adding courses...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const course of courses) {
      try {
        const departmentId = deptMap[course.departmentCode];
        
        if (!departmentId) {
          console.error(`✗ Error: Department ${course.departmentCode} not found for course ${course.code}`);
          errorCount++;
          continue;
        }

        const courseData = {
          code: course.code,
          name: course.name,
          description: course.description,
          credits: course.credits,
          departmentId: departmentId,
          isActive: course.isActive
        };

        const [courseRecord, created] = await Course.findOrCreate({
          where: { code: course.code },
          defaults: courseData
        });

        if (created) {
          console.log(`✓ Created: ${course.code.padEnd(8)} | ${course.name.padEnd(35)} | ${course.departmentCode} | ${course.credits} credits`);
          successCount++;
        } else {
          await courseRecord.update(courseData);
          console.log(`✓ Updated: ${course.code.padEnd(8)} | ${course.name.padEnd(35)} | ${course.departmentCode} | ${course.credits} credits`);
          successCount++;
        }
      } catch (error) {
        console.error(`✗ Error with ${course.code}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log(`Course Setup Complete!`);
    console.log(`Success: ${successCount} | Errors: ${errorCount}`);
    console.log('========================================\n');

    // Display all courses grouped by department
    const allCourses = await Course.findAll({
      include: [{
        model: Department,
        as: 'department'
      }],
      order: [['code', 'ASC']]
    });

    console.log('Courses in Database:');
    console.log('--------------------');
    
    let currentDept = null;
    allCourses.forEach(course => {
      const deptName = course.department ? course.department.name : 'No Department';
      if (currentDept !== deptName) {
        console.log(`\n${deptName}:`);
        currentDept = deptName;
      }
      console.log(`  ${course.code.padEnd(8)} | ${course.name.padEnd(40)} | ${course.credits} credits | Active: ${course.isActive}`);
    });
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

addCourses();
