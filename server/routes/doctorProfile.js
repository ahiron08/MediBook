const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  updateDoctorProfile,
  uploadProfilePhoto,
  getDoctorServices,
  addDoctorService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorTestimonials,
  getAllDoctorTestimonials,
  addDoctorTestimonial,
  updateDoctorTestimonial,
  deleteDoctorTestimonial,
} = require('../controllers/doctorProfileController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/profile', getDoctorProfile);
router.get('/services', getDoctorServices);
router.get('/testimonials', getDoctorTestimonials);
router.get('/testimonials/all', protect, authorize('doctor'), getAllDoctorTestimonials);

// Protected routes (doctor only)
router.put('/profile', protect, authorize('doctor'), updateDoctorProfile);
router.post('/upload', protect, authorize('doctor'), upload.single('image'), uploadProfilePhoto);
router.post('/services', protect, authorize('doctor'), addDoctorService);
router.put('/services/:id', protect, authorize('doctor'), updateDoctorService);
router.delete('/services/:id', protect, authorize('doctor'), deleteDoctorService);
router.post('/testimonials', protect, authorize('doctor'), addDoctorTestimonial);
router.put('/testimonials/:id', protect, authorize('doctor'), updateDoctorTestimonial);
router.delete('/testimonials/:id', protect, authorize('doctor'), deleteDoctorTestimonial);

module.exports = router;