const sequelize = require('./src/config/database');
const { Department } = require('./src/models/index');

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

async function addDepartments() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    console.log('Syncing Department model...');
    await Department.sync();
    console.log('✓ Department table ready\n');

    console.log('Adding departments...\n');
    
    for (const dept of departments) {
      try {
        const [department, created] = await Department.findOrCreate({
          where: { code: dept.code },
          defaults: dept
        });

        if (created) {
          console.log(`✓ Created: ${dept.code} - ${dept.name}`);
        } else {
          // Update existing department
          await department.update(dept);
          console.log(`✓ Updated: ${dept.code} - ${dept.name}`);
        }
      } catch (error) {
        console.error(`✗ Error with ${dept.code}:`, error.message);
      }
    }

    console.log('\n========================================');
    console.log('All departments processed successfully!');
    console.log('========================================\n');

    // Display all departments
    const allDepartments = await Department.findAll({
      order: [['code', 'ASC']]
    });

    console.log('Current Departments in Database:');
    console.log('--------------------------------');
    allDepartments.forEach(dept => {
      console.log(`${dept.code.padEnd(8)} | ${dept.name.padEnd(45)} | Active: ${dept.isActive}`);
    });
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

addDepartments();
