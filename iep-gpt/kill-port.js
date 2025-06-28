const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

// Port to check
const PORT = process.argv[2] || 5000;

console.log(`${colors.bright}${colors.cyan}=== Port Usage Checker ===${colors.reset}\n`);
console.log(`Checking for processes using port ${PORT}...\n`);

try {
  // Different commands for Windows vs Unix-like systems
  let command;
  let processIdCommand;
  
  if (process.platform === 'win32') {
    command = `netstat -ano | findstr :${PORT}`;
    processIdCommand = (pid) => `taskkill /F /PID ${pid}`;
  } else {
    command = `lsof -i :${PORT}`;
    processIdCommand = (pid) => `kill -9 ${pid}`;
  }
  
  // Execute the command to find processes
  const output = execSync(command, { encoding: 'utf-8' });
  
  if (!output.trim()) {
    console.log(`${colors.green}No processes found using port ${PORT}.${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`${colors.yellow}Processes using port ${PORT}:${colors.reset}\n`);
  console.log(output);
  
  // Extract PIDs from the output
  let pids = [];
  
  if (process.platform === 'win32') {
    // Windows format: extract the last column which is the PID
    pids = output
      .split('\n')
      .filter(line => line.includes(`LISTENING`) || line.includes(`ESTABLISHED`))
      .map(line => line.trim().split(/\s+/).pop())
      .filter(Boolean);
  } else {
    // Unix format: extract the PID column (usually the 2nd column)
    pids = output
      .split('\n')
      .slice(1) // Skip header line
      .filter(Boolean)
      .map(line => line.trim().split(/\s+/)[1])
      .filter(Boolean);
  }
  
  // Remove duplicates
  pids = [...new Set(pids)];
  
  if (pids.length === 0) {
    console.log(`${colors.yellow}Could not identify specific processes to kill.${colors.reset}`);
    process.exit(0);
  }
  
  console.log(`\n${colors.bright}Found ${pids.length} process(es) using port ${PORT}:${colors.reset}`);
  pids.forEach(pid => console.log(`- Process ID: ${pid}`));
  
  rl.question(`\n${colors.yellow}Do you want to kill these processes? (y/n) ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      pids.forEach(pid => {
        try {
          console.log(`${colors.yellow}Killing process ${pid}...${colors.reset}`);
          execSync(processIdCommand(pid));
          console.log(`${colors.green}Process ${pid} killed successfully.${colors.reset}`);
        } catch (error) {
          console.error(`${colors.red}Failed to kill process ${pid}: ${error.message}${colors.reset}`);
        }
      });
      
      // Verify if port is now free
      try {
        execSync(command, { encoding: 'utf-8' });
        console.log(`\n${colors.red}Warning: Port ${PORT} might still be in use.${colors.reset}`);
      } catch (error) {
        console.log(`\n${colors.green}Port ${PORT} is now free.${colors.reset}`);
      }
    } else {
      console.log(`\n${colors.yellow}Operation cancelled.${colors.reset}`);
    }
    
    rl.close();
  });
} catch (error) {
  if (error.status === 1) {
    console.log(`${colors.green}No processes found using port ${PORT}.${colors.reset}`);
  } else {
    console.error(`${colors.red}Error checking port: ${error.message}${colors.reset}`);
  }
  rl.close();
}
