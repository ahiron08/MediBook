const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const xss = require('xss-clean');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const logger = require('./utils/logger');

// Load env vars
dotenv.config({ path: `${__dirname}/.env` });

// Use custom DNS servers from environment variable (optional)
const customDns = process.env.CUSTOM_DNS_SERVERS;
if (customDns) {
  try {
    const dns = require('node:dns');
    const dnsServers = customDns.split(',').map(s => s.trim());
    dns.setServers(dnsServers);
    console.log('Custom DNS servers configured:', dnsServers.join(', '));
  } catch (e) {
    console.warn('Could not set custom DNS servers:', e.message);
  }
}

// Connect to database
connectDB();

const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

// Trust proxy for rate limiting behind reverse proxies (e.g., Nginx, Heroku)
app.set('trust proxy', 1);

// HTTP request logging with morgan (use winston for production)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}

// Skip JSON parsing for multipart/form-data (file uploads)
app.use((req, res, next) => {
  if (req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
    return next();
  }
  next();
});

// Body parser with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// Security headers with CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: process.env.NODE_ENV === 'production' ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    } : false,
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    hidePoweredBy: true,
    ieNoOpen: true,
  })
);

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // Deprecated but harmless
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Enable CORS with proper configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : [process.env.CLIENT_URL || "http://localhost:5173"];

console.log("========== CORS CONFIG ==========");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("ALLOWED_ORIGINS ENV:", process.env.ALLOWED_ORIGINS);
console.log("Allowed Origins:", allowedOrigins);
console.log("=================================");

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);

      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) {
        console.log("No Origin header. Allowing request.");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("Origin allowed:", origin);
        return callback(null, true);
      }

      console.log("Origin BLOCKED:", origin);

      return callback(
        new Error(`CORS blocked for origin: ${origin}`),
        false
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 204,
  })
);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Compression middleware
app.use(compression());

// Global rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

app.use('/api', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
});

app.use('/api/auth', authLimiter);

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/users', require('./routes/users'));

// Test route (remove in production)
app.use('/api/test', require('./routes/test'));

// Health check (no sensitive info exposed)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process gracefully
  server.close(() => {
    logger.info('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  // Close server & exit process gracefully
  server.close(() => {
    logger.info('Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

module.exports = app;