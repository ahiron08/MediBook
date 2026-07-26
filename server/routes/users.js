const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, deleteAccount, uploadPhoto, deletePhoto } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const upload = require('../middleware/upload');

router.put('/me', protect, validate('updateProfile'), updateProfile);
router.put('/password', protect, validate('changePassword'), changePassword);
router.delete('/me', protect, deleteAccount);

// Doctor photo routes
router.post('/me/photo', protect, authorize('doctor'), upload.single('photo'), uploadPhoto);
router.delete('/me/photo', protect, authorize('doctor'), deletePhoto);

module.exports = router;
