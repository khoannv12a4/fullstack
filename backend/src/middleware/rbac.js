const User = require('../models/User');

/**
 * Middleware to check if user has required role
 * @param {string|string[]} roles - Required role(s)
 */
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get full user data with role
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has any of the required roles
      const hasRole = roles.some(role => user.hasRole(role));
      
      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role(s): ${roles.join(', ')}`
        });
      }

      // Add full user data to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during role verification'
      });
    }
  };
};

/**
 * Middleware to check if user has required permission
 * @param {string|string[]} permissions - Required permission(s)
 */
const requirePermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get full user data with permissions
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has any of the required permissions
      const hasPermission = user.hasAnyPermission(permissions);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission(s): ${permissions.join(', ')}`
        });
      }

      // Add full user data to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission verification'
      });
    }
  };
};

/**
 * Middleware to check if user has ALL required permissions
 * @param {string[]} permissions - Required permissions (all must be present)
 */
const requireAllPermissions = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get full user data with permissions
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user has ALL required permissions
      const hasAllPermissions = user.hasAllPermissions(permissions);
      
      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permissions: ${permissions.join(', ')}`
        });
      }

      // Add full user data to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during permission verification'
      });
    }
  };
};

/**
 * Middleware for admin only access
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware for manager or admin access
 */
const requireManagerOrAdmin = requireRole('manager', 'admin');

/**
 * Middleware to check if user can access their own resource or is admin/manager
 * @param {string} userIdParam - Parameter name containing user ID to check
 */
const requireOwnershipOrRole = (userIdParam = 'userId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      const targetUserId = req.params[userIdParam];
      
      // Allow if user is accessing their own resource
      if (user._id.toString() === targetUserId) {
        req.user = user;
        return next();
      }

      // Allow if user is admin or manager
      if (user.hasRole('admin') || user.hasRole('manager')) {
        req.user = user;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during ownership verification'
      });
    }
  };
};

module.exports = {
  requireRole,
  requirePermission,
  requireAllPermissions,
  requireAdmin,
  requireManagerOrAdmin,
  requireOwnershipOrRole
};