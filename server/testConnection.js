const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: `${__dirname}/.env` });

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('❌ ERROR: MONGO_URI not found in .env file');
      console.error('Please create a .env file in the server directory');
      process.exit(1);
    }

    console.log('🔍 Testing MongoDB Connection...');
    console.log('MongoDB URI:', mongoUri.replace(/\/\/.*@/, '//***@'));

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connection successful!');
    console.log('Database:', mongoose.connection.name);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', ') || 'None yet');
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test passed! You can now run: node seeds/seedDoctor.js');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('1. Check if MongoDB is running locally or Atlas cluster is accessible');
    console.error('2. Verify MONGO_URI in server/.env is correct');
    console.error('3. For Atlas: Check IP whitelist and user credentials');
    process.exit(1);
  }
};

testConnection();