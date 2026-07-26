const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Availability = require('../models/Availability');

dotenv.config({ path: '../.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if doctor already exists
    const existingDoctor = await User.findOne({ role: 'doctor' });

    if (existingDoctor) {
      console.log('Doctor account already exists:');
      console.log(`  Name: ${existingDoctor.name}`);
      console.log(`  Email: ${existingDoctor.email}`);
      console.log('\nTo reset, run: npm run seed');
      process.exit(0);
    }

    // Create Doctor
    const doctor = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'doctor@clinic.com',
      phone: '+1-555-0100',
      password: 'doctor123',
      role: 'doctor',
    });

    console.log(`Doctor account created successfully!`);
    console.log(`  Name: ${doctor.name}`);
    console.log(`  Email: ${doctor.email}`);
    console.log(`  Password: doctor123`);

    // Create default availability
    await Availability.create({
      doctor: doctor._id,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '18:00' },
      lunchBreak: { start: '13:00', end: '14:00' },
      appointmentDuration: 30,
      bufferBetweenAppointments: 0,
      unavailableDates: [],
      isActive: true,
    });

    console.log('Default availability created.');
    console.log('\nYou can now login at /doctor/login');

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();