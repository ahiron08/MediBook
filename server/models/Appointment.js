const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientEmail: {
      type: String,
      required: [true, 'Patient email is required'],
      lowercase: true,
      trim: true,
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    patientAge: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150'],
    },
    patientGender: {
      type: String,
      required: [true, 'Patient gender is required'],
      enum: ['male', 'female', 'other'],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      default: '',
    },
    doctorNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'],
      default: 'pending',
    },
    rescheduleCount: {
      type: Number,
      default: 0,
    },
    rescheduledFrom: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent double booking
appointmentSchema.index(
  { doctor: 1, date: 1, startTime: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $nin: ['cancelled'] },
    },
  }
);

appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ patientEmail: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);