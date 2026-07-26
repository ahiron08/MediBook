const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../.env` });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary from buffer
const uploadImage = async (fileBuffer, folder = 'doctor-appointment') => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${fileBuffer.toString('base64')}`,
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      }
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
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