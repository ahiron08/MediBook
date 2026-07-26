# Doctor Profile System - Setup Guide

## Overview
This is a complete Doctor Profile System for the MediBook doctor appointment booking website. It includes a public-facing profile page for patients and an admin dashboard for managing the doctor's profile.

## Features Implemented

### 1. Public Doctor Profile (`/doctor`)
- Hero section with doctor photo, name, specialization, experience
- About section with biography
- Qualifications display
- Services offered with fees and duration
- Consultation fees
- Clinic timings
- Photo gallery
- Patient testimonials/reviews
- FAQ section
- Contact buttons (Call, WhatsApp, Directions)
- Book Appointment button
- Mobile-responsive design
- SEO optimized

### 2. Admin Dashboard (`/doctor/profile-manage`)
- General information management
- About section editor
- Qualifications management
- Experience management
- Services management (add/edit/delete/reorder)
- Consultation fees configuration
- Clinic information
- Clinic timings configuration
- Gallery image upload/delete
- Testimonials management
- FAQ management
- SEO settings
- Profile photo upload

### 3. Backend API
- `GET /api/doctor/profile` - Public profile
- `GET /api/doctor/admin/profile` - Admin get profile
- `POST /api/doctor/admin/profile` - Create profile
- `PUT /api/doctor/admin/profile` - Update profile
- `POST /api/doctor/admin/profile/photo` - Upload profile photo
- `DELETE /api/doctor/admin/profile/photo` - Delete profile photo
- `POST /api/doctor/admin/gallery/upload` - Upload gallery image
- `DELETE /api/doctor/admin/gallery/:publicId` - Delete gallery image
- `POST /api/doctor/admin/testimonials` - Add testimonial
- `PUT /api/doctor/admin/testimonials/:id` - Update testimonial
- `DELETE /api/doctor/admin/testimonials/:id` - Delete testimonial
- `POST /api/doctor/admin/faqs` - Add FAQ
- `PUT /api/doctor/admin/faqs/:id` - Update FAQ
- `DELETE /api/doctor/admin/faqs/:id` - Delete FAQ
- `POST /api/doctor/admin/update-statistics` - Update statistics
- `GET /api/doctor/admin/statistics` - Get statistics

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary account

### Step 1: Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# CORS Configuration
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://medi-book-pied.vercel.app

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Other settings...
```

### Step 2: Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Seed the Database

Run the seed script to create the doctor profile with sample data:

```bash
cd server
node seeds/doctorProfileSeed.js
```

This will:
- Create an admin user (email: `admin@medibook.com`, password: `admin123`)
- Create a complete doctor profile for Dr. Gunamani Mahanta
- Add sample services, testimonials, FAQs, etc.

### Step 4: Start the Application

```bash
# Terminal 1 - Start backend server
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

### Step 5: Access the Application

1. **Public Profile**: Visit `http://localhost:5173/doctor`
2. **Admin Dashboard**: 
   - Login with `admin@medibook.com` / `admin123`
   - Navigate to `/doctor/profile-manage`
3. **Doctor Dashboard**: Login as doctor and go to `/doctor/profile-manage`

## Cloudinary Setup

1. Create a Cloudinary account at https://cloudinary.com
2. Get your credentials from the Cloudinary dashboard
3. Add them to your `.env` file
4. For uploads to work, ensure your Cloudinary account has upload permissions

**Note**: If you get a 403 error during upload:
- Check your Cloudinary account settings
- Verify upload restrictions in Cloudinary dashboard
- Ensure your account plan allows uploads
- Check folder permissions

## Project Structure

```
server/
├── models/
│   └── Doctor.js              # Doctor schema
├── controllers/
│   └── doctorController.js    # Doctor profile API endpoints
├── routes/
│   └── doctor.js              # Doctor routes
├── seeds/
│   └── doctorProfileSeed.js   # Sample data seed
└── utils/
    └── cloudinary.js          # Cloudinary upload utilities

client/
├── src/
│   ├── pages/
│   │   ├── DoctorPublicProfile.jsx      # Public profile page
│   │   └── admin/
│   │       └── DoctorProfileAdmin.jsx   # Admin dashboard
│   ├── components/
│   │   └── common/
│   │       └── SEO.jsx                  # SEO component
│   ├── layouts/
│   │   └── DoctorLayout.jsx             # Doctor sidebar layout
│   └── App.jsx                          # Main app with routes
```

## Customization

### Updating Doctor Information
1. Login as admin
2. Go to `/doctor/profile-manage`
3. Edit any section using the sidebar navigation
4. Click "Save Changes"

### Adding Profile Photo
1. Go to `/doctor/profile-manage`
2. Click "Manage Profile" in sidebar
3. Click "Upload Photo" button
4. Select an image (max 5MB)
5. Save changes

### Managing Services
1. Go to `/doctor/profile-manage`
2. Click "Services" in sidebar
3. Add/edit/delete services
4. Set fees, duration, and description
5. Save changes

### Managing Testimonials
1. Go to `/doctor/profile-manage`
2. Click "Testimonials" in sidebar
3. Add new testimonials with patient name, rating, and review
4. Save changes

### Managing FAQs
1. Go to `/doctor/profile-manage`
2. Click "FAQ" in sidebar
3. Add/edit/delete FAQs
4. Save changes

## SEO Configuration

The public profile page includes:
- Dynamic page title
- Meta description
- Keywords
- Open Graph tags
- Twitter Cards
- Canonical URL

To customize SEO:
1. Go to `/doctor/profile-manage`
2. Click "SEO" in sidebar
3. Update meta title, description, and keywords
4. Save changes

## Security

- Only authenticated admin users can edit the profile
- Patients can only view the public profile
- All inputs are sanitized
- File uploads are validated
- XSS protection enabled
- MongoDB injection protection enabled

## Troubleshooting

### Cloudinary Upload 403 Error
If you get a 403 error when uploading images:
1. Verify your Cloudinary credentials in `.env`
2. Check Cloudinary dashboard for upload restrictions
3. Ensure your account plan allows uploads
4. Check if folder permissions are set correctly

### Profile Not Loading
1. Ensure the seed script has been run
2. Check MongoDB connection
3. Verify the doctor profile exists in database

### Images Not Displaying
1. Check Cloudinary URLs are correct
2. Verify images were uploaded successfully
3. Check browser console for errors

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB database
3. Configure proper CORS origins
4. Use environment variables for all secrets
5. Enable HTTPS
6. Set up proper backup strategies

## Future Enhancements

- Video consultation integration
- Prescription upload
- Medical reports
- Payment gateway
- Insurance integration
- Multiple clinic locations
- Digital prescriptions
- Appointment reminders
- Patient reviews collection
- Analytics dashboard

## Support

For issues or questions, please check the console logs for detailed error messages.