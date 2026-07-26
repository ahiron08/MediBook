const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { uploadImage, deleteImage } = require('../utils/cloudinary');
const upload = require('../middleware/upload');
const logger = require('../utils/logger');

// @desc    Get doctor profile (public)
// @route   GET /api/doctor/profile
// @access  Public
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ isAvailable: true })
      .populate('user', 'email phone')
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    logger.error(`Get doctor profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor profile',
    });
  }
};

// @desc    Get doctor profile for admin
// @route   GET /api/doctor/admin/profile
// @access  Private (Admin only)
const getDoctorProfileAdmin = async (req, res) => {
  try {
    const doctor = await Doctor.findOne()
      .populate('user', 'email phone role')
      .lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    logger.error(`Get doctor profile admin error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching doctor profile',
    });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctor/admin/profile
// @access  Private (Admin only)
const createDoctorProfile = async (req, res) => {
  try {
    const existingDoctor = await Doctor.findOne();
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists',
      });
    }

    const doctor = await Doctor.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    logger.error(`Create doctor profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error creating doctor profile',
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctor/admin/profile
// @access  Private (Admin only)
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    Object.assign(doctor, req.body);
    await doctor.save();

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    logger.error(`Update doctor profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating doctor profile',
    });
  }
};

// @desc    Upload doctor profile photo
// @route   POST /api/doctor/admin/profile/photo
// @access  Private (Admin only)
const uploadProfilePhoto = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    // Delete old photo if exists
    if (doctor.profilePhotoPublicId) {
      await deleteImage(doctor.profilePhotoPublicId);
    }

    // Upload new photo
    const result = await uploadImage(req.file.buffer, 'doctor-profile');

    doctor.profilePhoto = result.url;
    doctor.profilePhotoPublicId = result.publicId;
    await doctor.save();

    logger.info(`Doctor profile photo uploaded: ${doctor._id}`);

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        profilePhoto: result.url,
      },
    });
  } catch (error) {
    logger.error(`Upload profile photo error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error uploading profile photo',
    });
  }
};

// @desc    Delete doctor profile photo
// @route   DELETE /api/doctor/admin/profile/photo
// @access  Private (Admin only)
const deleteProfilePhoto = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    if (!doctor.profilePhotoPublicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile photo to delete',
      });
    }

    await deleteImage(doctor.profilePhotoPublicId);

    doctor.profilePhoto = '';
    doctor.profilePhotoPublicId = '';
    await doctor.save();

    logger.info(`Doctor profile photo deleted: ${doctor._id}`);

    res.json({
      success: true,
      message: 'Profile photo deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete profile photo error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting profile photo',
    });
  }
};

// @desc    Upload clinic image
// @route   POST /api/doctor/admin/gallery/upload
// @access  Private (Admin only)
const uploadClinicImage = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    const result = await uploadImage(req.file.buffer, 'clinic-gallery');

    doctor.clinicImages.push({
      url: result.url,
      publicId: result.publicId,
      caption: req.body.caption || '',
    });

    await doctor.save();

    logger.info(`Clinic image uploaded: ${result.publicId}`);

    res.status(201).json({
      success: true,
      message: 'Clinic image uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    logger.error(`Upload clinic image error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error uploading clinic image',
    });
  }
};

// @desc    Delete clinic image
// @route   DELETE /api/doctor/admin/gallery/:publicId
// @access  Private (Admin only)
const deleteClinicImage = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const imageIndex = doctor.clinicImages.findIndex(
      (img) => img.publicId === req.params.publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    // Delete from Cloudinary
    await deleteImage(req.params.publicId);

    // Remove from array
    doctor.clinicImages.splice(imageIndex, 1);
    await doctor.save();

    logger.info(`Clinic image deleted: ${req.params.publicId}`);

    res.json({
      success: true,
      message: 'Clinic image deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete clinic image error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting clinic image',
    });
  }
};

