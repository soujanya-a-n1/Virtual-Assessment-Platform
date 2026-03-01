const sequelize = require('./src/config/database');
const { Department, Course, Class, Role } = require('./src/models/index');

// Master data definitions
const roles = [
  { id: 1, name: 'Super Admin', description: 'Full system access' },
  { id: 2, name: 'Admin', description: 'Administrative access' },
  { id: 3, name: 'Examiner', description: 'Can create and manage exams' },
  { id: 4, name: 'Proctor', description: 'Can monitor exams' },
  { id: 5, name: 'Student', description: 'Can take exams' }
];

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

const courses = [
  { code: 'CS101', name: 'Programming in C', departmentCode: 'CSE', credits: 4, description: 'Basics of C programming and problem solving.', isActive: true },
  { code: 'CS102', name: 'Object Oriented Programming', departmentCode: 'CSE', credits: 4, description: 'OOP concepts using Java.', isActive: true },
  { code: 'CS201', name: 'Data Structures', departmentCode: 'CSE', credits: 4, description: 'Stacks, queues, linked lists, trees, and graphs.', isActive: true },
  { code: 'CS301', name: 'Database Management Systems', departmentCode: 'CSE', credits: 4, description: 'SQL, normalization, and database design.', isActive: true },
  { code: 'CS302', name: 'Operating Systems', departmentCode: 'CSE', credits: 3, description: 'Process management and memory management concepts.', isActive: true },
  { code: 'EC101', name: 'Digital Electronics', departmentCode: 'ECE', credits: 3, description: 'Logic gates and digital circuits.', isActive: true },
  { code: 'EC201', name: 'Microprocessors', departmentCode: 'ECE', credits: 3, description: 'Architecture and programming of microprocessors.', isActive: true },
  { code: 'ME101', name: 'Engineering Mechanics', departmentCode: 'MECH', credits: 3, description: 'Fundamentals of forces and equilibrium.', isActive: true },
  { code: 'CIV101', name: 'Structural Analysis', departmentCode: 'CIVIL', credits: 3, description: 'Analysis of beams and structures.', isActive: true },
  { code: 'MBA101', name: 'Principles of Management', departmentCode: 'MBA', credits: 3, description: 'Basics of management and organizational behavior.', isActive: true }
];

const classes = [
  { code: 'CSE1A', name: 'CSE First Year - A', departmentCode: 'CSE', academicYear: '2024-2025', semester: '1', isActive: true },
  { code: 'CSE2A', name: 'CSE Second Year - A', departmentCode: 'CSE', academicYear: '2024-2025', semester: '3', isActive: true },
  { code: 'CSE3A', name: 'CSE Third Year - A', departmentCode: 'CSE', academicYear: '2024-2025', semester: '5', isActive: true },
  { code: 'ECE1A', name: 'ECE First Year - A', departmentCode: 'ECE', academicYear: '2024-2025', semester: '1', isActive: true },
  { code: 'ECE2A', name: 'ECE Second Year - A', departmentCode: 'ECE', academicYear: '2024-2025', semester: '3', isActive: true },
  { code: 'ECE3A', name: 'ECE Third Year - A', departmentCode: 'ECE', academicYear: '2024-2025', semester: '5', isActive: true },
  { code: 'MECH1A', name: 'MECH First Year - A', departmentCode: 'MECH', academicYear: '2024-2025', semester: '1', isActive: true },
  { code: 'MECH2A', name: 'MECH Second Year - A', departmentCode: 'MECH', academicYear: '2024-2025', semester: '3', isActive: true },
  { code: 'MECH3A', name: 'MECH Third Year - A', departmentCode: 'MECH', academicYear: '2024-2025', semester: '5', isActive: true },
  { code: 'CIVIL1A', name: 'CIVIL First Year - A', departmentCode: 'CIVIL', academicYear: '2024-2025', semester: '1', isActive: true },
  { code: 'CIVIL2A', name: 'CIVIL Second Year - A', departmentCode: 'CIVIL', academicYear: '2024-2025', semester: '3', isActive: true },
  { code: 'CIVIL3A', name: 'CIVIL Third Year - A', departmentCode: 'CIVIL', academicYear: '2024-2025', semester: '5', isActive: true },
  { code: 'MBA1A', name: 'MBA First Year - A', departmentCode: 'MBA', academicYear: '2024-2025', semester: '1', isActive: true },
  { code: 'MBA2A', name: 'MBA Second Year - A', departmentCode: 'MBA', academicYear: '2024-2025', semester: '3', isActive: true },
  { code: 'MBA2B', name: 'MBA Second Year - B', departmentCode: 'MBA', academicYear: '2024-2025', semester: '4', isActive: true }
];

