const sequelize = require('./src/config/database');
const { User, Student, Department, Class, Role, UserRole } = require('./src/models/index');

const students = [
  { firstName: 'Rahul', lastName: 'Patil', email: 'rahul.patil@student.com', password: 'Password@123', phone: '9000000001', studentId: 'STU001', departmentCode: 'CSE', classCode: 'CSE1A', enrollmentYear: 2024, currentSemester: 1, isActive: true },
  { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@student.com', password: 'Password@123', phone: '9000000002', studentId: 'STU002', departmentCode: 'CSE', classCode: 'CSE2A', enrollmentYear: 2023, currentSemester: 3, isActive: true },
  { firstName: 'Amit', lastName: 'Verma', email: 'amit.verma@student.com', password: 'Password@123', phone: '9000000003', studentId: 'STU003', departmentCode: 'ECE', classCode: 'ECE1A', enrollmentYear: 2024, currentSemester: 1, isActive: true },
  { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@student.com', password: 'Password@123', phone: '9000000004', studentId: 'STU004', departmentCode: 'ECE', classCode: 'ECE2A', enrollmentYear: 2023, currentSemester: 3, isActive: true },
  { firstName: 'Kiran', lastName: 'Naik', email: 'kiran.naik@student.com', password: 'Password@123', phone: '9000000005', studentId: 'STU005', departmentCode: 'MECH', classCode: 'MECH1A', enrollmentYear: 2024, currentSemester: 1, isActive: true },
  { firstName: 'Pooja', lastName: 'Kulkarni', email: 'pooja.kulkarni@student.com', password: 'Password@123', phone: '9000000006', studentId: 'STU006', departmentCode: 'MECH', classCode: 'MECH2A', enrollmentYear: 2023, currentSemester: 3, isActive: true },
  { firstName: 'Arjun', lastName: 'Rao', email: 'arjun.rao@student.com', password: 'Password@123', phone: '9000000007', studentId: 'STU007', departmentCode: 'CIVIL', classCode: 'CIVIL1A', enrollmentYear: 2024, currentSemester: 1, isActive: true },
  { firstName: 'Neha', lastName: 'Desai', email: 'neha.desai@student.com', password: 'Password@123', phone: '9000000008', studentId: 'STU008', departmentCode: 'CIVIL', classCode: 'CIVIL2A', enrollmentYear: 2023, currentSemester: 3, isActive: true },
  { firstName: 'Rohit', lastName: 'Mehta', email: 'rohit.mehta@student.com', password: 'Password@123', phone: '9000000009', studentId: 'STU009', departmentCode: 'MBA', classCode: 'MBA1A', enrollmentYear: 2024, currentSemester: 1, isActive: true },
  { firstName: 'Anjali', lastName: 'Singh', email: 'anjali.singh@student.com', password: 'Password@123', phone: '9000000010', studentId: 'STU010', departmentCode: 'MBA', classCode: 'MBA2A', enrollmentYear: 2023, currentSemester: 3, isActive: true },
  { firstName: 'Vivek', lastName: 'Joshi', email: 'vivek.joshi@student.com', password: 'Password@123', phone: '9000000011', studentId: 'STU011', departmentCode: 'CSE', classCode: 'CSE3A', enrollmentYear: 2022, currentSemester: 5, isActive: true },
  { firstName: 'Kavya', lastName: 'Iyer', email: 'kavya.iyer@student.com', password: 'Password@123', phone: '9000000012', studentId: 'STU012', departmentCode: 'ECE', classCode: 'ECE3A', enrollmentYear: 2022, currentSemester: 5, isActive: true },
  { firstName: 'Manish', lastName: 'Gupta', email: 'manish.gupta@student.com', password: 'Password@123', phone: '9000000013', studentId: 'STU013', departmentCode: 'MECH', classCode: 'MECH3A', enrollmentYear: 2022, currentSemester: 5, isActive: true },
  { firstName: 'Shreya', lastName: 'Nair', email: 'shreya.nair@student.com', password: 'Password@123', phone: '9000000014', studentId: 'STU014', departmentCode: 'CIVIL', classCode: 'CIVIL3A', enrollmentYear: 2022, currentSemester: 5, isActive: true },
  { firstName: 'Akash', lastName: 'Kulkarni', email: 'akash.kulkarni@student.com', password: 'Password@123', phone: '9000000015', studentId: 'STU015', departmentCode: 'MBA', classCode: 'MBA2B', enrollmentYear: 2023, currentSemester: 4, isActive: true }
];

async function addStudents() {
  try {
    console.log('========================================');
    console.log('Student Setup Script');
    console.log('========================================\n');

    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected successfully\n');

    console.log('Syncing models...');
    await User.sync();
    await Role.sync();
    await UserRole.sync();
    await Department.sync();
    await Class.sync();
    await Student.sync();
    console.log('✓ Models synced\n');

    // Get department map
    const departments = await Department.findAll();
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.code] = dept.id;
    });

    // Get class map
    const classes = await Class.findAll();
    const classMap = {};
    classes.forEach(cls => {
      classMap[cls.code] = cls.id;
    });

    console.log('Found departments:', Object.keys(deptMap).join(', '));
    console.log('Found classes:', Object.keys(classMap).join(', '));
    console.log('');

    // Get Student role (roleId = 5)
    const studentRole = await Role.findOne({ where: { id: 5 } });
    if (!studentRole) {
      console.error('✗ Error: Student role not found. Please run setup-master-data.js first.');
      process.exit(1);
    }

    console.log('Adding students...\n');
    
    let successCount = 0;
    let errorCount = 0;

    for (const stuData of students) {
      try {
        const departmentId = deptMap[stuData.departmentCode];
        const classId = classMap[stuData.classCode];
        
        if (!departmentId) {
          console.error(`✗ Error: Department ${stuData.departmentCode} not found for ${stuData.firstName} ${stuData.lastName}`);
          errorCount++;
          continue;
        }

        if (!classId) {
          console.error(`✗ Error: Class ${stuData.classCode} not found for ${stuData.firstName} ${stuData.lastName}`);
          errorCount++;
          continue;
        }

        // Check if user already exists
        let user = await User.findOne({ where: { email: stuData.email } });
        let userCreated = false;

        if (!user) {
          // Create user account
          user = await User.create({
            firstName: stuData.firstName,
            lastName: stuData.lastName,
            email: stuData.email,
            password: stuData.password,
            phone: stuData.phone,
            isActive: stuData.isActive
          });
          userCreated = true;
        }

        // Assign Student role
        await UserRole.findOrCreate({
          where: { userId: user.id, roleId: 5 },
          defaults: { userId: user.id, roleId: 5 }
        });

        // Create or update student profile
        const [student, studentCreated] = await Student.findOrCreate({
          where: { userId: user.id },
          defaults: {
            userId: user.id,
            studentId: stuData.studentId,
            classId: classId,
            departmentId: departmentId,
            enrollmentYear: stuData.enrollmentYear,
            currentSemester: stuData.currentSemester,
            isActive: stuData.isActive
          }
        });

        if (!studentCreated) {
          await student.update({
            studentId: stuData.studentId,
            classId: classId,
            departmentId: departmentId,
            enrollmentYear: stuData.enrollmentYear,
            currentSemester: stuData.currentSemester,
            isActive: stuData.isActive
          });
        }

        const action = userCreated ? 'Created' : 'Updated';
        console.log(`✓ ${action}: ${stuData.studentId.padEnd(8)} | ${stuData.firstName} ${stuData.lastName.padEnd(12)} | ${stuData.classCode.padEnd(8)} | Sem ${stuData.currentSemester}`);
        successCount++;

      } catch (error) {
        console.error(`✗ Error with ${stuData.firstName} ${stuData.lastName}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n========================================');
    console.log(`Student Setup Complete!`);
    console.log(`Success: ${successCount} | Errors: ${errorCount}`);
    console.log('========================================\n');

    // Display all students
    const allStudents = await Student.findAll({
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
        },
        {
          model: Class,
          as: 'class',
          attributes: ['code', 'name']
        }
      ],
      order: [['studentId', 'ASC']]
    });

    console.log('Students in Database:');
    console.log('---------------------');
    
    let currentClass = null;
    allStudents.forEach(stu => {
      const className = stu.class ? stu.class.code : 'No Class';
      if (currentClass !== className) {
        console.log(`\n${className}:`);
        currentClass = className;
      }
      const userName = stu.user ? `${stu.user.firstName} ${stu.user.lastName}` : 'No User';
      console.log(`  ${stu.studentId.padEnd(8)} | ${userName.padEnd(25)} | Sem ${stu.currentSemester} | Year ${stu.enrollmentYear} | Active: ${stu.isActive}`);
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

addStudents();
