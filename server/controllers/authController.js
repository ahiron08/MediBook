const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const logger = require('../utils/logger');

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'patient',
    });

    if (user) {
      const token = generateToken(user._id, user.role);

      logger.info(`New user registered: ${user.email}`, { userId: user._id });

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          photo: user.photo || '',
        },
      });
    }
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Login user (patient or doctor)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      logger.warn(`Failed login attempt for non-existent user: ${email}`, { ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn(`Failed login attempt for user: ${email}`, { ip: req.ip, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      logger.warn(`Login attempt for deactivated account: ${email}`, { ip: req.ip, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    const token = generateToken(user._id, user.role);

    logger.info(`User logged in: ${user.email}`, { userId: user._id, role: user.role });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo || '',
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Login doctor
// @route   POST /api/auth/doctor/login
// @access  Public
const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email, role: 'doctor' }).select('+password');

    if (!user) {
      logger.warn(`Failed doctor login attempt for non-existent user: ${email}`, { ip: req.ip });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      logger.warn(`Failed doctor login attempt for user: ${email}`, { ip: req.ip, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      logger.warn(`Doctor login attempt for deactivated account: ${email}`, { ip: req.ip, userId: user._id });
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    const token = generateToken(user._id, user.role);

    logger.info(`Doctor logged in: ${user.email}`, { userId: user._id });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo || '',
      },
    });
  } catch (error) {
    logger.error(`Doctor login error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        photo: user.photo || '',
      },
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`, { stack: error.stack, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

module.exports = {
  register,
  login,
  doctorLogin,
  getMe,
};