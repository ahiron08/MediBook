# Doctor Appointment System - Setup Guide

## Overview
This is a single-doctor appointment booking system built with MERN stack (MongoDB, Express, React, Node.js). The system is optimized for one doctor profile that is shared across all pages.

## Features Implemented

### Backend
- ✅ Doctor Profile schema with all required fields
- ✅ RESTful APIs for profile, services, and testimonials
- ✅ Cloudinary image upload integration
- ✅ Public and protected routes with authentication
- ✅ Seed data for Dr. Gunamani Mahanta

### Frontend
- ✅ Public homepage with doctor information
- ✅ Public doctor profile page
- ✅ Patient appointment booking with calendar
- ✅ Patient dashboard with doctor info card
- ✅ Doctor dashboard with profile management
- ✅ Services management (CRUD)
- ✅ Testimonials management (CRUD with visibility toggle)
- ✅ Offline booking card (Call, WhatsApp, Maps)
- ✅ Floating contact buttons
- ✅ SEO optimization with JSON-LD structured data
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Shared doctor profile via React Context

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd doctor-appointment-system
```

### 2. Backend Setup

```bash
cd server
npm install
```

**Important:** Ensure MongoDB is running before proceeding:
- **Local MongoDB:** Install MongoDB Community Edition and start the service
- **MongoDB Atlas:** Use a cloud connection string (recommended for beginners)

Create a `.env` file in the `server` directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
# For local MongoDB: mongodb://localhost:27017/doctor-appointment
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/doctor-appointment
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# CORS Configuration
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Other settings (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BCRYPT_SALT_ROUNDS=12
```

### 3. Test MongoDB Connection

Before seeding, test your MongoDB connection:
```bash
node testConnection.js
```

This will verify:
- MongoDB is accessible
- Connection string is correct
- Database permissions are set

If the test passes, you'll see: ✅ MongoDB connection successful!

### 4. Seed the Database

Once the connection test passes, run the seed script:
```bash
node seeds/seedDoctor.js
```

This will create:
- Doctor user: `doctor@example.com` / password: `doctor123`
- Complete doctor profile for Dr. Gunamani Mahanta
- Sample services and testimonials

### 4. Start the Backend Server

```bash
# Development mode
npm run dev

# Or production mode
npm start
```

The server will run on `http://localhost:5000`

### 5. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend Development Server

```bash
npm run dev
```

The client will run on `http://localhost:5173`

## Default Login Credentials

### Doctor Account
- Email: `doctor@example.com`
- Password: `doctor123`
- Dashboard: `http://localhost:5173/doctor/dashboard`

### Patient Account
You need to register a new patient account:
- Go to `http://localhost:5173/register`
- Or use the login page if you have existing patient credentials

## Project Structure

```
server/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   └── doctorProfileController.js  # Doctor profile API logic
├── middleware/
│   ├── auth.js               # Authentication middleware
│   ├── upload.js             # Multer file upload config
│   └── validation.js         # Input validation
├── models/
│   ├── User.js               # User schema
│   ├── DoctorProfile.js      # Doctor profile schema
│   ├── Appointment.js        # Appointment schema
│   └── Availability.js       # Availability schema
├── routes/
│   ├── doctorProfile.js      # Doctor profile routes
│   ├── auth.js               # Authentication routes
│   ├── appointments.js       # Appointment routes
│   └── availability.js       # Availability routes
├── seeds/
│   └── seedDoctor.js         # Database seed script
├── utils/
│   ├── cloudinary.js         # Cloudinary upload utility
│   └── generateToken.js      # JWT token generator
└── server.js                 # Express server entry point

client/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── FloatingContactButtons.jsx  # Floating call/WhatsApp/book buttons
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── ui/
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Modal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── DoctorContext.jsx    # Doctor profile state (shared)
│   ├── layouts/
│   │   ├── PublicLayout.jsx     # Public pages layout
│   │   ├── PatientLayout.jsx    # Patient dashboard layout
│   │   └── DoctorLayout.jsx     # Doctor dashboard layout
│   ├── pages/
│   │   ├── HomePage.jsx         # Public homepage
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── doctor/
│   │   │   ├── DoctorProfile.jsx         # Public doctor profile
│   │   │   ├── DoctorProfileSettings.jsx # Edit profile (owner)
│   │   │   ├── ServicesManagement.jsx    # Manage services
│   │   │   └── TestimonialsManagement.jsx # Manage testimonials
│   │   └── patient/
│   │       ├── BookAppointment.jsx       # Booking page
│   │       ├── PatientProfile.jsx        # Patient profile + doctor info
│   │       └── UpcomingAppointments.jsx
│   ├── services/
│   │   └── doctorProfile.js    # API service functions
│   ├── App.jsx                 # Main app with routes
│   └── main.jsx               # React entry point
```

