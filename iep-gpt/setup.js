const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}=== IEP-GPT Setup Script ===${colors.reset}\n`);

// Function to execute commands and handle errors
function runCommand(command, errorMessage) {
  try {
    console.log(`${colors.yellow}> ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}ERROR: ${errorMessage}${colors.reset}`);
    return false;
  }
}

// Install root dependencies
console.log(`\n${colors.bright}Installing root dependencies...${colors.reset}`);
if (!runCommand('npm install', 'Failed to install root dependencies')) {
  process.exit(1);
}

// Install server dependencies
console.log(`\n${colors.bright}Installing server dependencies...${colors.reset}`);
if (!runCommand('cd server && npm install', 'Failed to install server dependencies')) {
  process.exit(1);
}

// Install client dependencies
console.log(`\n${colors.bright}Installing client dependencies...${colors.reset}`);
if (!runCommand('cd client && npm install', 'Failed to install client dependencies')) {
  process.exit(1);
}

console.log(`\n${colors.green}${colors.bright}Setup completed successfully!${colors.reset}`);
console.log(`\n${colors.cyan}To start the development server:${colors.reset}`);
console.log(`${colors.yellow}npm run dev${colors.reset}`);

console.log(`\n${colors.cyan}To start only the backend:${colors.reset}`);
console.log(`${colors.yellow}npm run server${colors.reset}`);

console.log(`\n${colors.cyan}To start only the frontend:${colors.reset}`);
console.log(`${colors.yellow}npm run client${colors.reset}`);

console.log(`\n${colors.bright}Don't forget to set up your environment variables in:${colors.reset}`);
console.log(`${colors.yellow}- server/.env${colors.reset}`);
console.log(`${colors.yellow}- client/.env${colors.reset}`);
