const { User, Role, UserRole } = require('../models');
const { hashPassword } = require('../utils/password');

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, roles } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      isActive: true,
    });

    // Assign roles if provided
    if (roles && Array.isArray(roles) && roles.length > 0) {
      for (const roleId of roles) {
        await UserRole.create({ userId: user.id, roleId });
      }
    }

    // Fetch user with roles
    const createdUser = await User.findByPk(user.id, {
      include: [{
        model: Role,
        through: { attributes: [] },
      }],
      attributes: { exclude: ['password'] },
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      user: createdUser 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        through: { attributes: [] },
      }],
      attributes: { exclude: ['password'] },
    });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        through: { attributes: [] },
      }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ firstName, lastName, email, phone, isActive });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ message: 'User or Role not found' });
    }

    const existingRole = await UserRole.findOne({
      where: { userId, roleId },
    });

    if (existingRole) {
      return res.status(400).json({ message: 'Role already assigned to user' });
    }

    await UserRole.create({ userId, roleId });
    res.status(201).json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning role', error: error.message });
  }
};

const removeRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const result = await UserRole.destroy({
      where: { userId, roleId },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Role assignment not found' });
    }

    res.json({ message: 'Role removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing role', error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRole,
  removeRole,
};