async function setupCompleteMasterData() {
  try {
    console.log('========================================');
    console.log('Complete Master Data Setup');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    // Sync models
    console.log('Syncing models...');
    await Role.sync();
    await Department.sync();
    await Course.sync();
    await Class.sync();
    console.log('✓ Models synced\n');

    // Add Roles
    console.log('1. Setting up Roles...');
    console.log('----------------------');
    for (const role of roles) {
      try {
        const [roleRecord, created] = await Role.findOrCreate({
          where: { id: role.id },
          defaults: role
        });
        console.log(`${created ? '✓ Created' : '✓ Updated'}: ${role.name}`);
      } catch (error) {
        console.error(`✗ Error with ${role.name}:`, error.message);
      }
    }
    console.log('');

    // Add Departments
    console.log('2. Setting up Departments...');
    console.log('----------------------------');
    for (const dept of departments) {
      try {
        const [department, created] = await Department.findOrCreate({
          where: { code: dept.code },
          defaults: dept
        });
        console.log(`${created ? '✓ Created' : '✓ Updated'}: ${dept.code} - ${dept.name}`);
      } catch (error) {
        console.error(`✗ Error with ${dept.code}:`, error.message);
      }
    }
    console.log('');

    // Get department map
    const allDepts = await Department.findAll();
    const deptMap = {};
    allDepts.forEach(dept => {
      deptMap[dept.code] = dept.id;
    });

    // Add Courses
    console.log('3. Setting up Courses...');
    console.log('------------------------');
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
        console.log(`${created ? '✓ Created' : '✓ Updated'}: ${course.code} - ${course.name} (${course.departmentCode})`);
      } catch (error) {
        console.error(`✗ Error with ${course.code}:`, error.message);
      }
    }
    console.log('');

    // Add Classes
    console.log('4. Setting up Classes...');
    console.log('------------------------');
    for (const classData of classes) {
      try {
        const departmentId = deptMap[classData.departmentCode];
        if (!departmentId) {
          console.error(`✗ Error: Department ${classData.departmentCode} not found for class ${classData.code}`);
          continue;
        }

        const classRecord = {
          code: classData.code,
          name: classData.name,
          departmentId: departmentId,
          academicYear: classData.academicYear,
          semester: classData.semester,
          isActive: classData.isActive
        };

        const [record, created] = await Class.findOrCreate({
          where: { code: classData.code },
          defaults: classRecord
        });
        console.log(`${created ? '✓ Created' : '✓ Updated'}: ${classData.code} - ${classData.name} (Sem ${classData.semester})`);
      } catch (error) {
        console.error(`✗ Error with ${classData.code}:`, error.message);
      }
    }
    console.log('');

    console.log('========================================');
    console.log('Complete Master Data Setup Finished!');
    console.log('========================================\n');

    // Display summary
    const allRoles = await Role.findAll({ order: [['id', 'ASC']] });
    const allDepartments = await Department.findAll({ order: [['code', 'ASC']] });
    const allCourses = await Course.findAll({ order: [['code', 'ASC']] });
    const allClasses = await Class.findAll({ order: [['code', 'ASC']] });

    console.log('Summary:');
    console.log('--------');
    console.log(`✓ Roles:       ${allRoles.length}/5`);
    console.log(`✓ Departments: ${allDepartments.length}/5`);
    console.log(`✓ Courses:     ${allCourses.length}/10`);
    console.log(`✓ Classes:     ${allClasses.length}/15`);
    console.log('');

    console.log('✅ All master data is ready!');
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

setupCompleteMasterData();
