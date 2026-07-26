const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedDoctorProfile = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@medibook.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@medibook.com',
        password: hashedPassword,
        phone: '08861590803',
        role: 'admin',
        isActive: true,
      });
      console.log('Admin user created');
    }

    // Check if doctor profile already exists
    const existingProfile = await Doctor.findOne();
    if (existingProfile) {
      console.log('Doctor profile already exists. Skipping seed...');
      process.exit(0);
    }

    // Create doctor profile
    const doctorProfile = await Doctor.create({
      user: adminUser._id,
      doctorName: 'Gunamani Mahanta',
      specialization: 'Gynecologist & Obstetrician',
      experience: '26+ Years',
      qualifications: ['MBBS', 'DGO'],
      about: `Dr. Gunamani Mahanta is a Senior Gynecologist & Obstetrician with over 26 years of experience in women's health. She specializes in pregnancy care, infertility treatment, high-risk pregnancies, PCOS/PCOD management, menstrual disorders, and gynecological surgeries.

With her extensive experience and dedication to patient care, Dr. Mahanta has helped thousands of women achieve their dreams of motherhood and maintain optimal health. Her compassionate approach and expertise in the latest medical techniques make her one of the most trusted gynecologists in the region.

She believes in providing personalized care to each patient, taking the time to understand their unique needs and concerns. Her practice is equipped with modern facilities and technology to ensure the best possible outcomes for her patients.`,
      registrationNumber: 'ASMC/12345/2010',
      medicalCouncil: 'Assam Medical Council',
      languages: ['English', 'Hindi', 'Assamese', 'Bengali'],
      gender: 'female',
      specialInterests: [
        'High Risk Pregnancy',
        'Infertility Treatment',
        'PCOS/PCOD Management',
        'Menstrual Disorders',
        'Gynecological Surgery',
        'Antenatal Care',
        'Family Planning',
        'Women Health Consultation',
      ],
      profilePhoto: '',
      profilePhotoPublicId: '',
      services: [
        {
          name: 'Antenatal Care & Delivery',
          description: 'Comprehensive prenatal care and safe delivery services for expecting mothers',
          fee: 700,
          duration: '30 minutes',
          icon: '',
          order: 1,
        },
        {
          name: 'High Risk Pregnancy',
          description: 'Specialized care for high-risk pregnancies with advanced monitoring',
          fee: 800,
          duration: '45 minutes',
          icon: '',
          order: 2,
        },
        {
          name: 'Infertility Treatment',
          description: 'Diagnosis and treatment of infertility issues with modern techniques',
          fee: 1000,
          duration: '45 minutes',
          icon: '',
          order: 3,
        },
        {
          name: 'PCOS / PCOD Treatment',
          description: 'Comprehensive management of PCOS/PCOD with hormonal therapy and lifestyle guidance',
          fee: 600,
          duration: '30 minutes',
          icon: '',
          order: 4,
        },
        {
          name: 'Menstrual Disorders',
          description: 'Treatment for irregular periods, heavy bleeding, and other menstrual problems',
          fee: 500,
          duration: '30 minutes',
          icon: '',
          order: 5,
        },
        {
          name: 'Gynecological Surgery',
          description: 'Minimally invasive surgical procedures for various gynecological conditions',
          fee: 15000,
          duration: '2-3 hours',
          icon: '',
          order: 6,
        },
        {
          name: 'Family Planning',
          description: 'Contraceptive counseling and family planning services',
          fee: 500,
          duration: '20 minutes',
          icon: '',
          order: 7,
        },
        {
          name: 'Women Health Consultation',
          description: 'General women health checkups and consultations',
          fee: 500,
          duration: '30 minutes',
          icon: '',
          order: 8,
        },
      ],
      fees: {
        newConsultation: 700,
        followUpConsultation: 500,
        videoConsultation: 600,
        emergencyConsultation: 1000,
      },
      clinic: {
        name: 'Private Chamber',
        address: 'Hathigaon Main Road, Hatigaon, Guwahati, Assam - 781038',
        landmark: 'Near Hatigaon Chariali',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781038',
        phone: '08861590803',
        whatsapp: '08861590803',
        email: 'dr.gunamani@example.com',
        timing: 'Monday-Saturday: 10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM',
        emergencyContact: '08861590803',
      },
      timings: [
        {
          day: 'monday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'tuesday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'wednesday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'thursday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'friday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'saturday',
          morningStart: '10:00',
          morningEnd: '13:00',
          eveningStart: '17:00',
          eveningEnd: '20:00',
          isClosed: false,
        },
        {
          day: 'sunday',
          morningStart: '',
          morningEnd: '',
          eveningStart: '',
          eveningEnd: '',
          isClosed: true,
        },
      ],
      breakTimings: [],
      googleMapLink: 'https://maps.google.com/?q=Hatigaon,Guwahati,Assam',
      latitude: '26.1445',
      longitude: '91.7362',
      clinicImages: [],
      testimonials: [
        {
          patientName: 'Priya Sharma',
          patientPhoto: '',
          rating: 5,
          review: 'Dr. Mahanta is an excellent doctor. She handled my high-risk pregnancy with utmost care and professionalism. I had a safe delivery and I am very grateful to her.',
          date: new Date('2024-01-15'),
          isAnonymous: false,
          isVerified: true,
          appointmentId: null,
        },
        {
          patientName: 'Anonymous Patient',
          patientPhoto: '',
          rating: 5,
          review: 'Very good experience. Doctor is very polite and explains everything clearly. The clinic is also well-maintained.',
          date: new Date('2024-02-20'),
          isAnonymous: true,
          isVerified: true,
          appointmentId: null,
        },
        {
          patientName: 'Ritu Das',
          patientPhoto: '',
          rating: 4,
          review: 'Dr. Mahanta helped me with my PCOS treatment. Her advice and medication have really helped improve my condition. Highly recommended!',
          date: new Date('2024-03-10'),
          isAnonymous: false,
          isVerified: true,
          appointmentId: null,
        },
      ],
      faqs: [
        {
          question: 'Do I need a prior appointment?',
          answer: 'Yes, prior appointment is recommended to avoid waiting. You can book an appointment online through our website or call the clinic directly.',
          order: 1,
        },
        {
          question: 'Can I cancel or reschedule my appointment?',
          answer: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time. Please use the appointment management feature in your dashboard.',
          order: 2,
        },
        {
          question: 'Do you accept walk-in patients?',
          answer: 'Walk-in patients are accepted based on availability. However, we recommend booking an appointment in advance to guarantee your slot.',
          order: 3,
        },
        {
          question: 'How early should I arrive for my appointment?',
          answer: 'Please arrive 10-15 minutes before your scheduled appointment time to complete any necessary paperwork.',
          order: 4,
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept cash, UPI, and all major credit/debit cards. Payment is to be made at the clinic after your consultation.',
          order: 5,
        },
        {
          question: 'What should I bring to my first appointment?',
          answer: 'Please bring a valid ID, any previous medical records, and a list of current medications you are taking.',
          order: 6,
        },
      ],
      education: [
        {
          degree: 'MBBS',
          institution: 'Gauhati Medical College',
          year: '1995',
          description: 'Bachelor of Medicine and Bachelor of Surgery',
        },
        {
          degree: 'DGO',
          institution: 'All India Institute of Medical Sciences',
          year: '1999',
          description: 'Diploma in Obstetrics and Gynecology',
        },
      ],
      experience: [
        {
          position: 'Senior Gynecologist',
          hospital: 'Apollo Hospitals, Guwahati',
          duration: '2010 - Present',
          description: 'Leading gynecologist specializing in high-risk pregnancies and infertility treatments',
        },
        {
          position: 'Consultant Gynecologist',
          hospital: 'Gauhati Medical College',
          duration: '2005 - 2010',
          description: 'Provided comprehensive gynecological care and trained junior doctors',
        },
        {
          position: 'Resident Doctor',
          hospital: 'Assam Medical College',
          duration: '1998 - 2005',
          description: 'Completed residency in Obstetrics and Gynecology',
        },
      ],
      awards: [
        {
          title: 'Excellence in Women Healthcare',
          year: '2020',
          description: 'Awarded for outstanding contribution to women healthcare in Assam',
        },
        {
          title: 'Best Gynecologist Award',
          year: '2018',
          description: 'Recognized as the best gynecologist in Guwahati by Indian Medical Association',
        },
      ],
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
      },
      seo: {
        metaTitle: 'Dr. Gunamani Mahanta - Gynecologist & Obstetrician in Guwahati',
        metaDescription: 'Dr. Gunamani Mahanta is a senior gynecologist with 26+ years of experience in Guwahati, Assam. Specializes in high-risk pregnancy, infertility treatment, and women health.',
        keywords: 'gynecologist, obstetrician, Dr. Gunamani Mahanta, women doctor, Guwahati, Assam, pregnancy care, infertility treatment, PCOS, PCOD',
        canonicalUrl: 'https://medi-book-pied.vercel.app/doctor',
        ogTitle: 'Dr. Gunamani Mahanta - Gynecologist & Obstetrician',
        ogDescription: '26+ years of experience in women healthcare. Specializing in high-risk pregnancy, infertility treatment, and gynecological care in Guwahati, Assam.',
        ogImage: '',
        twitterCard: 'summary_large_image',
      },
      isAvailable: true,
      availabilityStatus: 'available',
      vacationDates: [],
      unavailableDates: [],
      totalReviews: 3,
      averageRating: 4.8,
    });

    console.log('Doctor profile created successfully');
    console.log('Doctor ID:', doctorProfile._id);

    // Update statistics
    await Doctor.findByIdAndUpdate(doctorProfile._id, {
      averageRating: 4.8,
      totalReviews: 3,
    });

    console.log('Doctor profile seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit /doctor to see the public profile');
    console.log('2. Login as admin and go to /doctor/profile-manage to edit the profile');
    console.log('3. Update the profile photo, services, testimonials, etc.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctor profile:', error);
    process.exit(1);
  }
};

seedDoctorProfile();