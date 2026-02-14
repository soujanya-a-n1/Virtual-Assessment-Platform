const sequelize = require('../config/database');
const { Role, User, Exam, Question } = require('./index');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Seed roles
    const roles = await Role.findAll();
    if (roles.length === 0) {
      await Role.bulkCreate([
        { name: 'Super Admin', description: 'System administrator with full access' },
        { name: 'Admin', description: 'Administrator with exam and user management' },
        { name: 'Examiner', description: 'Can create and manage exams' },
        { name: 'Proctor', description: 'Can invigilate exams and manage anti-cheating' },
        { name: 'Student', description: 'Can take exams' },
      ]);
      console.log('Roles seeded successfully.');
    }

    // Seed default Super Admin user
    const adminExists = await User.findOne({ where: { email: 'superadmin@platform.com' } });
    if (!adminExists) {
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@platform.com',
        password: 'Admin@123456',
        phone: '+1-800-ADMIN',
        isActive: true,
      });
      console.log('Super admin user created.');
    }

    console.log('Database sync and seed completed successfully!');
  } catch (error) {
    console.error('Database sync error:', error);
  }
};

if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase;
