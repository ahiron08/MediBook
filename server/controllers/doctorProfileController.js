const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const Availability = require('../models/Availability');
const cloudinary = require('../utils/cloudinary');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// @desc    Get public doctor profile
// @route   GET /api/doctor-profile/public
// @access  Public
const getPublicDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }

    let profile = await DoctorProfile.findOne({ doctor: doctor._id })
      .populate('doctor', 'name email phone photo role');

    // If no profile exists, create a basic one
    if (!profile) {
      profile = await DoctorProfile.create({
        doctor: doctor._id,
        specialization: 'General Physician',
        experience: '1+ Years',
        clinic: {
          name: 'Medical Clinic',
          address: 'Clinic Address',
          city: 'City',
          state: 'State',
          pincode: '000000',
          phone: doctor.phone,
          whatsapp: doctor.phone,
          email: doctor.email,
        },
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    logger.error(`Get public doctor profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor profile',
    });
  }
};

// @desc    Get doctor's own profile (for admin)
// @route   GET /api/doctor-profile/me
// @access  Private (Doctor)
const getMyDoctorProfile = async (req, res) => {
  try {
    let profile = await DoctorProfile.findOne({ doctor: req.user._id });

    // If no profile exists, create one
    if (!profile) {
      profile = await DoctorProfile.create({
        doctor: req.user._id,
        specialization: '',
        experience: '',
        clinic: {
          name: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          phone: req.user.phone || '',
          whatsapp: req.user.phone || '',
          email: req.user.email || '',
        },
      });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error) {
    logger.error(`Get my doctor profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctor-profile/me
// @access  Private (Doctor)
const updateMyDoctorProfile = async (req, res) => {
  try {
    const allowedFields = [
      'specialization',
      'experience',
      'gender',
      'languages',
      'about',
      'education',
      'specialInterests',
      'registrationNumber',
      'medicalCouncil',
      'qualifications',
      'experienceDetails',
      'achievements',
      'awards',
      'services',
      'fees',
      'consultationFeeRange',
      'clinic',
      'timings',
      'googleMap',
      'testimonials',
      'faqs',
      'seo',
      'socialLinks',
      'vacationDates',
      'isAvailable',
      'additionalInfo',
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    let profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    // Update clinic images if provided
    if (req.body.clinicImages) {
      updateData.clinicImages = req.body.clinicImages;
    }

    Object.assign(profile, updateData);
    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    logger.error(`Update doctor profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/doctor-profile/me/photo
// @access  Private (Doctor)
const uploadProfilePhoto = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    // Delete old photo if exists
    if (profile.profilePhotoPublicId) {
      await cloudinary.uploader.destroy(profile.profilePhotoPublicId);
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'doctor-profile',
          width: 800,
          height: 800,
          crop: 'fill',
          quality: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    profile.profilePhoto = result.secure_url;
    profile.profilePhotoPublicId = result.public_id;
    await profile.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      photo: result.secure_url,
    });
  } catch (error) {
    logger.error(`Upload profile photo error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error uploading photo',
    });
  }
};

// @desc    Upload clinic images
// @route   POST /api/doctor-profile/me/gallery
// @access  Private (Doctor)
const uploadClinicImages = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image',
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'clinic-gallery',
            quality: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });

      profile.clinicImages.push(result.secure_url);
      profile.clinicImagePublicIds.push(result.public_id);
      uploadedImages.push(result.secure_url);
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: uploadedImages,
    });
  } catch (error) {
    logger.error(`Upload clinic images error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error uploading images',
    });
  }
};

// @desc    Delete clinic image
// @route   DELETE /api/doctor-profile/me/gallery/:index
// @access  Private (Doctor)
const deleteClinicImage = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const index = parseInt(req.params.index);

    if (index < 0 || index >= profile.clinicImages.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image index',
      });
    }

    // Delete from Cloudinary
    if (profile.clinicImagePublicIds[index]) {
      await cloudinary.uploader.destroy(profile.clinicImagePublicIds[index]);
    }

    // Remove from array
    profile.clinicImages.splice(index, 1);
    profile.clinicImagePublicIds.splice(index, 1);
    await profile.save();

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete clinic image error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error deleting image',
    });
  }
};

// @desc    Add testimonial
// @route   POST /api/doctor-profile/me/testimonials
// @access  Private (Doctor)
const addTestimonial = async (req, res) => {
  try {
    const { patientName, isAnonymous, rating, review, isVerified, appointmentId } = req.body;

    if (!patientName || !rating || !review) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient name, rating, and review',
      });
    }

    const profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const testimonial = {
      patientName: isAnonymous ? 'Anonymous' : patientName,
      isAnonymous: isAnonymous || false,
      rating: parseInt(rating),
      review,
      date: new Date(),
      isVerified: isVerified || false,
      appointmentId: appointmentId || null,
    };

    profile.testimonials.push(testimonial);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      testimonial: profile.testimonials[profile.testimonials.length - 1],
    });
  } catch (error) {
    logger.error(`Add testimonial error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error adding testimonial',
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/doctor-profile/me/testimonials/:index
// @access  Private (Doctor)
const deleteTestimonial = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ doctor: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const index = parseInt(req.params.index);

    if (index < 0 || index >= profile.testimonials.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid testimonial index',
      });
    }

    profile.testimonials.splice(index, 1);
    await profile.save();

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete testimonial error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error deleting testimonial',
    });
  }
};

