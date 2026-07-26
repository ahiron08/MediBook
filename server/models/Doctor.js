const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    // Basic Information
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
      maxlength: [100, 'Doctor name cannot exceed 100 characters'],
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    profilePhotoPublicId: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      maxlength: [200, 'Specialization cannot exceed 200 characters'],
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
      maxlength: [100, 'Experience cannot exceed 100 characters'],
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    about: {
      type: String,
      required: [true, 'About section is required'],
      maxlength: [2000, 'About cannot exceed 2000 characters'],
    },
    
    // Professional Details
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    medicalCouncil: {
      type: String,
      trim: true,
      default: '',
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    
    // Services
    services: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
          maxlength: [500, 'Service description cannot exceed 500 characters'],
        },
        fee: {
          type: Number,
          min: 0,
          default: 0,
        },
        duration: {
          type: String,
          trim: true,
          default: '30 minutes',
        },
        icon: {
          type: String,
          trim: true,
          default: '',
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    
    // Consultation Fees
    fees: {
      newConsultation: {
        type: Number,
        min: 0,
        default: 0,
      },
      followUpConsultation: {
        type: Number,
        min: 0,
        default: 0,
      },
      videoConsultation: {
        type: Number,
        min: 0,
        default: 0,
      },
      emergencyConsultation: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    
    // Clinic Information
    clinic: {
      name: {
        type: String,
        required: [true, 'Clinic name is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Clinic address is required'],
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
        default: '',
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      timing: {
        type: String,
        trim: true,
      },
      emergencyContact: {
        type: String,
        trim: true,
        default: '',
      },
    },
    
    // Clinic Timings
    timings: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true,
        },
        morningStart: {
          type: String,
          default: '',
        },
        morningEnd: {
          type: String,
          default: '',
        },
        eveningStart: {
          type: String,
          default: '',
        },
        eveningEnd: {
          type: String,
          default: '',
        },
        isClosed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    
    // Break Timings
    breakTimings: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    
    // Google Maps
    googleMapLink: {
      type: String,
      trim: true,
      default: '',
    },
    latitude: {
      type: String,
      trim: true,
      default: '',
    },
    longitude: {
      type: String,
      trim: true,
      default: '',
    },
    
    // Gallery
    clinicImages: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    
    // Testimonials
    testimonials: [
      {
        patientName: {
          type: String,
          required: true,
          trim: true,
        },
        patientPhoto: {
          type: String,
          default: '',
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          required: true,
          maxlength: [1000, 'Review cannot exceed 1000 characters'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        isAnonymous: {
          type: Boolean,
          default: false,
        },
        isVerified: {
          type: Boolean,
          default: true,
        },
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Appointment',
          default: null,
        },
      },
    ],
    
    // FAQ
    faqs: [
      {
        question: {
          type: String,
          required: true,
          trim: true,
        },
        answer: {
          type: String,
          required: true,
          maxlength: [1000, 'Answer cannot exceed 1000 characters'],
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    
    // Education
    education: [
      {
        degree: {
          type: String,
          required: true,
          trim: true,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    
    // Experience
    experience: [
      {
        position: {
          type: String,
          required: true,
          trim: true,
        },
        hospital: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    
    // Awards
    awards: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        year: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    
    // Special Interests
    specialInterests: [
      {
        type: String,
        trim: true,
      },
    ],
    
    // Social Links
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        default: '',
      },
      instagram: {
        type: String,
        trim: true,
        default: '',
      },
      twitter: {
        type: String,
        trim: true,
        default: '',
      },
      linkedin: {
        type: String,
        trim: true,
        default: '',
      },
      youtube: {
        type: String,
        trim: true,
        default: '',
      },
    },
    
    // SEO
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'Meta title cannot exceed 60 characters'],
        default: '',
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
        default: '',
      },
      keywords: {
        type: String,
        trim: true,
        default: '',
      },
      canonicalUrl: {
        type: String,
        trim: true,
        default: '',
      },
      ogTitle: {
        type: String,
        trim: true,
        default: '',
      },
      ogDescription: {
        type: String,
        trim: true,
        default: '',
      },
      ogImage: {
        type: String,
        default: '',
      },
      twitterCard: {
        type: String,
        trim: true,
        default: 'summary_large_image',
      },
    },
    
    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'on_leave', 'unavailable'],
      default: 'available',
    },
    
    // Vacation Dates
    vacationDates: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    
    // Doctor unavailable dates
    unavailableDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    
    // Statistics (computed fields)
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    
    // User reference (links to the doctor's user account)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isAvailable: 1 });
doctorSchema.index({ 'clinic.city': 1 });

module.exports = mongoose.model('Doctor', doctorSchema);