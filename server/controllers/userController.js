const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    logger.info(`Profile updated for user: ${user._id}`, { userId: user._id });

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`, { stack: error.stack, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      logger.warn(`Failed password change attempt for user: ${req.user._id}`, { userId: req.user._id });
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${req.user._id}`, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`, { stack: error.stack, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
    });
  }
};

// @desc    Delete account (deactivate)
// @route   DELETE /api/users/me
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    if (req.user.role === 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'Doctor account cannot be deleted via API',
      });
    }

    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    logger.info(`Account deactivated: ${req.user._id}`, { userId: req.user._id });

    res.json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    logger.error(`Delete account error: ${error.message}`, { stack: error.stack, userId: req.user?._id });
    res.status(500).json({
      success: false,
      message: 'Server error deactivating account',
    });
  }
};

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount,
};