// @desc    Add testimonial
// @route   POST /api/doctor/admin/testimonials
// @access  Private (Admin only)
const addTestimonial = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const testimonial = {
      ...req.body,
      date: req.body.date || new Date(),
    };

    doctor.testimonials.push(testimonial);
    await doctor.save();

    // Update statistics
    await updateDoctorStatistics(doctor._id);

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: testimonial,
    });
  } catch (error) {
    logger.error(`Add testimonial error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error adding testimonial',
    });
  }
};

// @desc    Update testimonial
// @route   PUT /api/doctor/admin/testimonials/:testimonialId
// @access  Private (Admin only)
const updateTestimonial = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const testimonial = doctor.testimonials.id(req.params.testimonialId);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    Object.assign(testimonial, req.body);
    await doctor.save();

    // Update statistics
    await updateDoctorStatistics(doctor._id);

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    logger.error(`Update testimonial error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating testimonial',
    });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/doctor/admin/testimonials/:testimonialId
// @access  Private (Admin only)
const deleteTestimonial = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const testimonial = doctor.testimonials.id(req.params.testimonialId);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    doctor.testimonials.pull(req.params.testimonialId);
    await doctor.save();

    // Update statistics
    await updateDoctorStatistics(doctor._id);

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete testimonial error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting testimonial',
    });
  }
};

// @desc    Add FAQ
// @route   POST /api/doctor/admin/faqs
// @access  Private (Admin only)
const addFaq = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    doctor.faqs.push(req.body);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'FAQ added successfully',
    });
  } catch (error) {
    logger.error(`Add FAQ error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error adding FAQ',
    });
  }
};

// @desc    Update FAQ
// @route   PUT /api/doctor/admin/faqs/:faqId
// @access  Private (Admin only)
const updateFaq = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const faq = doctor.faqs.id(req.params.faqId);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    Object.assign(faq, req.body);
    await doctor.save();

    res.json({
      success: true,
      message: 'FAQ updated successfully',
    });
  } catch (error) {
    logger.error(`Update FAQ error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating FAQ',
    });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/doctor/admin/faqs/:faqId
// @access  Private (Admin only)
const deleteFaq = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    const faq = doctor.faqs.id(req.params.faqId);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    doctor.faqs.pull(req.params.faqId);
    await doctor.save();

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete FAQ error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error deleting FAQ',
    });
  }
};

// @desc    Update doctor statistics
// @route   POST /api/doctor/admin/update-statistics
// @access  Private (Admin only)
const updateDoctorStatistics = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    // Calculate average rating and total reviews
    if (doctor.testimonials.length > 0) {
      const totalRating = doctor.testimonials.reduce((sum, t) => sum + t.rating, 0);
      doctor.averageRating = (totalRating / doctor.testimonials.length).toFixed(1);
      doctor.totalReviews = doctor.testimonials.length;
    } else {
      doctor.averageRating = 0;
      doctor.totalReviews = 0;
    }

    await doctor.save();

    res.json({
      success: true,
      data: {
        averageRating: doctor.averageRating,
        totalReviews: doctor.totalReviews,
      },
    });
  } catch (error) {
    logger.error(`Update statistics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error updating statistics',
    });
  }
};

// @desc    Get doctor statistics
// @route   GET /api/doctor/admin/statistics
// @access  Private (Admin only)
const getDoctorStatistics = async (req, res) => {
  try {
    const doctor = await Doctor.findOne();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    res.json({
      success: true,
      data: {
        totalReviews: doctor.totalReviews,
        averageRating: doctor.averageRating,
        totalServices: doctor.services.length,
        totalTestimonials: doctor.testimonials.length,
        totalFAQs: doctor.faqs.length,
        totalGalleryImages: doctor.clinicImages.length,
      },
    });
  } catch (error) {
    logger.error(`Get statistics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
    });
  }
};

module.exports = {
  getDoctorProfile,
  getDoctorProfileAdmin,
  createDoctorProfile,
  updateDoctorProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  uploadClinicImage,
  deleteClinicImage,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  addFaq,
  updateFaq,
  deleteFaq,
  updateDoctorStatistics,
  getDoctorStatistics,
};