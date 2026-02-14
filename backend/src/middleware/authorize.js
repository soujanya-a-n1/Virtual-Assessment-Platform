const { User, Role } = require('../models');

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Role,
          through: { attributes: [] },
        }],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userRoles = user.Roles?.map(r => r.name) || [];
      
      const hasRole = allowedRoles.some(role => userRoles.includes(role));
      if (!hasRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Authorization error', error: error.message });
    }
  };
};

module.exports = authorize;
