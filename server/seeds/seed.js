const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

dotenv.config({ path: 'server/.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Availability.deleteMany({});

    console.log('Cleared existing data...');

    // Create Doctor
    const doctor = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'doctor@clinic.com',
      phone: '+1-555-0100',
      password: 'doctor123',
      role: 'doctor',
    });

    console.log(`Doctor created: ${doctor.email}`);

    // Create Doctor Availability - 10AM-1PM, 2PM-6PM with 20-min slots
    await Availability.create({
      doctor: doctor._id,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      workingHours: { start: '10:00', end: '18:00' },
      lunchBreak: { start: '13:00', end: '14:00' },
      appointmentDuration: 20,
      bufferBetweenAppointments: 0,
      unavailableDates: [],
      isActive: true,
    });

    console.log('Doctor availability created');

    // Create 5 Demo Patients
    const patients = [];
    const patientData = [
      { name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101' },
      { name: 'Emily Davis', email: 'emily@example.com', phone: '+1-555-0102' },
      { name: 'Michael Brown', email: 'michael@example.com', phone: '+1-555-0103' },
      { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+1-555-0104' },
      { name: 'James Taylor', email: 'james@example.com', phone: '+1-555-0105' },
    ];

    for (const data of patientData) {
      const patient = await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: 'patient123',
        role: 'patient',
      });
      patients.push(patient);
      console.log(`Patient created: ${patient.email}`);
    }

    // Create 24 Sample Appointments - aligned to 20-min slots
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentData = [
      // Today's appointments
      { dayOffset: 0, startTime: '10:00', endTime: '10:20', status: 'confirmed', patient: 0 },
      { dayOffset: 0, startTime: '10:20', endTime: '10:40', status: 'confirmed', patient: 1 },
      { dayOffset: 0, startTime: '11:00', endTime: '11:20', status: 'pending', patient: 2 },
      { dayOffset: 0, startTime: '14:00', endTime: '14:20', status: 'confirmed', patient: 3 },
      { dayOffset: 0, startTime: '15:40', endTime: '16:00', status: 'confirmed', patient: 4 },
      // Tomorrow
      { dayOffset: 1, startTime: '10:00', endTime: '10:20', status: 'confirmed', patient: 0 },
      { dayOffset: 1, startTime: '11:20', endTime: '11:40', status: 'confirmed', patient: 1 },
      { dayOffset: 1, startTime: '14:20', endTime: '14:40', status: 'confirmed', patient: 2 },
      { dayOffset: 1, startTime: '16:00', endTime: '16:20', status: 'pending', patient: 3 },
      // Day after tomorrow
      { dayOffset: 2, startTime: '10:40', endTime: '11:00', status: 'confirmed', patient: 4 },
      { dayOffset: 2, startTime: '12:00', endTime: '12:20', status: 'pending', patient: 0 },
      { dayOffset: 2, startTime: '14:00', endTime: '14:20', status: 'confirmed', patient: 1 },
      { dayOffset: 2, startTime: '15:20', endTime: '15:40', status: 'confirmed', patient: 2 },
      // Next week
      { dayOffset: 7, startTime: '10:00', endTime: '10:20', status: 'confirmed', patient: 3 },
      { dayOffset: 7, startTime: '11:40', endTime: '12:00', status: 'confirmed', patient: 4 },
      { dayOffset: 7, startTime: '14:40', endTime: '15:00', status: 'pending', patient: 0 },
      { dayOffset: 7, startTime: '16:20', endTime: '16:40', status: 'confirmed', patient: 1 },
      // Completed appointments (past)
      { dayOffset: -1, startTime: '10:00', endTime: '10:20', status: 'completed', patient: 2 },
      { dayOffset: -1, startTime: '11:20', endTime: '11:40', status: 'completed', patient: 3 },
      { dayOffset: -2, startTime: '14:00', endTime: '14:20', status: 'completed', patient: 4 },
      { dayOffset: -3, startTime: '15:40', endTime: '16:00', status: 'completed', patient: 0 },
      // Cancelled appointments
      { dayOffset: 0, startTime: '16:40', endTime: '17:00', status: 'cancelled', patient: 1 },
      { dayOffset: 1, startTime: '10:40', endTime: '11:00', status: 'cancelled', patient: 2 },
      // Rescheduled
      { dayOffset: 3, startTime: '11:20', endTime: '11:40', status: 'rescheduled', patient: 3 },
      // Past appointment
      { dayOffset: -5, startTime: '10:00', endTime: '10:20', status: 'completed', patient: 4 },
    ];

    const reasons = [
      'Annual checkup',
      'Persistent headache',
      'Lower back pain',
      'Follow-up visit',
      'Blood pressure check',
      'Allergy consultation',
      'Skin rash examination',
      'Vaccination',
      'General wellness',
      'Eye strain',
    ];

    for (let i = 0; i < appointmentData.length; i++) {
      const data = appointmentData[i];
      const appointmentDate = new Date(today);
      appointmentDate.setDate(appointmentDate.getDate() + data.dayOffset);

      await Appointment.create({
        patient: patients[data.patient]._id,
        doctor: doctor._id,
        patientName: patients[data.patient].name,
        patientEmail: patients[data.patient].email,
        patientPhone: patients[data.patient].phone,
        patientAge: 25 + (i % 50),
        patientGender: i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other',
        date: appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: reasons[i % reasons.length],
        doctorNotes: data.status === 'completed' ? 'Patient responded well to treatment.' : '',
        status: data.status,
      });
    }

    console.log('24 sample appointments created');
    console.log('\n========================================');
    console.log('   SEED DATA CREATED SUCCESSFULLY');
    console.log('========================================');
    console.log('\nDoctor Login:');
    console.log('  Email: doctor@clinic.com');
    console.log('  Password: doctor123');
    console.log('\nPatient Login (any):');
    console.log('  Email: john@example.com');
    console.log('  Password: patient123');
    console.log('  Email: emily@example.com');
    console.log('  Password: patient123');
    console.log('  Email: michael@example.com');
    console.log('  Password: patient123');
    console.log('  Email: sarah@example.com');
    console.log('  Password: patient123');
    console.log('  Email: james@example.com');
    console.log('  Password: patient123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
</parameter>
<task_progress>
- [x] Review and update Appointment model
- [x] Update seed data for 20-minute slots
- [ ] Update slot generation service
- [ ] Update frontend booking component
- [ ] Add automatic no-show functionality
- [ ] Test the complete system
</parameter>
</write_to_file>