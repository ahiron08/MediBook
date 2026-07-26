const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

router.put('/me', protect, validate('updateProfile'), updateProfile);
router.put('/password', protect, validate('changePassword'), changePassword);
router.delete('/me', protect, deleteAccount);

module.exports = router;