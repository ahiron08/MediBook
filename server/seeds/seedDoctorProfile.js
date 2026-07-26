const mongoose = require('mongoose');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const Availability = require('../models/Availability');
const bcrypt = require('bcryptjs');

const seedDoctorProfile = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doctor-appointment');
    console.log('Connected to MongoDB');

    // Create doctor user if not exists
    let doctor = await User.findOne({ role: 'doctor' });
    if (!doctor) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('doctor123', salt);
      
      doctor = await User.create({
        name: 'Gunamani Mahanta',
        email: 'doctor@example.com',
        phone: '08861590803',
        password: hashedPassword,
        role: 'doctor',
        isActive: true,
        photo: '',
      });
      console.log('Doctor user created');
    }

    // Create doctor profile
    const doctorProfile = await DoctorProfile.findOne({ doctor: doctor._id });
    
    if (!doctorProfile) {
      const profile = await DoctorProfile.create({
        doctor: doctor._id,
        specialization: 'Gynecologist & Obstetrician',
        experience: '26+ Years',
        gender: 'female',
        languages: ['English', 'Hindi', 'Assamese'],
        
        about: `Dr. Gunamani Mahanta is a Senior Gynecologist & Obstetrician with over 26 years of experience in women's health. She specializes in pregnancy care, infertility treatment, high-risk pregnancies, PCOS/PCOD management, menstrual disorders, and gynecological surgeries.

With her extensive experience and compassionate care, Dr. Mahanta has helped thousands of women achieve their dreams of motherhood and maintain optimal reproductive health. She is known for her patient-centric approach and commitment to providing personalized care to every patient.

Her expertise spans across various aspects of gynecology and obstetrics, making her one of the most trusted names in women's healthcare in the region.`,

        education: [
          'MBBS - Gauhati Medical College',
          'DGO - Post Graduate Diploma in Gynecology & Obstetrics',
        ],

        specialInterests: [
          'High Risk Pregnancy',
          'Infertility Treatment',
          'PCOS/PCOD Management',
          'Gynecological Surgeries',
          'Antenatal Care',
          'Menstrual Disorders',
        ],

        registrationNumber: 'REG123456',
        medicalCouncil: 'Assam Medical Council',

        qualifications: [
          {
            degree: 'MBBS',
            institution: 'Gauhati Medical College',
            year: '1998',
            type: 'degree',
          },
          {
            degree: 'DGO',
            institution: 'Post Graduate Institute',
            year: '2001',
            type: 'degree',
          },
          {
            degree: 'Advanced Laparoscopic Surgery',
            institution: 'Fellowship Program',
            year: '2005',
            type: 'fellowship',
          },
        ],

        experienceDetails: [
          {
            position: 'Senior Gynecologist & Obstetrician',
            hospital: 'Private Chamber',
            startDate: '2010',
            endDate: 'Present',
            description: 'Running private practice specializing in high-risk pregnancies and infertility treatments',
            isCurrent: true,
          },
          {
            position: 'Consultant Gynecologist',
            hospital: 'Apollo Hospitals, Guwahati',
            startDate: '2005',
            endDate: '2010',
            description: 'Consultant in the Department of Gynecology and Obstetrics',
            isCurrent: false,
          },
          {
            position: 'Resident Doctor',
            hospital: 'Gauhati Medical College Hospital',
            startDate: '1998',
            endDate: '2005',
            description: 'Residency training in Gynecology and Obstetrics',
            isCurrent: false,
          },
        ],

        achievements: [
          'Successfully delivered over 10,000 babies',
          'Specialized in high-risk pregnancy management',
          'Pioneered minimally invasive surgical techniques in the region',
          'Published 15+ research papers in national medical journals',
          'Trained 50+ junior doctors in gynecological procedures',
        ],

        awards: [
          'Best Gynecologist Award 2020 - Assam Medical Association',
          'Excellence in Women's Healthcare 2018 - Indian Medical Association',
          'Patient Choice Award 2015 - Healthcare Excellence Foundation',
        ],

        services: [
          {
            name: 'Antenatal Care & Delivery',
            description: 'Comprehensive prenatal care including regular check-ups, ultrasound monitoring, and safe delivery services for normal and high-risk pregnancies',
            fee: '₹500 – ₹700',
            duration: '30-45 minutes',
            order: 1,
          },
          {
            name: 'High Risk Pregnancy Management',
            description: 'Specialized care for complicated pregnancies including gestational diabetes, hypertension, multiple pregnancies, and other high-risk conditions',
            fee: '₹700 – ₹1000',
            duration: '45-60 minutes',
            order: 2,
          },
          {
            name: 'Infertility Treatment',
            description: 'Comprehensive infertility evaluation and treatment including ovulation induction, IUI, and fertility counseling',
            fee: '₹500 – ₹1500',
            duration: '30-60 minutes',
            order: 3,
          },
          {
            name: 'PCOS / PCOD Treatment',
            description: 'Diagnosis and management of Polycystic Ovary Syndrome including hormonal therapy, lifestyle modification, and fertility treatment',
            fee: '₹500 – ₹700',
            duration: '30-45 minutes',
            order: 4,
          },
          {
            name: 'Menstrual Disorders',
            description: 'Treatment for irregular periods, heavy bleeding, painful periods, and other menstrual problems',
            fee: '₹500 – ₹700',
            duration: '30 minutes',
            order: 5,
          },
          {
            name: 'Gynecological Surgery',
            description: 'Laparoscopic and hysteroscopic surgeries for fibroids, ovarian cysts, endometriosis, and other gynecological conditions',
            fee: '₹15,000 – ₹50,000',
            duration: '1-2 hours',
            order: 6,
          },
          {
            name: 'Family Planning',
            description: 'Contraceptive counseling, IUD insertion, sterilization procedures, and other family planning services',
            fee: '₹300 – ₹500',
            duration: '20-30 minutes',
            order: 7,
          },
          {
            name: "Women's Health Consultation",
            description: 'General gynecological check-ups, preventive care, and health screening for women of all ages',
            fee: '₹500 – ₹700',
            duration: '30 minutes',
            order: 8,
          },
        ],

        fees: [
          {
            type: 'new_consultation',
            amount: 700,
            currency: 'INR',
            isActive: true,
          },
          {
            type: 'follow_up',
            amount: 500,
            currency: 'INR',
            isActive: true,
          },
          {
            type: 'video_consultation',
            amount: 500,
            currency: 'INR',
            isActive: true,
          },
          {
            type: 'emergency',
            amount: 1000,
            currency: 'INR',
            isActive: true,
          },
        ],

        consultationFeeRange: {
          min: 500,
          max: 700,
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
          timing: 'Monday–Saturday: 10:00 AM – 1:00 PM, 5:00 PM – 8:00 PM',
          emergencyContact: '08861590803',
        },

        timings: [
          {
            day: 'Monday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Tuesday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Wednesday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Thursday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Friday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Saturday',
            isWorking: true,
            slots: [
              { start: '10:00', end: '13:00' },
              { start: '17:00', end: '20:00' },
            ],
          },
          {
            day: 'Sunday',
            isWorking: false,
            slots: [],
          },
        ],

        googleMap: {
          url: 'https://maps.google.com/?q=Hatigaon,Guwahati,Assam,781038',
          latitude: '26.1445',
          longitude: '91.7362',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.5!2d91.7362!3d26.1445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDA4JzQ5LjQiTiA5McKwNDQnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890',
        },

        testimonials: [
          {
            patientName: 'Priya Sharma',
            isAnonymous: false,
            patientPhoto: '',
            rating: 5,
            review: 'Dr. Mahanta is an excellent doctor. She handled my high-risk pregnancy with utmost care and professionalism. I had a safe delivery and I am forever grateful to her.',
            date: new Date('2024-01-15'),
            isVerified: true,
            appointmentId: null,
          },
          {
            patientName: 'Anonymous',
            isAnonymous: true,
            patientPhoto: '',
            rating: 5,
            review: 'After 5 years of trying, Dr. Mahanta helped us conceive. Her treatment was personalized and she was always available for our queries. Highly recommended!',
            date: new Date('2024-02-20'),
            isVerified: true,
            appointmentId: null,
          },
          {
            patientName: 'Ritu Bora',
            isAnonymous: false,
            patientPhoto: '',
            rating: 5,
            review: 'Very professional and caring. Dr. Mahanta explained everything clearly and made me feel comfortable throughout my treatment. The clinic is also well-maintained.',
            date: new Date('2024-03-10'),
            isVerified: true,
            appointmentId: null,
          },
          {
            patientName: 'Meera Das',
            isAnonymous: false,
            patientPhoto: '',
            rating: 4,
            review: 'Good experience overall. The doctor is very knowledgeable and the staff is cooperative. Waiting time can be a bit long sometimes.',
            date: new Date('2024-03-25'),
            isVerified: true,
            appointmentId: null,
          },
        ],

        faqs: [
          {
            question: 'Do I need prior appointment?',
            answer: 'Yes, prior appointment is recommended to avoid waiting. You can book appointments online through our website or call the clinic directly.',
            order: 1,
          },
          {
            question: 'Can I cancel appointments?',
            answer: 'Yes, you can cancel appointments up to 2 hours before the scheduled time. Please use the cancellation option in your appointment details or call the clinic.',
            order: 2,
          },
          {
            question: 'Do you accept walk-ins?',
            answer: 'Walk-ins are accepted based on availability. However, we recommend booking an appointment in advance to guarantee your slot.',
            order: 3,
          },
          {
            question: 'How early should I arrive?',
            answer: 'Please arrive 10-15 minutes before your scheduled appointment time to complete any necessary paperwork.',
            order: 4,
          },
          {
            question: 'What payment methods are accepted?',
            answer: 'We accept cash, UPI, and all major credit/debit cards. Payment is to be made at the clinic after consultation.',
            order: 5,
          },
          {
            question: 'Do you provide online consultations?',
            answer: 'Yes, we offer video consultations for follow-up cases and initial consultations. Please select "Online Consultation" while booking.',
            order: 6,
          },
        ],

        seo: {
          metaTitle: 'Dr. Gunamani Mahanta - Gynecologist & Obstetrician in Guwahati | 26+ Years Experience',
          metaDescription: 'Dr. Gunamani Mahanta is a Senior Gynecologist & Obstetrician with 26+ years of experience in Guwahati, Assam. Specializes in high-risk pregnancy, infertility treatment, PCOS/PCOD, and gynecological surgeries.',
          keywords: [
            'gynecologist Guwahati',
            'obstetrician Guwahati',
            'Dr. Gunamani Mahanta',
            'high risk pregnancy Guwahati',
            'infertility treatment Assam',
            'PCOS treatment Guwahati',
            'gynecological surgery Guwahati',
            'women healthcare Assam',
          ],
          canonicalUrl: 'https://drgunamani.com/doctor-profile',
          ogTitle: 'Dr. Gunamani Mahanta - Gynecologist & Obstetrician',
          ogDescription: '26+ years of experience in women\'s healthcare. Specializing in high-risk pregnancy, infertility, and gynecological surgeries.',
          ogImage: '',
          twitterCard: 'summary_large_image',
          structuredData: {},
        },

        socialLinks: [],

        vacationDates: [],

        isAvailable: true,

        additionalInfo: {},
      });

      console.log('Doctor profile created');
    } else {
      console.log('Doctor profile already exists');
    }

    // Create availability settings if not exists
    let availability = await Availability.findOne({ doctor: doctor._id });
    
    if (!availability) {
      await Availability.create({
        doctor: doctor._id,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        workingHours: {
          start: '10:00',
          end: '20:00',
        },
        lunchBreak: {
          start: '13:00',
          end: '17:00',
        },
        appointmentDuration: 30,
        bufferBetweenAppointments: 0,
        unavailableDates: [],
        isActive: true,
      });
      console.log('Availability settings created');
    } else {
      console.log('Availability settings already exist');
    }

    console.log('Seeding completed successfully!');
    console.log('Doctor credentials:');
    console.log('Email: doctor@example.com');
    console.log('Password: doctor123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDoctorProfile();