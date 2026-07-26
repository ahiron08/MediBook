const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Test Cloudinary connection
router.get('/cloudinary', (req, res) => {
  try {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    };

    res.json({
      success: true,
      message: 'Cloudinary configuration check',
      config: {
        ...config,
        api_key: config.api_key ? `${config.api_key.substring(0, 8)}...` : 'NOT SET',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;