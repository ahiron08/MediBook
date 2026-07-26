const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorServices,
  updateDoctorServices,
  getDoctorTestimonials,
  updateDoctorTestimonials,
} = require('../controllers/doctorProfileController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/profile', getDoctorProfile);
router.get('/services', getDoctorServices);
router.get('/testimonials', getDoctorTestimonials);

// Protected routes (doctor only)
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.put('/services', protect, authorize('doctor'), updateDoctorServices);
router.put('/testimonials', protect, authorize('doctor'), updateDoctorTestimonials);

module.exports = router;