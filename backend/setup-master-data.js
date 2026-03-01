const sequelize = require('./src/config/database');
const { Department, Course, Role } = require('./src/models/index');

// Master data definitions
const departments = [
  {
    code: 'CSE',
    name: 'Computer Science and Engineering',
    description: 'Department handling programming, software development, and AI courses.',
    isActive: true
  },
  {
    code: 'ECE',
    name: 'Electronics and Communication Engineering',
    description: 'Department focused on electronics, communication systems, and embedded systems.',
    isActive: true
  },
  {
    code: 'MECH',
    name: 'Mechanical Engineering',
    description: 'Department covering manufacturing, thermal, and design engineering.',
    isActive: true
  },
  {
    code: 'CIVIL',
    name: 'Civil Engineering',
    description: 'Department specializing in construction, structural, and environmental engineering.',
    isActive: true
  },
  {
    code: 'MBA',
    name: 'Master of Business Administration',
    description: 'Department managing business, finance, and management studies.',
    isActive: true
  }
];

const roles = [
  { id: 1, name: 'Super Admin', description: 'Full system access' },
  { id: 2, name: 'Admin', description: 'Administrative access' },
  { id: 3, name: 'Examiner', description: 'Can create and manage exams' },
  { id: 4, name: 'Proctor', description: 'Can monitor exams' },
  { id: 5, name: 'Student', description: 'Can take exams' }
];

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

async function setupMasterData() {
  try {
    console.log('========================================');
    console.log('Master Data Setup Script');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    // Sync models
    console.log('Syncing models...');
    await Role.sync();
    await Department.sync();
    await Course.sync();
    console.log('✓ Models synced\n');

    // Add Roles
    console.log('Setting up Roles...');
    console.log('-------------------');
    for (const role of roles) {
      try {
        const [roleRecord, created] = await Role.findOrCreate({
          where: { id: role.id },
          defaults: role
        });

        if (created) {
          console.log(`✓ Created: ${role.name}`);
        } else {
          await roleRecord.update(role);
          console.log(`✓ Updated: ${role.name}`);
        }
      } catch (error) {
        console.error(`✗ Error with ${role.name}:`, error.message);
      }
    }
    console.log('');

    // Add Departments
    console.log('Setting up Departments...');
    console.log('-------------------------');
    for (const dept of departments) {
      try {
        const [department, created] = await Department.findOrCreate({
          where: { code: dept.code },
          defaults: dept
        });

        if (created) {
          console.log(`✓ Created: ${dept.code} - ${dept.name}`);
        } else {
          await department.update(dept);
          console.log(`✓ Updated: ${dept.code} - ${dept.name}`);
        }
      } catch (error) {
        console.error(`✗ Error with ${dept.code}:`, error.message);
      }
    }
    console.log('');

    // Add Courses
    console.log('Setting up Courses...');
    console.log('---------------------');
    
    // Get department map
    const allDepts = await Department.findAll();
    const deptMap = {};
    allDepts.forEach(dept => {
      deptMap[dept.code] = dept.id;
    });

    for (const course of courses) {
      try {
        const departmentId = deptMap[course.departmentCode];
        
        if (!departmentId) {
          console.error(`✗ Error: Department ${course.departmentCode} not found for course ${course.code}`);
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
          console.log(`✓ Created: ${course.code} - ${course.name} (${course.departmentCode})`);
        } else {
          await courseRecord.update(courseData);
          console.log(`✓ Updated: ${course.code} - ${course.name} (${course.departmentCode})`);
        }
      } catch (error) {
        console.error(`✗ Error with ${course.code}:`, error.message);
      }
    }
    console.log('');

    console.log('========================================');
    console.log('Master Data Setup Complete!');
    console.log('========================================\n');

    // Display summary
    const allRoles = await Role.findAll({ order: [['id', 'ASC']] });
    const allDepartments = await Department.findAll({ order: [['code', 'ASC']] });
    const allCourses = await Course.findAll({ 
      include: [{ model: Department, as: 'department' }],
      order: [['code', 'ASC']] 
    });

    console.log('Roles in Database:');
    console.log('------------------');
    allRoles.forEach(role => {
      console.log(`${role.id}. ${role.name.padEnd(15)} - ${role.description}`);
    });
    console.log('');

    console.log('Departments in Database:');
    console.log('------------------------');
    allDepartments.forEach(dept => {
      console.log(`${dept.code.padEnd(8)} | ${dept.name.padEnd(45)} | Active: ${dept.isActive}`);
    });
    console.log('');

    console.log('Courses in Database:');
    console.log('--------------------');
    let currentDept = null;
    allCourses.forEach(course => {
      const deptName = course.department ? course.department.name : 'No Department';
      if (currentDept !== deptName) {
        console.log(`\n${deptName}:`);
        currentDept = deptName;
      }
      console.log(`  ${course.code.padEnd(8)} | ${course.name.padEnd(40)} | ${course.credits} credits`);
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

setupMasterData();
