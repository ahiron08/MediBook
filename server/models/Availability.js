const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      validate: {
        validator: function (days) {
          const validDays = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
            'Saturday', 'Sunday',
          ];
          return days.every((day) => validDays.includes(day));
        },
        message: 'Invalid day provided',
      },
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
        required: true,
      },
      end: {
        type: String,
        default: '18:00',
        required: true,
      },
    },
    lunchBreak: {
      start: {
        type: String,
        default: '13:00',
      },
      end: {
        type: String,
        default: '14:00',
      },
    },
    appointmentDuration: {
      type: Number,
      enum: [15, 20, 30, 45, 60],
      default: 30,
    },
    bufferBetweenAppointments: {
      type: Number,
      default: 0,
    },
    unavailableDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
          default: 'Unavailable',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);