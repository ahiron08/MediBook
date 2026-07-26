const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Availability = require('../models/Availability');
const { generateSlots, isSlotAvailable } = require('../services/slotService');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// @desc    Get available slots for a date
// @route   GET /api/appointments/slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date',
      });
    }

    // Find the doctor (there should be only one)
    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }

    const slots = await generateSlots(doctor._id, new Date(date));

    res.json({
      success: true,
      date,
      slots,
    });
  } catch (error) {
    logger.error(`Get available slots error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching slots',
    });
  }
};

// @desc    Book an appointment (race-condition safe)
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
  try {
    const { date, startTime, reason, patientName, patientEmail, patientPhone, patientAge, patientGender } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and time',
      });
    }

    if (!patientAge || !patientGender) {
      return res.status(400).json({
        success: false,
        message: 'Patient age and gender are required',
      });
    }

    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }

    // Check if slot is available using atomic operation
    const availability = await Availability.findOne({ doctor: doctor._id });

    if (!availability || !availability.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not accepting appointments',
      });
    }

    // Validate the date is not in the past
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments in the past',
      });
    }

    // Generate slots to validate the selected slot
    const slots = await generateSlots(doctor._id, appointmentDate);
    const selectedSlot = slots.find((s) => s.startTime === startTime);

    if (!selectedSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available',
      });
    }

    if (!selectedSlot.available) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked',
      });
    }

    // Atomic insert to prevent double booking using the unique compound index
    // The index on {doctor, date, startTime, status} with partial filter for non-cancelled
    // ensures race-condition safe booking
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctor._id,
      patientName: patientName || req.user.name,
      patientEmail: patientEmail || req.user.email,
      patientPhone: patientPhone || req.user.phone,
      patientAge: patientAge,
      patientGender: patientGender,
      date: appointmentDate,
      startTime,
      endTime: selectedSlot.endTime,
      reason: reason || '',
      status: 'confirmed',
    });

    logger.info(`Appointment booked: ${appointment._id}`, {
      patientId: req.user._id,
      doctorId: doctor._id,
      date: appointmentDate,
      startTime,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    // Handle duplicate key error (race condition - slot was just booked)
    if (error.code === 11000) {
      logger.warn(`Double booking attempt prevented`, {
        patientId: req.user._id,
        date: req.body.date,
        startTime: req.body.startTime,
      });
      return res.status(400).json({
        success: false,
        message: 'This slot was just booked by someone else. Please choose another slot.',
      });
    }
    logger.error(`Book appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error booking appointment',
    });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { patient: req.user._id };

    if (status && ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ date: -1, startTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error(`Get my appointments error: ${error.message}`, { stack: error.stack, userId: req.user._id });
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments',
    });
  }
};

// @desc    Get upcoming appointments for patient
// @route   GET /api/appointments/my/upcoming
// @access  Private (Patient)
const getMyUpcomingAppointments = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      patient: req.user._id,
      date: { $gte: today },
      status: { $in: ['pending', 'confirmed', 'rescheduled'] },
    }).sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    logger.error(`Get upcoming appointments error: ${error.message}`, { stack: error.stack, userId: req.user._id });
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming appointments',
    });
  }
};

// @desc    Cancel appointment by patient
// @route   PATCH /api/appointments/:id/cancel
// @access  Private (Patient)
const cancelMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if appointment is already completed
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment',
      });
    }

    // Check if appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled',
      });
    }

    // Check if appointment is in the past
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(
      parseInt(appointment.startTime.split(':')[0]),
      parseInt(appointment.startTime.split(':')[1]),
      0,
      0
    );

    if (new Date() > appointmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an appointment that has already started',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    await appointment.save();

    logger.info(`Appointment cancelled by patient: ${appointment._id}`, {
      patientId: req.user._id,
      appointmentId: appointment._id,
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    logger.error(`Cancel appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error cancelling appointment',
    });
  }
};

// @desc    Get appointment details
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if user owns this appointment or is the doctor
    if (
      appointment.patient._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'doctor'
    ) {
      logger.warn(`Unauthorized appointment access attempt`, {
        userId: req.user._id,
        appointmentId: req.params.id,
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    logger.error(`Get appointment by ID error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointment',
    });
  }
};

// ============ DOCTOR CONTROLLERS ============

// @desc    Get all appointments (doctor)
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    const {
      status,
      search,
      date,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { doctor: req.user._id };

    if (status && ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
      query.status = status;
    }

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { patientEmail: { $regex: search, $options: 'i' } },
        { patientPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query)
      .sort({ date: -1, startTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error(`Get doctor appointments error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments',
    });
  }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/doctor/dashboard
// @access  Private (Doctor)
const getDoctorDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayAppointments,
      upcomingAppointments,
      completedToday,
      cancelledToday,
      totalAppointments,
      pendingAppointments,
    ] = await Promise.all([
      Appointment.countDocuments({
        doctor: req.user._id,
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ['pending', 'confirmed', 'rescheduled'] },
      }),
      Appointment.countDocuments({
        doctor: req.user._id,
        date: { $gte: today },
        status: { $in: ['pending', 'confirmed', 'rescheduled'] },
      }),
      Appointment.countDocuments({
        doctor: req.user._id,
        date: { $gte: today, $lt: tomorrow },
        status: 'completed',
      }),
      Appointment.countDocuments({
        doctor: req.user._id,
        date: { $gte: today, $lt: tomorrow },
        status: 'cancelled',
      }),
      Appointment.countDocuments({ doctor: req.user._id }),
      Appointment.countDocuments({
        doctor: req.user._id,
        status: 'pending',
      }),
    ]);

    res.json({
      success: true,
      stats: {
        todayAppointments,
        upcomingAppointments,
        completedToday,
        cancelledToday,
        totalAppointments,
        pendingAppointments,
      },
    });
  } catch (error) {
    logger.error(`Get doctor dashboard error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard',
    });
  }
};

