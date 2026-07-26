const Joi = require('joi');

// Common validation schemas
const commonValidations = {
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).max(128).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  name: Joi.string().min(2).max(50).trim().required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/).required().messages({
    'string.pattern.base': 'Please provide a valid phone number (10-15 digits)',
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required',
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Please provide a valid date',
    'date.format': 'Date must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Date is required',
  }),
  objectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Invalid ID format',
    'any.required': 'ID is required',
  }),
  time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required().messages({
    'string.pattern.base': 'Time must be in HH:MM format (24-hour)',
    'any.required': 'Time is required',
  }),
  patientAge: Joi.number().integer().min(0).max(150).required().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age cannot be negative',
    'number.max': 'Age cannot exceed 150',
    'any.required': 'Patient age is required',
  }),
  patientGender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': 'Gender must be male, female, or other',
    'any.required': 'Patient gender is required',
  }),
};

// Validation schemas for different endpoints
const validationSchemas = {
  // Auth validation
  register: Joi.object({
    name: commonValidations.name,
    email: commonValidations.email,
    phone: commonValidations.phone,
    password: commonValidations.password,
  }),

  login: Joi.object({
    email: commonValidations.email,
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  }),

  // Appointment validation
  bookAppointment: Joi.object({
    slotId: commonValidations.objectId.optional(),
    date: commonValidations.date,
    startTime: commonValidations.time,
    reason: Joi.string().min(5).max(500).trim().required().messages({
      'string.min': 'Reason must be at least 5 characters',
      'string.max': 'Reason cannot exceed 500 characters',
      'string.empty': 'Reason is required',
      'any.required': 'Reason is required',
    }),
    patientName: Joi.string().min(2).max(50).trim().optional(),
    patientEmail: Joi.string().email().optional(),
    patientPhone: Joi.string().pattern(/^\+?[\d\s-]{10,15}$/).optional(),
    patientAge: commonValidations.patientAge,
    patientGender: commonValidations.patientGender,
  }),

  cancelAppointment: Joi.object({
    id: commonValidations.objectId,
  }),

  getAppointmentById: Joi.object({
    id: commonValidations.objectId,
  }),

  // User validation
  updateProfile: Joi.object({
    name: commonValidations.name.optional(),
    phone: commonValidations.phone.optional(),
    currentPassword: Joi.string().min(6).optional(),
    newPassword: Joi.string().min(6).max(128).optional(),
  }).with('newPassword', 'currentPassword'),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(6).max(128).required().messages({
      'string.min': 'New password must be at least 6 characters',
      'string.max': 'New password cannot exceed 128 characters',
      'any.required': 'New password is required',
    }),
  }),

  // Availability validation
  setAvailability: Joi.object({
    date: commonValidations.date,
    startTime: commonValidations.time,
    endTime: commonValidations.time,
    slotDuration: Joi.number().integer().min(15).max(120).default(30).messages({
      'number.base': 'Slot duration must be a number',
      'number.min': 'Slot duration must be at least 15 minutes',
      'number.max': 'Slot duration cannot exceed 120 minutes',
      'number.integer': 'Slot duration must be an integer',
    }),
  }),

  updateAvailability: Joi.object({
    workingDays: Joi.array()
      .items(Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'))
      .min(1)
      .messages({
        'array.min': 'At least one working day is required',
        'any.only': 'Invalid day name',
      }),
    workingHours: Joi.object({
      start: commonValidations.time,
      end: commonValidations.time,
    }).custom((value, helpers) => {
      if (value.start >= value.end) {
        return helpers.error('any.custom', { message: 'End time must be after start time' });
      }
      return value;
    }),
    lunchBreak: Joi.object({
      start: commonValidations.time,
      end: commonValidations.time,
    }).custom((value, helpers) => {
      if (value.start >= value.end) {
        return helpers.error('any.custom', { message: 'Lunch end time must be after start time' });
      }
      return value;
    }),
    appointmentDuration: Joi.number().valid(15, 20, 30, 45, 60).messages({
      'any.only': 'Appointment duration must be 15, 20, 30, 45, or 60 minutes',
    }),
    bufferBetweenAppointments: Joi.number().integer().min(0).max(60).default(0).messages({
      'number.min': 'Buffer cannot be negative',
      'number.max': 'Buffer cannot exceed 60 minutes',
    }),
    isActive: Joi.boolean(),
  }),

  addUnavailableDates: Joi.object({
    dates: Joi.array().items(Joi.date().iso()).min(1).required().messages({
      'array.min': 'At least one date is required',
      'any.required': 'Dates array is required',
    }),
    reason: Joi.string().max(200).trim().optional(),
  }),

  removeUnavailableDates: Joi.object({
    dates: Joi.array().items(Joi.date().iso()).min(1).required().messages({
      'array.min': 'At least one date is required',
      'any.required': 'Dates array is required',
    }),
  }),

  // Doctor appointment management
  updateAppointment: Joi.object({
    doctorNotes: Joi.string().max(1000).trim().optional(),
    reason: Joi.string().max(500).trim().optional(),
  }),

  rescheduleAppointment: Joi.object({
    date: commonValidations.date,
    startTime: commonValidations.time,
  }),

  // Query validation
  getAppointmentsQuery: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).trim().optional(),
    date: Joi.date().iso().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
  }),
};

// Validation middleware factory
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found',
      });
    }

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Query parameter validation
const validateQuery = (schemaName) => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found',
      });
    }

    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    // Replace query with validated and sanitized data
    req.query = value;
    next();
  };
};

// Params validation
const validateParams = (schemaName) => {
  return (req, res, next) => {
    const schema = validationSchemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: 'Validation schema not found',
      });
    }

    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessages,
      });
    }

    // Replace params with validated and sanitized data
    req.params = value;
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
  validationSchemas,
};