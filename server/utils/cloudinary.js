const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../.env` });

// Validate Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('WARNING: Cloudinary credentials not configured. Photo upload will fail.');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Log configuration status (without exposing secrets)
console.log('Cloudinary config:', {
  cloudName: cloudName || 'NOT SET',
  apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET',
  apiSecret: apiSecret ? 'SET' : 'NOT SET',
});

// Upload image to Cloudinary from buffer
const uploadImage = async (fileBuffer, folder = 'doctor-appointment') => {
  try {
    // Convert buffer to base64 data URI
    const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary delete failed: ${error.message}`);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  cloudinary,
};