const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get doctor profile (public)
// @route   GET /api/doctor/profile
// @access  Public
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    let profile = await DoctorProfile.findOne({ doctor: doctor._id });
    
    // Return profile with doctor fallback data
    res.json({
      success: true,
      data: {
        doctorId: doctor._id,
        doctorName: profile?.doctorName || doctor.name || '',
        specialization: profile?.specialization || '',
        experienceYears: profile?.experienceYears || 0,
        qualifications: profile?.qualifications || '',
        about: profile?.about || '',
        profilePhoto: profile?.profilePhoto || doctor.photo || '',
        clinicName: profile?.clinicName || '',
        clinicAddress: profile?.clinicAddress || '',
        landmark: profile?.landmark || '',
        city: profile?.city || '',
        state: profile?.state || '',
        pincode: profile?.pincode || '',
        contactNumber: profile?.contactNumber || doctor.phone || '',
        whatsappNumber: profile?.whatsappNumber || '',
        consultationFeeMin: profile?.consultationFeeMin || 0,
        consultationFeeMax: profile?.consultationFeeMax || 0,
        clinicTiming: profile?.clinicTiming || '',
        googleMapsLink: profile?.googleMapsLink || '',
        services: profile?.services || [],
        testimonials: profile?.testimonials || [],
        seoTitle: profile?.seoTitle || '',
        seoDescription: profile?.seoDescription || '',
        seoKeywords: profile?.seoKeywords || '',
      },
    });
  } catch (error) {
    logger.error(`Get doctor profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor profile (protected)
// @route   PUT /api/doctor/profile
// @access  Private (Doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    // Find the doctor user
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    // Upsert the profile
    const updateData = { ...req.body };
    delete updateData.doctorId;
    delete updateData._id;

    const profile = await DoctorProfile.findOneAndUpdate(
      { doctor: doctor._id },
      { ...updateData, doctor: doctor._id },
      { upsert: true, new: true, runValidators: true }
    );

    // If name changed, update the User model too
    if (updateData.doctorName && updateData.doctorName !== doctor.name) {
      doctor.name = updateData.doctorName;
      await doctor.save();
    }
    // If profilePhoto changed, update the User model too
    if (updateData.profilePhoto && updateData.profilePhoto !== doctor.photo) {
      doctor.photo = updateData.profilePhoto;
      await doctor.save();
    }

    logger.info(`Doctor profile updated: ${doctor._id}`);

    res.json({ success: true, data: profile });
  } catch (error) {
    logger.error(`Update doctor profile error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get doctor services
// @route   GET /api/doctor/services
// @access  Public
const getDoctorServices = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    res.json({ success: true, data: profile?.services || [] });
  } catch (error) {
    logger.error(`Get doctor services error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor services
// @route   PUT /api/doctor/services
// @access  Private (Doctor)
const updateDoctorServices = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { services } = req.body;
    if (!Array.isArray(services)) {
      return res.status(400).json({ success: false, message: 'Services must be an array' });
    }

    const profile = await DoctorProfile.findOneAndUpdate(
      { doctor: doctor._id },
      { services },
      { upsert: true, new: true }
    );

    logger.info(`Doctor services updated: ${doctor._id}`);
    res.json({ success: true, data: profile.services });
  } catch (error) {
    logger.error(`Update doctor services error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get doctor testimonials
// @route   GET /api/doctor/testimonials
// @access  Public
const getDoctorTestimonials = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    res.json({ success: true, data: profile?.testimonials || [] });
  } catch (error) {
    logger.error(`Get doctor testimonials error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor testimonials
// @route   PUT /api/doctor/testimonials
// @access  Private (Doctor)
const updateDoctorTestimonials = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { testimonials } = req.body;
    if (!Array.isArray(testimonials)) {
      return res.status(400).json({ success: false, message: 'Testimonials must be an array' });
    }

    const profile = await DoctorProfile.findOneAndUpdate(
      { doctor: doctor._id },
      { testimonials },
      { upsert: true, new: true }
    );

    logger.info(`Doctor testimonials updated: ${doctor._id}`);
    res.json({ success: true, data: profile.testimonials });
  } catch (error) {
    logger.error(`Update doctor testimonials error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorServices,
  updateDoctorServices,
  getDoctorTestimonials,
  updateDoctorTestimonials,
};