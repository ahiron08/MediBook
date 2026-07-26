const mongoose = require('mongoose');

const qualificationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    institution: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: ['degree', 'certification', 'fellowship', 'training'],
      default: 'degree',
    },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    hospital: {
      type: String,
      required: [true, 'Hospital/Clinic name is required'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      trim: true,
    },
    endDate: {
      type: String,
      trim: true,
      default: 'Present',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    fee: {
      type: String,
      trim: true,
      default: '',
    },
    duration: {
      type: String,
      trim: true,
      default: '',
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
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Fee type is required'],
      enum: ['new_consultation', 'follow_up', 'video_consultation', 'emergency'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const clinicTimingSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    isWorking: {
      type: Boolean,
      default: true,
    },
    slots: [
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
    ],
  },
  { _id: false }
);

const clinicInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    timing: {
      type: String,
      trim: true,
      default: '',
    },
    emergencyContact: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const googleMapSchema = new mongoose.Schema(
  {
    url: {
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
    embedUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    patientPhoto: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    keywords: {
      type: [String],
      default: [],
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
      trim: true,
      default: '',
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image', 'app', 'player'],
      default: 'summary_large_image',
    },
    structuredData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Please add a valid URL'],
    },
  },
  { _id: false }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor reference is required'],
      unique: true,
    },
    
    // Basic Information
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    profilePhotoPublicId: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    languages: {
      type: [String],
      default: ['English', 'Hindi'],
    },
    
    // About Section
    about: {
      type: String,
      trim: true,
      default: '',
    },
    education: {
      type: [String],
      default: [],
    },
    specialInterests: {
      type: [String],
      default: [],
    },
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
    
    // Qualifications
    qualifications: {
      type: [qualificationSchema],
      default: [],
    },
    
    // Experience
    experienceDetails: {
      type: [experienceSchema],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    
    // Services
    services: {
      type: [serviceSchema],
      default: [],
    },
    
    // Fees
    fees: {
      type: [feeSchema],
      default: [],
    },
    consultationFeeRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    
    // Clinic Information
    clinic: {
      type: clinicInfoSchema,
      required: [true, 'Clinic information is required'],
    },
    
    // Clinic Timings
    timings: {
      type: [clinicTimingSchema],
      default: [],
    },
    
    // Google Maps
    googleMap: {
      type: googleMapSchema,
      default: {},
    },
    
    // Gallery
    clinicImages: {
      type: [String],
      default: [],
    },
    clinicImagePublicIds: {
      type: [String],
      default: [],
    },
    
    // Testimonials
    testimonials: {
      type: [testimonialSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    
    // FAQ
    faqs: {
      type: [faqSchema],
      default: [],
    },
    
    // SEO
    seo: {
      type: seoSchema,
      default: {},
    },
    
    // Social Links
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },
    
    // Availability
    availability: {
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
        default: null,
      },
    },
    
    // Vacation Dates
    vacationDates: {
      type: [
        {
          date: {
            type: Date,
            required: true,
          },
          reason: {
            type: String,
            trim: true,
            default: 'Vacation',
          },
        },
      ],
      default: [],
    },
    
    // Status
    isAvailable: {
      type: Boolean,
      default: true,
    },
    
    // Additional Info
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
doctorProfileSchema.index({ doctor: 1 });
doctorProfileSchema.index({ isAvailable: 1 });
doctorProfileSchema.index({ specialization: 1 });

// Calculate average rating before saving
doctorProfileSchema.pre('save', function (next) {
  if (this.testimonials && this.testimonials.length > 0) {
    const totalRating = this.testimonials.reduce((sum, t) => sum + t.rating, 0);
    this.averageRating = parseFloat((totalRating / this.testimonials.length).toFixed(1));
    this.totalReviews = this.testimonials.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);