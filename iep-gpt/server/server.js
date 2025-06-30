const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Function to find an available port
const findAvailablePort = (startPort) => {
  // Ensure port is a number
  const port = parseInt(startPort, 10);
  
  // Validate port number
  if (isNaN(port) || port < 0 || port >= 65536) {
    console.warn(`⚠️ Invalid port specified: ${startPort}. Using default port 5000 instead.`);
    return findAvailablePort(5000);
  }
  
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.on('error', () => {
      // If the port is in use, try the next port
      resolve(findAvailablePort(port + 1));
    });
    
    server.on('listening', () => {
      // If the port is available, close the server and return the port
      server.close(() => {
        resolve(port);
      });
    });
    
    server.listen(port);
  });
};

// Start server with dynamic port selection
const startServer = async () => {
  try {
    // Try to use the specified port, or find an available one
    const PORT = await findAvailablePort(process.env.PORT || 5000);
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
      
      // Update the client's API URL if needed
      if (PORT !== 5000) {
        console.log('\n⚠️  Note: Server is running on a different port than expected.');
        console.log(`Please update your client's .env file with: REACT_APP_API_URL=http://localhost:${PORT}/api\n`);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
