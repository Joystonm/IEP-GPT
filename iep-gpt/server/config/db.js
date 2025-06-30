const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if we're using mock data mode
    if (process.env.USE_MOCK_DATA === 'true') {
      console.log('📊 MongoDB connection skipped in mock data mode');
      return;
    }

    // Get MongoDB URI from environment variables or use default local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iep-gpt';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Don't exit process if in mock data mode
    if (process.env.USE_MOCK_DATA !== 'true') {
      console.warn('⚠️ Falling back to mock data mode due to MongoDB connection failure');
      process.env.USE_MOCK_DATA = 'true';
    }
  }
};

module.exports = connectDB;
