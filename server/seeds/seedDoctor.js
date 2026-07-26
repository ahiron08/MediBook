const mongoose = require('mongoose');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: `${__dirname}/../.env` });

const seedDoctor = async () => {
  try {
    // Get MongoDB URI from environment
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('ERROR: MONGO_URI not found in .env file');
      console.error('Please create a .env file in the server directory with your MongoDB connection string');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***@')); // Hide credentials in log

    // Connect to MongoDB with timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully');

    // Create doctor user
    const doctorUser = await User.findOne({ role: 'doctor' });
    if (!doctorUser) {
      console.log('Creating doctor user...');
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const newDoctor = await User.create({
        name: 'Dr. Gunamani Mahanta',
        email: 'doctor@example.com',
        password: hashedPassword,
        phone: '08861590803',
        role: 'doctor',
        photo: '',
      });
      console.log('Doctor user created:', newDoctor.email);
    } else {
      console.log('Doctor user already exists:', doctorUser.email);
    }

    // Get doctor user
    const doctor = await User.findOne({ role: 'doctor' });

    // Create doctor profile
    const existingProfile = await DoctorProfile.findOne({ doctor: doctor._id });
    if (!existingProfile) {
      console.log('Creating doctor profile...');
      
      const profileData = {
        doctor: doctor._id,
        doctorName: 'Dr. Gunamani Mahanta',
        specialization: 'Gynecologist & Obstetrician',
        experienceYears: 26,
        qualifications: 'MBBS, DGO',
        about: 'Dr. Gunamani Mahanta is a Senior Gynecologist & Obstetrician with over 26 years of experience in women\'s health. She specializes in pregnancy care, infertility treatment, and gynecological surgeries.',
        profilePhoto: '',
        languagesSpoken: ['English', 'Hindi', 'Assamese'],
        education: [
          'MBBS - Medical College',
          'DGO - Diploma in Gynecology & Obstetrics'
        ],
        clinicName: 'Private Chamber',
        clinicAddress: 'Hathigaon Main Road, Hatigaon, Guwahati, Assam',
        landmark: 'Near Hatigaon Chariali',
        city: 'Guwahati',
        state: 'Assam',
        pincode: '781006',
        contactNumber: '08861590803',
        whatsappNumber: '08861590803',
        consultationFeeMin: 500,
        consultationFeeMax: 700,
        clinicTiming: '10:00 AM – 1:00 PM\n5:00 PM – 8:00 PM',
        workingDays: 'Monday – Saturday',
        googleMapsLink: 'https://www.google.com/maps/place/Dr.Gunamani+mahanta+MBBS,+MD(O%26G),+DNB+-+Best+Gynecologist+in+Guwahati/@26.1309899,91.7863247,17z/data=!3m1!4b1!4m6!3m5!1s0x375a59692f8b878d:0x87d537b08475026b!8m2!3d26.1309899!4d91.7863247!16s%2Fg%2F11rwpg756g!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDcyMi4wIKXMDSoASAFQAw%3D%3D',
        services: [
          {
            name: 'Antenatal Care & Delivery',
            description: 'Comprehensive prenatal care and safe delivery services for expecting mothers',
            fee: null,
          },
          {
            name: 'High Risk Pregnancy',
            description: 'Specialized care for high-risk pregnancies with advanced monitoring',
            fee: null,
          },
          {
            name: 'Infertility Treatment',
            description: 'Diagnosis and treatment for infertility issues with modern techniques',
            fee: null,
          },
          {
            name: 'PCOS & PCOD Treatment',
            description: 'Effective management and treatment of PCOS and PCOD conditions',
            fee: null,
          },
          {
            name: 'Menstrual Problems',
            description: 'Treatment for irregular periods, heavy bleeding, and other menstrual disorders',
            fee: null,
          },
          {
            name: 'Gynecological Surgeries',
            description: 'Advanced surgical procedures for various gynecological conditions',
            fee: null,
          },
        ],
        testimonials: [
          {
            patientName: 'Priya Sharma',
            rating: 5,
            review: 'Dr. Mahanta is an excellent doctor. She took great care of me during my pregnancy and the delivery was smooth. Highly recommended!',
            date: new Date('2024-01-15'),
            visible: true,
          },
          {
            patientName: 'Anjali Das',
            rating: 5,
            review: 'Very professional and caring. The clinic is well-maintained and the staff is friendly. Consultation fees are reasonable.',
            date: new Date('2024-02-20'),
            visible: true,
          },
          {
            patientName: 'Ritu Bora',
            rating: 4,
            review: 'Good experience. Dr. Mahanta explained everything clearly and patiently. The treatment was effective.',
            date: new Date('2024-03-10'),
            visible: true,
          },
        ],
        seoTitle: 'Dr. Gunamani Mahanta - Gynecologist & Obstetrician in Guwahati',
        seoDescription: 'Dr. Gunamani Mahanta is a Senior Gynecologist & Obstetrician with 26+ years of experience in Guwahati, Assam. Specializes in pregnancy care, infertility treatment, and gynecological surgeries.',
        seoKeywords: 'gynecologist, obstetrician, pregnancy care, infertility treatment, PCOS, PCOD, gynecological surgeries, Guwahati, Assam',
      };

      await DoctorProfile.create(profileData);
      console.log('Doctor profile created successfully');
    } else {
      console.log('Doctor profile already exists');
    }

    console.log('✅ Seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
      console.error('\n📋 Troubleshooting Steps:');
      console.error('1. Make sure MongoDB is running:');
      console.error('   - Local: Start MongoDB service');
      console.error('   - Atlas: Check your connection string and network access');
      console.error('2. Verify MONGO_URI in server/.env file');
      console.error('3. Check if MongoDB port 27017 is accessible');
    }
    
    process.exit(1);
  }
};

seedDoctor();
