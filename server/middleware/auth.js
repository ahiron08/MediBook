const { verifyToken } = require('../utils/generateToken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account deactivated',
      });
    }

    next();
  } catch (error) {
    let message = 'Not authorized to access this route';
    
    // Provide more specific error messages for different JWT errors
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    } else if (error.name === 'NotBeforeError') {
      message = 'Token not yet valid';
    }

    logger.warn(`Auth failed: ${message}`, {
      ip: req.ip,
      url: req.originalUrl,
      error: error.message,
    });

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }
    
    if (!roles.includes(req.user.role)) {
      logger.warn(`Authorization denied: User ${req.user._id} with role ${req.user.role} attempted to access ${req.originalUrl}`, {
        ip: req.ip,
        requiredRoles: roles,
      });
      
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };