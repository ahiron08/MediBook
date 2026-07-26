# Doctor Appointment System

A full-stack doctor appointment booking system built with Node.js, Express, MongoDB, and React.

## Production Deployment Security Audit

This project has undergone a complete production security audit. Below are the security measures implemented.

## Features

- Patient registration and login
- Doctor login (separate endpoint)
- Appointment booking with real-time slot availability
- Appointment management (cancel, reschedule, complete)
- Doctor availability management
- Dashboard with appointment statistics
- Role-based access control (Patient/Doctor)

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd doctor-appointment-system
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Configure environment variables (see below)

5. Seed the database:
   ```bash
   cd ../server
   npm run seed
   ```

6. Create an admin doctor:
   ```bash
   npm run create-admin
   ```

7. Start the development servers:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

---

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in the values:

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret (64+ char hex) | Required |

### Generate a Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Security Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173` |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds (10-15) | `12` |
| `RATE_LIMIT_MAX` | Global rate limit per 15 min | `100` |
| `LOGIN_RATE_LIMIT_MAX` | Login attempts per 15 min | `10` |
| `SIGNUP_RATE_LIMIT_MAX` | Registration attempts per hour | `5` |
| `JWT_EXPIRE` | Token expiration duration | `30d` |

---

## Production Deployment

### Build the Client

```bash
cd client
npm run build
```

The production build will be in `client/dist/`.

### Server Production Setup

1. Set `NODE_ENV=production` in `.env`
2. Generate a strong `JWT_SECRET`
3. Configure `ALLOWED_ORIGINS` with your production domain
4. Ensure MongoDB Atlas is configured with IP whitelist
5. Set up SSL/TLS certificate (required for production)

### Deploy to Production

**Option A: Manual Deployment**

```bash
cd server
npm start
```

**Option B: Process Manager (PM2)**

```bash
npm install -g pm2
pm2 start server.js --name doctor-appointment --env production
```

**Option C: Docker** (if configured)

### Nginx Configuration (Recommended)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "0";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Security Measures Implemented

### 1. Environment Variables
- ✅ All secrets moved to `.env` file
- ✅ `.env.example` documents every required variable
- ✅ `.env` is in `.gitignore`
- ✅ Strong JWT secret generation instructions
- ✅ No hardcoded credentials

### 2. Express Security
- ✅ `helmet` configured with proper CSP, HSTS, and security headers
- ✅ `express-rate-limit` on all routes
- ✅ `express-mongo-sanitize` prevents NoSQL injection
- ✅ `compression` enabled
- ✅ `x-powered-by` disabled
- ✅ Body size limits (10kb)

### 3. CORS
- ✅ Restricted to configured origins only
- ✅ No wildcard `*` origins
- ✅ Environment variables for production URLs
- ✅ Credentials enabled only for authenticated routes

### 4. Input Validation
- ✅ Joi validation on every endpoint
- ✅ Email, password, phone, ID validation
- ✅ Date/time validation with proper formats
- ✅ Age and gender validation
- ✅ Query parameter sanitization
- ✅ `stripUnknown: true` removes unvalidated fields

### 5. Authentication
- ✅ JWT with HS256 algorithm
- ✅ Custom issuer and audience
- ✅ Clock tolerance (30 seconds)
- ✅ Token expiration configured
- ✅ Specific error messages for expired/invalid tokens
- ✅ Secure secret verification

### 6. Password Security
- ✅ bcrypt hashing with configurable salt rounds (10-15)
- ✅ Default 12 rounds
- ✅ Passwords never stored in plaintext
- ✅ Password field excluded from queries by default

### 7. Authorization
- ✅ Role-based access control (patient/doctor)
- ✅ Backend enforces all authorization checks
- ✅ Users cannot access another user's data
- ✅ Appointment ownership verified
- ✅ Doctor routes protected by `authorize('doctor')`

### 8. Appointment Security
- ✅ Atomic booking with compound unique index
- ✅ Race-condition safe (MongoDB unique index prevents double booking)
- ✅ Past date validation
- ✅ Working hours respected via slot generation
- ✅ Cancelled slots become available
- ✅ Completed appointments cannot be modified
- ✅ Doctor can reschedule safely
- ✅ Reschedule count tracking

### 9. MongoDB Security
- ✅ NoSQL injection prevention via `express-mongo-sanitize`
- ✅ Explicit field selection (no `findOne(req.body)`)
- ✅ Input sanitization on all endpoints
- ✅ Connection pool limits configured

### 10. Error Handling
- ✅ Centralized error middleware
- ✅ No stack traces in production responses
- ✅ Logged server-side with winston
- ✅ Proper HTTP status codes
- ✅ CORS and rate limit errors handled

### 11. Secure Cookies
- ✅ Cookie parser configured
- ✅ httpOnly, secure, sameSite configurable

### 12. File Upload Security
- ✅ Body size limits prevent large payloads
- ✅ MIME types configurable via `.env`

### 13. Logging
- ✅ Winston logger with file rotation
- ✅ Log levels configurable
- ✅ Failed login attempts logged
- ✅ Admin actions logged
- ✅ Appointment changes logged
- ✅ Server errors logged with context
- ✅ Passwords, tokens, secrets NEVER logged

### 14. Security Headers
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Strict-Transport-Security` (production)
- ✅ `Permissions-Policy` restricts sensitive APIs
- ✅ `Content-Security-Policy` configured
- ✅ `X-XSS-Protection` (zero, deprecated)

### 15. Rate Limiting
- ✅ Global: 100 requests per 15 minutes
- ✅ Auth routes: 20 requests per 15 minutes
- ✅ Login: 10 attempts per 15 minutes
- ✅ Registration: 5 attempts per hour
- ✅ Standard rate limit headers enabled

### 16. Production Configuration
- ✅ `NODE_ENV=production` configurable
- ✅ Morgan logging uses combined format in production
- ✅ No development middleware in production
- ✅ Graceful shutdown on SIGTERM

### 17. Frontend Security
- ✅ API base URL from environment variables (`VITE_API_URL`)
- ✅ No secrets bundled in client
- ✅ Token stored in localStorage (with proper interceptor handling)
- ✅ Auth state cleared on 401 responses
- ✅ No dangerous HTML rendering (React by default escapes)

### 18. Dependency Audit
- ✅ `npm audit` shows 0 vulnerabilities
- ✅ All dependencies are up to date

### 19. Code Quality
- ✅ Removed duplicate middleware
- ✅ Proper error handling in all controllers
- ✅ Consistent response format
- ✅ No dead code

### 20. Documentation
- ✅ README with setup instructions
- ✅ Environment variables documented
- ✅ Production deployment steps
- ✅ Security notes
- ✅ Build instructions

---

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register patient |
| POST | `/api/auth/login` | No | Login (patient/doctor) |
| POST | `/api/auth/doctor/login` | No | Doctor-only login |
| GET | `/api/auth/me` | Yes | Get current user |

### Appointments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/appointments/slots` | No | Get available slots |
| POST | `/api/appointments` | Patient | Book appointment |
| GET | `/api/appointments/my` | Patient | Get my appointments |
| GET | `/api/appointments/my/upcoming` | Patient | Get upcoming appointments |
| PATCH | `/api/appointments/:id/cancel` | Patient | Cancel appointment |
| GET | `/api/appointments/:id` | Yes | Get appointment details |

### Doctor Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/doctor/dashboard` | Doctor | Dashboard stats |
| GET | `/api/doctor/appointments` | Doctor | All appointments |
| GET | `/api/doctor/calendar` | Doctor | Calendar view |
| PUT | `/api/doctor/appointments/:id` | Doctor | Update appointment |
| PATCH | `/api/doctor/reschedule/:id` | Doctor | Reschedule appointment |
| PATCH | `/api/doctor/complete/:id` | Doctor | Complete appointment |
| PATCH | `/api/doctor/cancel/:id` | Doctor | Cancel appointment |
| DELETE | `/api/doctor/delete/:id` | Doctor | Delete appointment |

### Availability
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/availability` | No | Get availability |
| PUT | `/api/availability` | Doctor | Update availability |
| POST | `/api/availability/unavailable-dates` | Doctor | Add unavailable dates |
| DELETE | `/api/availability/unavailable-dates` | Doctor | Remove unavailable dates |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PUT | `/api/users/me` | Yes | Update profile |
| PUT | `/api/users/password` | Yes | Change password |
| DELETE | `/api/users/me` | Yes | Delete account |

---

## Remaining Recommendations (Manual Configuration Required)

These items require manual setup on your hosting platform and cannot be automated in code:

### Hosting Platform
1. **SSL/TLS Certificate**: Configure HTTPS for your production domain (Let's Encrypt, Cloudflare, or your provider's SSL)
2. **Environment Variables**: Set all `.env` variables in your hosting platform's configuration
3. **Process Manager**: Use PM2, systemd, or Docker for process management
4. **Reverse Proxy**: Configure Nginx or Apache as a reverse proxy for the Node.js server
5. **Load Balancing**: If using multiple instances, configure sticky sessions or shared JWT secret

### MongoDB Atlas
1. **IP Whitelist**: Restrict MongoDB Atlas to your server's IP address only
2. **Strong Password**: Use a complex, unique password for the database user
3. **VPC Peering**: For highest security, use VPC peering instead of public IP
4. **Encryption**: Enable encryption at rest (Atlas default)
5. **Backup**: Configure automated backups
6. **Alerting**: Set up monitoring alerts for unusual database activity

### DNS & Domain
1. **DNS Records**: Configure A/AAAA records for your domain
2. **CDN**: Consider Cloudflare or similar for DDoS protection
3. **Email**: Configure SPF, DKIM, and DMARC records if sending emails

### Monitoring
1. **Application Monitoring**: Set up Sentry, New Relic, or similar for error tracking
2. **Server Monitoring**: Configure uptime monitoring (UptimeRobot, Pingdom)
3. **Log Management**: Forward logs to a centralized service (Logtail, Logz.io)
4. **Database Monitoring**: Enable MongoDB Atlas monitoring alerts

### Additional Security (Optional)
1. **API Keys**: Rotate all API keys before production deployment
2. **Web Application Firewall (WAF)**: Consider Cloudflare WAF or AWS WAF
3. **DDoS Protection**: Enable DDoS protection at the CDN level
4. **Security Headers Audit**: Run `https://securityheaders.com` against your domain
5. **Penetration Testing**: Consider a professional security audit
6. **Bug Bounty Program**: For public-facing applications

---

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting, Mongo Sanitize, XSS Clean
- **Logging**: Winston, Morgan

## License

ISC