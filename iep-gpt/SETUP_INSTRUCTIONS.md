# IEP-GPT Setup Instructions

This guide will help you set up and run the IEP-GPT application.

## Quick Setup

For a quick setup, you can run the setup script:

```bash
node setup.js
```

This will install all dependencies for the root project, server, and client.

## Manual Setup

If you prefer to set up manually or if the setup script doesn't work, follow these steps:

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

The server requires the following packages:
- express
- cors
- morgan
- dotenv
- axios
- nodemon (dev dependency)

### 3. Install Client Dependencies

```bash
cd client
npm install
```

The client requires the following packages:
- react
- react-dom
- react-router-dom
- react-icons
- axios

## Environment Variables

### Server (.env file in server directory)

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
MEM0_API_KEY=your_mem0_api_key_here
MEM0_COLLECTION_ID=your_mem0_collection_id_here
```

### Client (.env file in client directory)

Create a `.env` file in the client directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode (Both Frontend and Backend)

```bash
npm run dev
```

### Backend Only

```bash
npm run server
```

### Frontend Only

```bash
npm run client
```

## Troubleshooting

### Module Not Found Errors

If you see errors like `Cannot find module 'cors'` or other missing modules, make sure you've installed all the required dependencies in the server directory:

```bash
cd server
npm install cors morgan dotenv axios express
npm install nodemon --save-dev
```

### Port Already in Use

If you see an error that the port is already in use, you can change the port in the server's `.env` file.

### API Connection Issues

Make sure your API keys are correctly set in the `.env` file and that you have internet access to connect to the external APIs (Groq, Tavily, Mem0).

## Getting API Keys

- **Groq API**: Sign up at [groq.com](https://console.groq.com/keys)
- **Tavily API**: Sign up at [tavily.com](https://tavily.com/#api)
- **Mem0 API**: Sign up at [mem0.ai](https://mem0.ai)
