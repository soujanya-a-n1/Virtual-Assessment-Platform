const sequelize = require('./src/config/database');
const { Class, Department } = require('./src/models/index');

const classes = [
  {
    code: 'CSE1A',
    name: 'CSE First Year - A',
    departmentCode: 'CSE',
    academicYear: '2024-2025',
    semester: '1',
    isActive: true
  },
  {
    code: 'CSE2A',
    name: 'CSE Second Year - A',
    departmentCode: 'CSE',
    academicYear: '2024-2025',
    semester: '3',
    isActive: true
  },
  {
    code: 'CSE3A',
    name: 'CSE Third Year - A',
    departmentCode: 'CSE',
    academicYear: '2024-2025',
    semester: '5',
    isActive: true
  },
  {
    code: 'ECE1A',
    name: 'ECE First Year - A',
    departmentCode: 'ECE',
    academicYear: '2024-2025',
    semester: '1',
    isActive: true
  },
  {
    code: 'ECE2A',
    name: 'ECE Second Year - A',
    departmentCode: 'ECE',
    academicYear: '2024-2025',
    semester: '3',
    isActive: true
  },
  {
    code: 'ECE3A',
    name: 'ECE Third Year - A',
    departmentCode: 'ECE',
    academicYear: '2024-2025',
    semester: '5',
    isActive: true
  },
  {
    code: 'MECH1A',
    name: 'MECH First Year - A',
    departmentCode: 'MECH',
    academicYear: '2024-2025',
    semester: '1',
    isActive: true
  },
  {
    code: 'MECH2A',
    name: 'MECH Second Year - A',
    departmentCode: 'MECH',
    academicYear: '2024-2025',
    semester: '3',
    isActive: true
  },
  {
    code: 'MECH3A',
    name: 'MECH Third Year - A',
    departmentCode: 'MECH',
    academicYear: '2024-2025',
    semester: '5',
    isActive: true
  },
  {
    code: 'CIVIL1A',
    name: 'CIVIL First Year - A',
    departmentCode: 'CIVIL',
    academicYear: '2024-2025',
    semester: '1',
    isActive: true
  },
  {
    code: 'CIVIL2A',
    name: 'CIVIL Second Year - A',
    departmentCode: 'CIVIL',
    academicYear: '2024-2025',
    semester: '3',
    isActive: true
  },
  {
    code: 'CIVIL3A',
    name: 'CIVIL Third Year - A',
    departmentCode: 'CIVIL',
    academicYear: '2024-2025',
    semester: '5',
    isActive: true
  },
  {
    code: 'MBA1A',
    name: 'MBA First Year - A',
    departmentCode: 'MBA',
    academicYear: '2024-2025',
    semester: '1',
    isActive: true
  },
  {
    code: 'MBA2A',
    name: 'MBA Second Year - A',
    departmentCode: 'MBA',
    academicYear: '2024-2025',
    semester: '3',
    isActive: true
  },
  {
    code: 'MBA2B',
    name: 'MBA Second Year - B',
    departmentCode: 'MBA',
    academicYear: '2024-2025',
    semester: '4',
    isActive: true
  }
];

async function addClasses() {
  try {
    console.log('========================================');
    console.log('Class Setup Script');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    console.log('Syncing models...');
    await Department.sync();
    await Class.sync();
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

    console.log('Adding classes...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const classData of classes) {
      try {
        const departmentId = deptMap[classData.departmentCode];
        
        if (!departmentId) {
          console.error(`✗ Error: Department ${classData.departmentCode} not found for class ${classData.code}`);
          errorCount++;
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

        if (created) {
          console.log(`✓ Created: ${classData.code.padEnd(10)} | ${classData.name.padEnd(30)} | ${classData.departmentCode.padEnd(6)} | Sem ${classData.semester} | ${classData.academicYear}`);
          successCount++;
        } else {
          await record.update(classRecord);
          console.log(`✓ Updated: ${classData.code.padEnd(10)} | ${classData.name.padEnd(30)} | ${classData.departmentCode.padEnd(6)} | Sem ${classData.semester} | ${classData.academicYear}`);
          successCount++;
        }
      } catch (error) {
        console.error(`✗ Error with ${classData.code}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log(`Class Setup Complete!`);
    console.log(`Success: ${successCount} | Errors: ${errorCount}`);
    console.log('========================================\n');

    // Display all classes grouped by department
    const allClasses = await Class.findAll({
      include: [{
        model: Department,
        as: 'department'
      }],
      order: [['code', 'ASC']]
    });

    console.log('Classes in Database:');
    console.log('--------------------');
    
    let currentDept = null;
    allClasses.forEach(cls => {
      const deptName = cls.department ? cls.department.name : 'No Department';
      if (currentDept !== deptName) {
        console.log(`\n${deptName}:`);
        currentDept = deptName;
      }
      console.log(`  ${cls.code.padEnd(10)} | ${cls.name.padEnd(30)} | Sem ${cls.semester} | ${cls.academicYear} | Active: ${cls.isActive}`);
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

addClasses();
