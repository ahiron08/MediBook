const express = require('express');
const router = express.Router();
const { register, login, doctorLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// Rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.SIGNUP_RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again after 1 hour.',
  },
});

router.post('/register', registerLimiter, validate('register'), register);
router.post('/login', loginLimiter, validate('login'), login);
router.post('/doctor/login', loginLimiter, validate('login'), doctorLogin);
router.get('/me', protect, getMe);

module.exports = router;