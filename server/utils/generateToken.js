const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_secure_jwt_secret_key_here') {
    throw new Error('JWT_SECRET environment variable is not properly configured');
  }

  return jwt.sign(
    { 
      id, 
      role,
      iat: Math.floor(Date.now() / 1000) // Issued at time
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
      algorithm: 'HS256',
      issuer: 'doctor-appointment-system',
      audience: 'doctor-appointment-client',
    }
  );
};

// Generate refresh token (if refresh token flow is implemented)
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET + '_refresh', // Different secret for refresh tokens
    {
      expiresIn: '7d',
      algorithm: 'HS256',
    }
  );
};

// Verify token with additional security checks
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
    issuer: 'doctor-appointment-system',
    audience: 'doctor-appointment-client',
    clockTolerance: 30, // Allow 30 seconds clock skew
  });
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
};
