const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Import routes
const iepRoutes = require('./routes/iepRoutes');
const tavilyRoutes = require('./routes/tavilyRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const consultationRoutes = require('./routes/consultationRoutes');

// Connect to MongoDB
connectDB();

// Check for API keys
console.log('🔄 Running with API connections');

if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
  console.warn('⚠️  Warning: GROQ_API_KEY is not properly configured.');
} else {
  console.log('✅ GROQ_API_KEY is configured');
}

if (!process.env.TAVILY_API_KEY || process.env.TAVILY_API_KEY === 'your_tavily_api_key_here') {
  console.warn('⚠️  Warning: TAVILY_API_KEY is not properly configured.');
} else {
  console.log('✅ TAVILY_API_KEY is configured');
}

if (!process.env.MEM0_API_KEY || process.env.MEM0_API_KEY === 'your_mem0_api_key_here' ||
    !process.env.MEM0_COLLECTION_ID || process.env.MEM0_COLLECTION_ID === 'your_mem0_collection_id_here') {
  console.warn('⚠️  Warning: MEM0_API_KEY or MEM0_COLLECTION_ID is not properly configured.');
} else {
  console.log('✅ MEM0_API_KEY and MEM0_COLLECTION_ID are configured');
}

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  Warning: MONGODB_URI is not set. Using local MongoDB.');
} else {
  console.log('✅ MONGODB_URI is configured');
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Increase request timeout
app.use((req, res, next) => {
  res.setTimeout(120000); // 2 minute timeout
  next();
});

// API Routes
app.use('/api/iep', iepRoutes);
app.use('/api/tavily', tavilyRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/consultations', consultationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    apiKeys: {
      groq: !!process.env.GROQ_API_KEY,
      tavily: !!process.env.TAVILY_API_KEY,
      mem0: !!process.env.MEM0_API_KEY && !!process.env.MEM0_COLLECTION_ID
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
