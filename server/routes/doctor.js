const express = require('express');
const router = express.Router();
const {
  getDoctorDashboard,
  getDoctorAppointments,
  getDoctorCalendar,
  updateAppointment,
  rescheduleAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validation');

// All doctor routes are protected and require doctor role
router.use(protect, authorize('doctor'));

router.get('/dashboard', getDoctorDashboard);
router.get('/appointments', validateQuery('getAppointmentsQuery'), getDoctorAppointments);
router.get('/calendar', getDoctorCalendar);
router.put('/appointments/:id', validate('updateAppointment'), updateAppointment);
router.patch('/reschedule/:id', validate('rescheduleAppointment'), rescheduleAppointment);
router.patch('/complete/:id', completeAppointment);
router.patch('/cancel/:id', cancelAppointment);
router.delete('/delete/:id', deleteAppointment);

module.exports = router;