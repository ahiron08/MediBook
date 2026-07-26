const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    fee: { type: Number, default: null },
  },
  { _id: true }
);

const testimonialSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, trim: true, default: '' },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Doctor info
    doctorName: { type: String, trim: true, default: '' },
    specialization: { type: String, trim: true, default: '' },
    experienceYears: { type: Number, default: 0 },
    qualifications: { type: String, trim: true, default: '' },
    about: { type: String, trim: true, default: '' },
    profilePhoto: { type: String, default: '' },

    // Clinic info
    clinicName: { type: String, trim: true, default: '' },
    clinicAddress: { type: String, trim: true, default: '' },
    landmark: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    contactNumber: { type: String, trim: true, default: '' },
    whatsappNumber: { type: String, trim: true, default: '' },
    consultationFeeMin: { type: Number, default: 0 },
    consultationFeeMax: { type: Number, default: 0 },
    clinicTiming: { type: String, trim: true, default: '' },
    googleMapsLink: { type: String, trim: true, default: '' },

    // Services
    services: [serviceSchema],

    // Testimonials
    testimonials: [testimonialSchema],

    // SEO
    seoTitle: { type: String, trim: true, default: '' },
    seoDescription: { type: String, trim: true, default: '' },
    seoKeywords: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);