const express = require('express');
const router = express.Router();
const {
  getPublicDoctorProfile,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  uploadProfilePhoto,
  uploadClinicImages,
  deleteClinicImage,
  addTestimonial,
  deleteTestimonial,
  getAvailableSlots,
  getDoctorStats,
} = require('../controllers/doctorProfileController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get('/public', getPublicDoctorProfile);
router.get('/stats', getDoctorStats);
router.get('/slots', validateQuery('getSlotsQuery'), getAvailableSlots);

// Protected routes (Doctor only)
router.use(protect, authorize('doctor'));

router.get('/me', getMyDoctorProfile);
router.put('/me', validate('updateDoctorProfile'), updateMyDoctorProfile);
router.post('/me/photo', upload.single('photo'), uploadProfilePhoto);
router.post('/me/gallery', upload.array('images', 10), uploadClinicImages);
router.delete('/me/gallery/:index', deleteClinicImage);
router.post('/me/testimonials', validate('addTestimonial'), addTestimonial);
router.delete('/me/testimonials/:index', deleteTestimonial);

module.exports = router;