const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Use role from JWT token (set during login as req.user.role)
      const userRole = req.user.role || '';
      const hasRole = allowedRoles.includes(userRole);

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
