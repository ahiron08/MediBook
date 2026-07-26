const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getMyUpcomingAppointments,
  cancelMyAppointment,
  getAppointmentById,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateQuery, validateParams } = require('../middleware/validation');

// Public route
router.get('/slots', validateQuery('setAvailability'), getAvailableSlots);

// Protected patient routes with validation
router.get('/my', protect, authorize('patient'), validateQuery('getAppointmentsQuery'), getMyAppointments);
router.get('/my/upcoming', protect, authorize('patient'), getMyUpcomingAppointments);
router.post('/', protect, authorize('patient'), validate('bookAppointment'), bookAppointment);
router.patch('/:id/cancel', protect, authorize('patient'), validateParams('cancelAppointment'), cancelMyAppointment);
router.get('/:id', protect, validateParams('getAppointmentById'), getAppointmentById);

module.exports = router;