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
    // Use upload_stream for better compatibility
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });
    
    console.log('Cloudinary upload successful:', result.secure_url);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error FULL:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
      details: error.details || 'No details',
      response: error.response?.data || 'No response data',
      stack: error.stack,
      // Log the entire error object to see all properties
      fullError: JSON.stringify(error, null, 2),
    });
    
    // Provide more helpful error messages
    if (error.http_code === 403) {
      throw new Error('Cloudinary upload forbidden: Check your account settings, upload restrictions, or folder permissions in Cloudinary dashboard');
    }
    
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