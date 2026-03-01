const sequelize = require('./src/config/database');
const { User, Lecturer, Department, Role, UserRole } = require('./src/models/index');
const bcrypt = require('bcryptjs');

const lecturers = [
  {
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi.kumar@college.com',
    password: 'Password@123',
    phone: '9876543210',
    employeeId: 'EMP001',
    departmentCode: 'CSE',
    qualification: 'M.Tech',
    specialization: 'Data Structures',
    joiningDate: '2022-06-01',
    isActive: true
  },
  {
    firstName: 'Sneha',
    lastName: 'Patil',
    email: 'sneha.patil@college.com',
    password: 'Password@123',
    phone: '9876543211',
    employeeId: 'EMP002',
    departmentCode: 'CSE',
    qualification: 'Ph.D',
    specialization: 'Artificial Intelligence',
    joiningDate: '2021-07-15',
    isActive: true
  },
  {
    firstName: 'Arjun',
    lastName: 'Reddy',
    email: 'arjun.reddy@college.com',
    password: 'Password@123',
    phone: '9876543212',
    employeeId: 'EMP003',
    departmentCode: 'ECE',
    qualification: 'M.Tech',
    specialization: 'Embedded Systems',
    joiningDate: '2020-06-10',
    isActive: true
  },
  {
    firstName: 'Meera',
    lastName: 'Sharma',
    email: 'meera.sharma@college.com',
    password: 'Password@123',
    phone: '9876543213',
    employeeId: 'EMP004',
    departmentCode: 'ECE',
    qualification: 'Ph.D',
    specialization: 'Digital Electronics',
    joiningDate: '2019-08-20',
    isActive: true
  },
  {
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@college.com',
    password: 'Password@123',
    phone: '9876543214',
    employeeId: 'EMP005',
    departmentCode: 'MECH',
    qualification: 'M.Tech',
    specialization: 'Thermal Engineering',
    joiningDate: '2021-06-05',
    isActive: true
  },
  {
    firstName: 'Pooja',
    lastName: 'Desai',
    email: 'pooja.desai@college.com',
    password: 'Password@123',
    phone: '9876543215',
    employeeId: 'EMP006',
    departmentCode: 'CIVIL',
    qualification: 'M.Tech',
    specialization: 'Structural Engineering',
    joiningDate: '2020-07-12',
    isActive: true
  },
  {
    firstName: 'Karan',
    lastName: 'Joshi',
    email: 'karan.joshi@college.com',
    password: 'Password@123',
    phone: '9876543216',
    employeeId: 'EMP007',
    departmentCode: 'MECH',
    qualification: 'Ph.D',
    specialization: 'Manufacturing Technology',
    joiningDate: '2018-01-01',
    isActive: true
  },
  {
    firstName: 'Neha',
    lastName: 'Kulkarni',
    email: 'neha.kulkarni@college.com',
    password: 'Password@123',
    phone: '9876543217',
    employeeId: 'EMP008',
    departmentCode: 'MBA',
    qualification: 'MBA, Ph.D',
    specialization: 'Finance',
    joiningDate: '2022-06-18',
    isActive: true
  },
  {
    firstName: 'Rohit',
    lastName: 'Gupta',
    email: 'rohit.gupta@college.com',
    password: 'Password@123',
    phone: '9876543218',
    employeeId: 'EMP009',
    departmentCode: 'MBA',
    qualification: 'MBA',
    specialization: 'Marketing',
    joiningDate: '2023-05-25',
    isActive: true
  },
  {
    firstName: 'Anjali',
    lastName: 'Nair',
    email: 'anjali.nair@college.com',
    password: 'Password@123',
    phone: '9876543219',
    employeeId: 'EMP010',
    departmentCode: 'CSE',
    qualification: 'M.Tech',
    specialization: 'Cyber Security',
    joiningDate: '2024-02-02',
    isActive: true
  }
];

async function addLecturers() {
  try {
    console.log('========================================');
    console.log('Lecturer Setup Script');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    console.log('Syncing models...');
    await User.sync();
    await Role.sync();
    await UserRole.sync();
    await Department.sync();
    await Lecturer.sync();
    console.log('✓ Models synced\n');

    // Get department map
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

    // Get Examiner role (roleId = 3)
    const examinerRole = await Role.findOne({ where: { id: 3 } });
    if (!examinerRole) {
      console.error('✗ Error: Examiner role not found. Please run setup-master-data.js first.');
      process.exit(1);
    }

    console.log('Adding lecturers...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const lecData of lecturers) {
      try {
        const departmentId = deptMap[lecData.departmentCode];
        
        if (!departmentId) {
          console.error(`✗ Error: Department ${lecData.departmentCode} not found for ${lecData.firstName} ${lecData.lastName}`);
          errorCount++;
          continue;
        }

        // Check if user already exists
        let user = await User.findOne({ where: { email: lecData.email } });
        let userCreated = false;

        if (!user) {
          // Create user account
          user = await User.create({
            firstName: lecData.firstName,
            lastName: lecData.lastName,
            email: lecData.email,
            password: lecData.password,
            phone: lecData.phone,
            isActive: lecData.isActive
          });
          userCreated = true;
        }

        // Assign Examiner role
        await UserRole.findOrCreate({
          where: { userId: user.id, roleId: 3 },
          defaults: { userId: user.id, roleId: 3 }
        });

        // Create or update lecturer profile
        const [lecturer, lecturerCreated] = await Lecturer.findOrCreate({
          where: { userId: user.id },
          defaults: {
            userId: user.id,
            employeeId: lecData.employeeId,
            departmentId: departmentId,
            qualification: lecData.qualification,
            specialization: lecData.specialization,
            joiningDate: lecData.joiningDate,
            isActive: lecData.isActive
          }
        });

        if (!lecturerCreated) {
          await lecturer.update({
            employeeId: lecData.employeeId,
            departmentId: departmentId,
            qualification: lecData.qualification,
            specialization: lecData.specialization,
            joiningDate: lecData.joiningDate,
            isActive: lecData.isActive
          });
        }

        const action = userCreated ? 'Created' : 'Updated';
        console.log(`✓ ${action}: ${lecData.employeeId.padEnd(8)} | ${lecData.firstName} ${lecData.lastName.padEnd(12)} | ${lecData.departmentCode.padEnd(6)} | ${lecData.specialization}`);
        successCount++;

      } catch (error) {
        console.error(`✗ Error with ${lecData.firstName} ${lecData.lastName}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log(`Lecturer Setup Complete!`);
    console.log(`Success: ${successCount} | Errors: ${errorCount}`);
    console.log('========================================\n');

    // Display all lecturers
    const allLecturers = await Lecturer.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['code', 'name']
        }
      ],
      order: [['employeeId', 'ASC']]
    });

    console.log('Lecturers in Database:');
    console.log('----------------------');
    
    let currentDept = null;
    allLecturers.forEach(lec => {
      const deptName = lec.department ? lec.department.name : 'No Department';
      if (currentDept !== deptName) {
        console.log(`\n${deptName}:`);
        currentDept = deptName;
      }
      const userName = lec.user ? `${lec.user.firstName} ${lec.user.lastName}` : 'No User';
      console.log(`  ${lec.employeeId.padEnd(8)} | ${userName.padEnd(25)} | ${lec.specialization.padEnd(30)} | Active: ${lec.isActive}`);
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

addLecturers();
