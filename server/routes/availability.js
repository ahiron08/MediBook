const express = require('express');
const router = express.Router();
const {
  getAvailability,
  updateAvailability,
  addUnavailableDates,
  removeUnavailableDates,
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

// Public route - anyone can view availability
router.get('/', getAvailability);

// Protected doctor routes with validation
router.put('/', protect, authorize('doctor'), validate('updateAvailability'), updateAvailability);
router.post('/unavailable-dates', protect, authorize('doctor'), validate('addUnavailableDates'), addUnavailableDates);
router.delete('/unavailable-dates', protect, authorize('doctor'), validate('removeUnavailableDates'), removeUnavailableDates);

module.exports = router;