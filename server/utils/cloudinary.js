const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const streamifier = require('streamifier');

dotenv.config({ path: `${__dirname}/../.env` });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('WARNING: Cloudinary credentials not configured. Photo upload will fail.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

console.log('Cloudinary config:', {
  cloudName: cloudName ? `${cloudName.substring(0, 3)}...` : 'NOT SET',
  apiKey: apiKey ? `${apiKey.substring(0, 4)}...` : 'NOT SET',
  apiSecret: apiSecret ? 'SET' : 'NOT SET',
});

const uploadImage = (fileBuffer, folder = 'doctor-appointment') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', JSON.stringify(error));
          reject(new Error(error.message));
        } else {
          console.log('Upload success:', result.secure_url);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

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
};