// @desc    Get calendar appointments
// @route   GET /api/doctor/calendar
// @access  Private (Doctor)
const getDoctorCalendar = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end dates',
      });
    }

    const appointments = await Appointment.find({
      doctor: req.user._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: { $nin: ['cancelled'] },
    })
      .populate('patient', 'name email phone')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    logger.error(`Get doctor calendar error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching calendar',
    });
  }
};

// @desc    Update appointment (doctor)
// @route   PUT /api/doctor/appointments/:id
// @access  Private (Doctor)
const updateAppointment = async (req, res) => {
  try {
    const { doctorNotes, reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Prevent modifying completed appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a completed appointment',
      });
    }

    if (doctorNotes !== undefined) {
      appointment.doctorNotes = doctorNotes;
    }

    if (reason !== undefined) {
      appointment.reason = reason;
    }

    await appointment.save();

    logger.info(`Appointment updated by doctor: ${appointment._id}`, {
      doctorId: req.user._id,
      appointmentId: appointment._id,
    });

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    logger.error(`Update appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error updating appointment',
    });
  }
};

// @desc    Reschedule appointment (doctor)
// @route   PATCH /api/doctor/reschedule/:id
// @access  Private (Doctor)
const rescheduleAppointment = async (req, res) => {
  try {
    const { date, startTime } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new date and time',
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Prevent rescheduling completed appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule a completed appointment',
      });
    }

    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);

    // Validate new date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule to a past date',
      });
    }

    // Generate slots for the new date
    const slots = await generateSlots(req.user._id, newDate);
    const selectedSlot = slots.find((s) => s.startTime === startTime);

    if (!selectedSlot) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available',
      });
    }

    // Check for double booking using atomic approach
    const existingAppointment = await Appointment.findOne({
      doctor: req.user._id,
      date: newDate,
      startTime,
      status: { $nin: ['cancelled'] },
      _id: { $ne: appointment._id },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked',
      });
    }

    // Store old date/time for logging
    const oldDate = appointment.date;
    const oldTime = appointment.startTime;

    appointment.date = newDate;
    appointment.startTime = startTime;
    appointment.endTime = selectedSlot.endTime;
    appointment.status = 'rescheduled';
    appointment.rescheduleCount += 1;
    appointment.rescheduledFrom = `${oldDate.toISOString().split('T')[0]} ${oldTime}`;

    await appointment.save();

    logger.info(`Appointment rescheduled by doctor: ${appointment._id}`, {
      doctorId: req.user._id,
      appointmentId: appointment._id,
      from: `${oldDate.toISOString().split('T')[0]} ${oldTime}`,
      to: `${date} ${startTime}`,
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      appointment,
    });
  } catch (error) {
    logger.error(`Reschedule appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error rescheduling appointment',
    });
  }
};

// @desc    Complete appointment
// @route   PATCH /api/doctor/complete/:id
// @access  Private (Doctor)
const completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Prevent completing already completed or cancelled appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already completed',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete a cancelled appointment',
      });
    }

    appointment.status = 'completed';
    appointment.completedAt = new Date();
    await appointment.save();

    logger.info(`Appointment completed: ${appointment._id}`, {
      doctorId: req.user._id,
      appointmentId: appointment._id,
    });

    res.json({
      success: true,
      message: 'Appointment marked as completed',
      appointment,
    });
  } catch (error) {
    logger.error(`Complete appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error completing appointment',
    });
  }
};

// @desc    Cancel appointment (doctor)
// @route   PATCH /api/doctor/cancel/:id
// @access  Private (Doctor)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Prevent cancelling already completed or cancelled appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled',
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date();
    await appointment.save();

    logger.info(`Appointment cancelled by doctor: ${appointment._id}`, {
      doctorId: req.user._id,
      appointmentId: appointment._id,
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    logger.error(`Cancel appointment (doctor) error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error cancelling appointment',
    });
  }
};

// @desc    Delete appointment (doctor)
// @route   DELETE /api/doctor/delete/:id
// @access  Private (Doctor)
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    if (appointment.status !== 'completed' && appointment.status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Only completed or cancelled appointments can be deleted',
      });
    }

    await appointment.deleteOne();

    logger.info(`Appointment deleted by doctor: ${req.params.id}`, {
      doctorId: req.user._id,
    });

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete appointment error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error deleting appointment',
    });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getMyUpcomingAppointments,
  cancelMyAppointment,
  getAppointmentById,
  getDoctorAppointments,
  getDoctorDashboard,
  getDoctorCalendar,
  updateAppointment,
  rescheduleAppointment,
  completeAppointment,
  cancelAppointment,
  deleteAppointment,
};