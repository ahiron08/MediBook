const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please add a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
      match: [/^\+?[\d\s-]{10,15}$/, 'Please add a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      default: 'patient',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    photo: {
      type: String,
      default: '',
    },
    photoPublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password with configurable salt rounds
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  // Use environment variable for salt rounds, default to 12 for production
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  
  // Validate salt rounds are within safe range
  if (saltRounds < 10 || saltRounds > 15) {
    throw new Error('BCRYPT_SALT_ROUNDS must be between 10 and 15');
  }
  
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);