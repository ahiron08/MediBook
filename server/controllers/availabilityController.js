const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get doctor availability
// @route   GET /api/availability
// @access  Public
const getAvailability = async (req, res) => {
  try {
    let doctorId = req.user?._id;
    
    if (!doctorId) {
      const doctor = await User.findOne({ role: 'doctor' });
      if (doctor) {
        doctorId = doctor._id;
      }
    }
    
    if (!doctorId) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }
    
    let availability = await Availability.findOne({ doctor: doctorId });

    if (!availability) {
      // Return default availability if none set
      availability = {
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        workingHours: { start: '09:00', end: '18:00' },
        lunchBreak: { start: '13:00', end: '14:00' },
        appointmentDuration: 30,
        bufferBetweenAppointments: 0,
        unavailableDates: [],
        isActive: true,
      };
      
      // Only create if user is doctor
      if (req.user && req.user.role === 'doctor') {
        availability = await Availability.create({
          doctor: req.user._id,
          ...availability,
        });
      }
    }

    res.json({
      success: true,
      availability,
    });
  } catch (error) {
    logger.error(`Get availability error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching availability',
    });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/availability
// @access  Private (Doctor)
const updateAvailability = async (req, res) => {
  try {
    const {
      workingDays,
      workingHours,
      lunchBreak,
      appointmentDuration,
      bufferBetweenAppointments,
      unavailableDates,
      isActive,
    } = req.body;

    // Check if changing duration will affect existing appointments
    if (appointmentDuration) {
      const existingAppointments = await Appointment.countDocuments({
        doctor: req.user._id,
        status: { $in: ['pending', 'confirmed', 'rescheduled'] },
      });

      if (existingAppointments > 0) {
        logger.warn(`Duration change with ${existingAppointments} active appointments`, {
          doctorId: req.user._id,
        });
      }
    }

    const availability = await Availability.findOneAndUpdate(
      { doctor: req.user._id },
      {
        ...(workingDays && { workingDays }),
        ...(workingHours && { workingHours }),
        ...(lunchBreak && { lunchBreak }),
        ...(appointmentDuration && { appointmentDuration }),
        ...(bufferBetweenAppointments !== undefined && { bufferBetweenAppointments }),
        ...(unavailableDates !== undefined && { unavailableDates }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true, upsert: true }
    );

    logger.info(`Availability updated by doctor: ${req.user._id}`, { doctorId: req.user._id });

    res.json({
      success: true,
      availability,
      message: 'Availability updated successfully. Note: Existing appointments remain unchanged.',
    });
  } catch (error) {
    logger.error(`Update availability error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error updating availability',
    });
  }
};

// @desc    Add unavailable dates
// @route   POST /api/availability/unavailable-dates
// @access  Private (Doctor)
const addUnavailableDates = async (req, res) => {
  try {
    const { dates, reason } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of dates',
      });
    }

    const availability = await Availability.findOne({ doctor: req.user._id });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found. Please set up availability first.',
      });
    }

    // Check if any dates have existing appointments
    const existingAppointments = await Appointment.find({
      doctor: req.user._id,
      date: {
        $in: dates.map((d) => {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          return date;
        }),
      },
      status: { $in: ['pending', 'confirmed', 'rescheduled'] },
    });

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot block dates with ${existingAppointments.length} existing appointment(s). Please reschedule or cancel them first.`,
        conflictingAppointments: existingAppointments,
      });
    }

    // Add new unavailable dates
    const newDates = dates.map((d) => ({
      date: new Date(d),
      reason: reason || 'Unavailable',
    }));

    // Filter out duplicates
    const existingDates = new Set(
      (availability.unavailableDates || []).map((ud) =>
        new Date(ud.date).toISOString().split('T')[0]
      )
    );

    const uniqueNewDates = newDates.filter(
      (nd) => !existingDates.has(new Date(nd.date).toISOString().split('T')[0])
    );

    availability.unavailableDates = [
      ...(availability.unavailableDates || []),
      ...uniqueNewDates,
    ];

    await availability.save();

    logger.info(`Unavailable dates added by doctor: ${req.user._id}`, {
      doctorId: req.user._id,
      count: uniqueNewDates.length,
    });

    res.json({
      success: true,
      availability,
      message: `${uniqueNewDates.length} date(s) marked as unavailable`,
    });
  } catch (error) {
    logger.error(`Add unavailable dates error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error adding unavailable dates',
    });
  }
};

// @desc    Remove unavailable dates
// @route   DELETE /api/availability/unavailable-dates
// @access  Private (Doctor)
const removeUnavailableDates = async (req, res) => {
  try {
    const { dates } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of dates to remove',
      });
    }

    const availability = await Availability.findOne({ doctor: req.user._id });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found',
      });
    }

    const datesToRemove = new Set(
      dates.map((d) => new Date(d).toISOString().split('T')[0])
    );

    availability.unavailableDates = (availability.unavailableDates || []).filter(
      (ud) => !datesToRemove.has(new Date(ud.date).toISOString().split('T')[0])
    );

    await availability.save();

    logger.info(`Unavailable dates removed by doctor: ${req.user._id}`, {
      doctorId: req.user._id,
      count: dates.length,
    });

    res.json({
      success: true,
      availability,
      message: `${dates.length} date(s) removed from unavailable dates`,
    });
  } catch (error) {
    logger.error(`Remove unavailable dates error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error removing unavailable dates',
    });
  }
};

module.exports = {
  getAvailability,
  updateAvailability,
  addUnavailableDates,
  removeUnavailableDates,
};