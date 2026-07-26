const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const logLevel = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');
  return logLevel;
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    // Never log passwords, tokens, or secrets
    const sanitizedMeta = { ...meta };
    delete sanitizedMeta.password;
    delete sanitizedMeta.token;
    delete sanitizedMeta.authorization;
    delete sanitizedMeta.secret;
    delete sanitizedMeta.JWT_SECRET;

    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    const metaStr = JSON.stringify(sanitizedMeta);
    if (metaStr !== '{}') {
      log += ` ${metaStr}`;
    }
    
    return log;
  })
);

// Define transports
const transports = [
  // Console transport for all environments
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      format
    ),
  }),
];

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  const logDir = path.join(__dirname, '../../logs');
  
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format,
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Stream for Morgan integration (if used)
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;