const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
];

/**
 * Generate available time slots for a given date
 */
const generateSlots = async (doctorId, date) => {
  const availability = await Availability.findOne({ doctor: doctorId });

  if (!availability || !availability.isActive) {
    return [];
  }

  const appointmentDate = new Date(date);
  appointmentDate.setHours(0, 0, 0, 0);

  // Check if date is in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) {
    return [];
  }

  // Check if it's an unavailable date
  const isUnavailable = availability.unavailableDates.some((ud) => {
    const udDate = new Date(ud.date);
    udDate.setHours(0, 0, 0, 0);
    return udDate.getTime() === appointmentDate.getTime();
  });

  if (isUnavailable) {
    return [];
  }

  // Check if it's a working day
  const dayName = DAY_NAMES[appointmentDate.getDay()];
  if (!availability.workingDays.includes(dayName)) {
    return [];
  }

  const duration = availability.appointmentDuration;
  const workStart = availability.workingHours.start;
  const workEnd = availability.workingHours.end;
  const lunchStart = availability.lunchBreak.start;
  const lunchEnd = availability.lunchBreak.end;

  // Parse times
  const [startHour, startMin] = workStart.split(':').map(Number);
  const [endHour, endMin] = workEnd.split(':').map(Number);
  const [lunchStartHour, lunchStartMin] = lunchStart.split(':').map(Number);
  const [lunchEndHour, lunchEndMin] = lunchEnd.split(':').map(Number);

  const slots = [];
  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const lunchStartMinutes = lunchStartHour * 60 + lunchStartMin;
  const lunchEndMinutes = lunchEndHour * 60 + lunchEndMin;

  // Get booked appointments for this date
  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    date: {
      $gte: appointmentDate,
      $lt: new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000),
    },
    status: { $nin: ['cancelled'] },
  });

  const bookedSlots = new Set();
  bookedAppointments.forEach((app) => {
    bookedSlots.add(app.startTime);
  });

  while (currentMinutes + duration <= endMinutes) {
    // Skip lunch break
    if (
      currentMinutes >= lunchStartMinutes &&
      currentMinutes < lunchEndMinutes
    ) {
      currentMinutes = lunchEndMinutes;
      continue;
    }

    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    const endSlotMinutes = currentMinutes + duration;
    const endHours = Math.floor(endSlotMinutes / 60);
    const endMinutesSlot = endSlotMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutesSlot).padStart(2, '0')}`;

    // Add all slots with availability status
    slots.push({
      startTime,
      endTime,
      available: !bookedSlots.has(startTime),
    });

    currentMinutes += duration;
  }

  return slots;
};

/**
 * Generate slots for a date range
 */
const generateSlotsForRange = async (doctorId, startDate, endDate) => {
  const slots = {};
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    slots[dateStr] = await generateSlots(doctorId, current);
    current.setDate(current.getDate() + 1);
  }

  return slots;
};

/**
 * Check if a time slot is available
 */
const isSlotAvailable = async (doctorId, date, startTime, excludeAppointmentId = null) => {
  const query = {
    doctor: doctorId,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    },
    startTime,
    status: { $nin: ['cancelled'] },
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const existing = await Appointment.findOne(query);
  return !existing;
};

module.exports = {
  generateSlots,
  generateSlotsForRange,
  isSlotAvailable,
};