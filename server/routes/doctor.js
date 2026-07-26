const express = require('express');
const router = express.Router();
const {
  getDoctorProfile,
  getDoctorProfileAdmin,
  createDoctorProfile,
  updateDoctorProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadClinicImage,
  deleteClinicImage,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  addFaq,
  updateFaq,
  deleteFaq,
  updateDoctorStatistics,
  getDoctorStatistics,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/profile', getDoctorProfile);

// Admin routes
router.get('/admin/profile', protect, authorize('admin'), getDoctorProfileAdmin);
router.post('/admin/profile', protect, authorize('admin'), createDoctorProfile);
router.put('/admin/profile', protect, authorize('admin'), updateDoctorProfile);

// Profile photo routes
router.post('/admin/profile/photo', protect, authorize('admin'), upload.single('photo'), uploadProfilePhoto);
router.delete('/admin/profile/photo', protect, authorize('admin'), deleteProfilePhoto);

// Gallery routes
router.post('/admin/gallery/upload', protect, authorize('admin'), upload.single('image'), uploadClinicImage);
router.delete('/admin/gallery/:publicId', protect, authorize('admin'), deleteClinicImage);

// Testimonial routes
router.post('/admin/testimonials', protect, authorize('admin'), addTestimonial);
router.put('/admin/testimonials/:testimonialId', protect, authorize('admin'), updateTestimonial);
router.delete('/admin/testimonials/:testimonialId', protect, authorize('admin'), deleteTestimonial);

// FAQ routes
router.post('/admin/faqs', protect, authorize('admin'), addFaq);
router.put('/admin/faqs/:faqId', protect, authorize('admin'), updateFaq);
router.delete('/admin/faqs/:faqId', protect, authorize('admin'), deleteFaq);

// Statistics routes
router.post('/admin/update-statistics', protect, authorize('admin'), updateDoctorStatistics);
router.get('/admin/statistics', protect, authorize('admin'), getDoctorStatistics);

module.exports = router;