## API Endpoints

### Public Endpoints
- `GET /api/doctor-profile/profile` - Get doctor profile
- `GET /api/doctor-profile/services` - Get doctor services
- `GET /api/doctor-profile/testimonials` - Get visible testimonials

### Protected Endpoints (Doctor Only)
- `PUT /api/doctor-profile/profile` - Update doctor profile
- `POST /api/doctor-profile/upload` - Upload profile photo
- `POST /api/doctor-profile/services` - Add service
- `PUT /api/doctor-profile/services/:id` - Update service
- `DELETE /api/doctor-profile/services/:id` - Delete service
- `POST /api/doctor-profile/testimonials` - Add testimonial
- `PUT /api/doctor-profile/testimonials/:id` - Update testimonial
- `DELETE /api/doctor-profile/testimonials/:id` - Delete testimonial

## Key Features Explained

### 1. Single Doctor Architecture
- Only ONE doctor exists in the system
- No doctor listing or selection pages
- Profile is fetched once and cached via React Query
- Shared via DoctorContext across all components

### 2. Profile Management
- Doctor can edit all profile fields from dashboard
- Changes reflect immediately across all pages
- Image upload via Cloudinary
- Tabbed interface for organized editing

### 3. Services & Testimonials
- Full CRUD operations for services
- Testimonials have visibility toggle (public/hidden)
- Only visible testimonials show on public pages
- Real-time updates via React Query cache invalidation

### 4. SEO Optimization
- Dynamic meta tags via react-helmet-async
- JSON-LD structured data for Physician and LocalBusiness
- OpenGraph and Twitter Card tags
- Improves Google indexing and local search visibility

### 5. Floating Contact Buttons
- Fixed position buttons for Call, WhatsApp, and Book Appointment
- Available on patient pages and public profile
- Mobile-friendly with hover animations

### 6. Offline Booking Card
- Displayed on booking page and patient dashboard
- Shows contact options and clinic information
- Direct links to call, WhatsApp, and Google Maps

## Customization Guide

### Update Doctor Information
1. Login as doctor at `/doctor/dashboard`
2. Go to Profile Settings
3. Edit any field and save
4. Changes appear immediately on all pages

### Add/Edit Services
1. Go to `/doctor/services`
2. Click "Add Service" or edit existing
3. Fill in name, description, and fee
4. Save changes

### Manage Testimonials
1. Go to `/doctor/testimonials`
2. Add new testimonials or edit existing
3. Toggle visibility with eye icon
4. Only visible testimonials show publicly

### Update SEO Settings
1. Go to `/doctor/profile` → SEO tab
2. Edit title, description, and keywords
3. Save changes
4. Meta tags update automatically

## Deployment

### Backend Deployment (e.g., Railway, Render, Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the client: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

### Environment Variables for Production
- Update `CLIENT_URL` and `ALLOWED_ORIGINS` with production domain
- Use strong `JWT_SECRET`
- Configure Cloudinary with production account
- Use MongoDB Atlas for database

## Troubleshooting

### MongoDB Connection Error (ECONNREFUSED)
If you see `connect ECONNREFUSED ::1:27017` or similar errors:

**Step 1: Test your connection first**
```bash
node testConnection.js
```

This will give you detailed error messages about what's wrong.

**Step 2: Common fixes**

1. **Check if MongoDB is installed:**
   ```bash
   mongod --version
   ```

2. **Start MongoDB service:**
   - **Windows:** Start MongoDB service from Services or run `net start MongoDB`
   - **Mac:** Run `brew services start mongodb-community`
   - **Linux:** Run `sudo systemctl start mongod`

3. **Alternative - Use MongoDB Atlas (Cloud):**
   - Sign up at https://www.mongodb.com/atlas
   - Create a free cluster
   - Get your connection string
   - Update `MONGO_URI` in `.env` with your Atlas connection string
   - **Important:** Whitelist your IP address in Atlas network settings

4. **Verify .env file exists:**
   - Make sure `server/.env` file exists
   - Verify `MONGO_URI` is set correctly
   - Example: `MONGO_URI=mongodb://localhost:27017/doctor-appointment`

5. **Verify MongoDB is running:**
   ```bash
   mongo --eval "db.adminCommand('ping')"
   ```

### Profile not loading
- Check MongoDB connection
- Verify seed script ran successfully
- Check browser console for errors

### Image upload fails
- Verify Cloudinary credentials in `.env`
- Check file size (max 5MB)
- Ensure image format is supported (JPEG, PNG, GIF, WebP)

### Routes not working
- Ensure all pages are imported in `App.jsx`
- Check route paths match navigation links
- Verify DoctorProvider wraps the app

## Support

For issues or questions, please check the console logs and ensure all environment variables are correctly configured.

## License

This project is private and confidential.