const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const logger = require('../utils/logger');
const cloudinary = require('../utils/cloudinary');

// @desc    Get doctor profile (public)
// @route   GET /api/doctor-profile/profile
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
        languagesSpoken: profile?.languagesSpoken || [],
        education: profile?.education || [],
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
        workingDays: profile?.workingDays || '',
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
// @route   PUT /api/doctor-profile/profile
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

// @desc    Upload doctor profile photo
// @route   POST /api/doctor-profile/upload
// @access  Private (Doctor)
const uploadProfilePhoto = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Upload to Cloudinary using buffer
    const result = await cloudinary.uploadImage(req.file.buffer, 'doctor-profiles');

    const imageUrl = result.url;

    // Update profile with new photo URL
    const profile = await DoctorProfile.findOneAndUpdate(
      { doctor: doctor._id },
      { profilePhoto: imageUrl, doctor: doctor._id },
      { upsert: true, new: true }
    );

    // Also update User model
    doctor.photo = imageUrl;
    await doctor.save();

    logger.info(`Profile photo uploaded: ${doctor._id}`);

    res.json({ success: true, data: { profilePhoto: imageUrl } });
  } catch (error) {
    logger.error(`Upload profile photo error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
};

// @desc    Get doctor services
// @route   GET /api/doctor-profile/services
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

// @desc    Add doctor service
// @route   POST /api/doctor-profile/services
// @access  Private (Doctor)
const addDoctorService = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { name, description, fee } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Service name is required' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    const newService = {
      _id: new Date().getTime().toString(),
      name,
      description: description || '',
      fee: fee || null,
    };

    if (!profile) {
      // Create new profile with service
      const newProfile = await DoctorProfile.create({
        doctor: doctor._id,
        services: [newService],
      });
      return res.json({ success: true, data: newProfile.services });
    }

    profile.services.push(newService);
    await profile.save();

    logger.info(`Service added: ${doctor._id}`);
    res.json({ success: true, data: profile.services });
  } catch (error) {
    logger.error(`Add service error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor service
// @route   PUT /api/doctor-profile/services/:id
// @access  Private (Doctor)
const updateDoctorService = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { id } = req.params;
    const { name, description, fee } = req.body;

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const serviceIndex = profile.services.findIndex(s => s._id.toString() === id);
    if (serviceIndex === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    profile.services[serviceIndex] = {
      ...profile.services[serviceIndex],
      name: name || profile.services[serviceIndex].name,
      description: description !== undefined ? description : profile.services[serviceIndex].description,
      fee: fee !== undefined ? fee : profile.services[serviceIndex].fee,
    };

    await profile.save();

    logger.info(`Service updated: ${id}`);
    res.json({ success: true, data: profile.services });
  } catch (error) {
    logger.error(`Update service error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete doctor service
// @route   DELETE /api/doctor-profile/services/:id
// @access  Private (Doctor)
const deleteDoctorService = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { id } = req.params;

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.services = profile.services.filter(s => s._id.toString() !== id);
    await profile.save();

    logger.info(`Service deleted: ${id}`);
    res.json({ success: true, data: profile.services });
  } catch (error) {
    logger.error(`Delete service error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get doctor testimonials
// @route   GET /api/doctor-profile/testimonials
// @access  Public
const getDoctorTestimonials = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    // Only return visible testimonials for public
    const visibleTestimonials = profile?.testimonials?.filter(t => t.visible) || [];
    res.json({ success: true, data: visibleTestimonials });
  } catch (error) {
    logger.error(`Get doctor testimonials error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all doctor testimonials (including hidden)
// @route   GET /api/doctor-profile/testimonials/all
// @access  Private (Doctor)
const getAllDoctorTestimonials = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    res.json({ success: true, data: profile?.testimonials || [] });
  } catch (error) {
    logger.error(`Get all testimonials error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add doctor testimonial
// @route   POST /api/doctor-profile/testimonials
// @access  Private (Doctor)
const addDoctorTestimonial = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { patientName, rating, review, visible } = req.body;
    if (!patientName || !rating) {
      return res.status(400).json({ success: false, message: 'Patient name and rating are required' });
    }

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    const newTestimonial = {
      _id: new Date().getTime().toString(),
      patientName,
      rating: parseInt(rating),
      review: review || '',
      date: new Date(),
      visible: visible !== undefined ? visible : true,
    };

    if (!profile) {
      // Create new profile with testimonial
      const newProfile = await DoctorProfile.create({
        doctor: doctor._id,
        testimonials: [newTestimonial],
      });
      return res.json({ success: true, data: newProfile.testimonials });
    }

    profile.testimonials.push(newTestimonial);
    await profile.save();

    logger.info(`Testimonial added: ${doctor._id}`);
    res.json({ success: true, data: profile.testimonials });
  } catch (error) {
    logger.error(`Add testimonial error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update doctor testimonial
// @route   PUT /api/doctor-profile/testimonials/:id
// @access  Private (Doctor)
const updateDoctorTestimonial = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { id } = req.params;
    const { patientName, rating, review, visible } = req.body;

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    const testimonialIndex = profile.testimonials.findIndex(t => t._id.toString() === id);
    if (testimonialIndex === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    profile.testimonials[testimonialIndex] = {
      ...profile.testimonials[testimonialIndex],
      patientName: patientName || profile.testimonials[testimonialIndex].patientName,
      rating: rating !== undefined ? parseInt(rating) : profile.testimonials[testimonialIndex].rating,
      review: review !== undefined ? review : profile.testimonials[testimonialIndex].review,
      visible: visible !== undefined ? visible : profile.testimonials[testimonialIndex].visible,
    };

    await profile.save();

    logger.info(`Testimonial updated: ${id}`);
    res.json({ success: true, data: profile.testimonials });
  } catch (error) {
    logger.error(`Update testimonial error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete doctor testimonial
// @route   DELETE /api/doctor-profile/testimonials/:id
// @access  Private (Doctor)
const deleteDoctorTestimonial = async (req, res) => {
  try {
    const doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'No doctor found' });
    }

    const { id } = req.params;

    const profile = await DoctorProfile.findOne({ doctor: doctor._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.testimonials = profile.testimonials.filter(t => t._id.toString() !== id);
    await profile.save();

    logger.info(`Testimonial deleted: ${id}`);
    res.json({ success: true, data: profile.testimonials });
  } catch (error) {
    logger.error(`Delete testimonial error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  uploadProfilePhoto,
  getDoctorServices,
  addDoctorService,
  updateDoctorService,
  deleteDoctorService,
  getDoctorTestimonials,
  getAllDoctorTestimonials,
  addDoctorTestimonial,
  updateDoctorTestimonial,
  deleteDoctorTestimonial,
};