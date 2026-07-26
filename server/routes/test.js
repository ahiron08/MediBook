const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Test Cloudinary connection
router.get('/cloudinary', async (req, res) => {
  try {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    };

    // Try to ping Cloudinary to verify credentials
    const result = await cloudinary.api.ping();
    
    res.json({
      success: true,
      message: 'Cloudinary connection successful',
      config: {
        ...config,
        api_key: config.api_key ? `${config.api_key.substring(0, 8)}...` : 'NOT SET',
      },
      cloudinaryResponse: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: {
        message: error.message,
        http_code: error.http_code,
        name: error.name,
      },
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 8)}...` : 'NOT SET',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      },
    });
  }
});

module.exports = router;