// @desc    Get available slots for booking
// @route   GET /api/doctor-profile/slots
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

    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });

    if (!profile || !profile.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available',
      });
    }

    // Check if date is in vacation
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    const isVacation = profile.vacationDates.some(
      (v) => new Date(v.date).toDateString() === appointmentDate.toDateString()
    );

    if (isVacation) {
      return res.json({
        success: true,
        date,
        slots: [],
        message: 'Doctor is on vacation',
      });
    }

    // Get availability settings
    const availability = await Availability.findOne({ doctor: doctor._id });

    if (!availability || !availability.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not accepting appointments',
      });
    }

    // Generate slots based on timings
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayTiming = profile.timings.find((t) => t.day === dayOfWeek);

    if (!dayTiming || !dayTiming.isWorking || dayTiming.slots.length === 0) {
      return res.json({
        success: true,
        date,
        slots: [],
        message: 'No working hours for this day',
      });
    }

    // Get existing appointments for this date
    const Appointment = require('../models/Appointment');
    const existingAppointments = await Appointment.find({
      doctor: doctor._id,
      date: appointmentDate,
      status: { $nin: ['cancelled'] },
    });

    // Generate time slots
    const slots = [];
    const slotDuration = availability.appointmentDuration || 30;

    for (const slot of dayTiming.slots) {
      const [startHour, startMinute] = slot.start.split(':').map(Number);
      const [endHour, endMinute] = slot.end.split(':').map(Number);

      let currentTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      while ( currentTime + slotDuration <= endTime) {
        const hours = Math.floor(currentTime / 60);
        const minutes = currentTime % 60;
        const slotStart = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const endSlotTime = currentTime + slotDuration;
        const endHours = Math.floor(endSlotTime / 60);
        const endMinutes = endSlotTime % 60;
        const slotEnd = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;

        // Check if slot is already booked
        const isBooked = existingAppointments.some(
          (apt) => apt.startTime === slotStart
        );

        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          available: !isBooked,
        });

        currentTime += slotDuration;
      }
    }

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

// @desc    Get doctor statistics
// @route   GET /api/doctor-profile/stats
// @access  Public
const getDoctorStats = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found',
      });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });

    if (!profile) {
      return res.json({
        success: true,
        stats: {
          experience: '0+ Years',
          totalPatients: 0,
          averageRating: 0,
          totalReviews: 0,
        },
      });
    }

    const Appointment = require('../models/Appointment');
    const totalPatients = await Appointment.distinct('patient', { doctor: doctor._id }).then(
      (patients) => patients.length
    );

    res.json({
      success: true,
      stats: {
        experience: profile.experience,
        totalPatients,
        averageRating: profile.averageRating,
        totalReviews: profile.totalReviews,
      },
    });
  } catch (error) {
    logger.error(`Get doctor stats error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
    });
  }
};

module.exports = {
  getPublicDoctorProfile,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  uploadProfilePhoto,
  uploadClinicImages,
  deleteClinicImage,
  addTestimonial,
  deleteTestimonial,
  getAvailableSlots,
  getDoctorStats,
};