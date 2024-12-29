const fs = require('fs');
const { execSync } = require('child_process');

// ANSI Escape Codes for colors (using \x1b instead of \033)
const RED_BOLD = '\x1b[1;31m';
const YELLOW = '\x1b[0;33m';
const GREEN = '\x1b[0;32m';
const RESET = '\x1b[0m';

if (!fs.existsSync('node_modules')) {
  // Print "node_modules not found!" in bold red
  console.log(`${RED_BOLD}node_modules not found!${RESET}`);

  // Print "Installing dependencies..." in yellow
  console.log(`${YELLOW}Installing dependencies...${RESET}`);

  try {
    // Run yarn install to install missing dependencies
    execSync('yarn install', { stdio: 'inherit' });

    // Print success message in green
    console.log(`${GREEN}Dependencies installed successfully!${RESET}`);
  } catch {
    // Print error message in red if the install fails
    console.error(`${RED_BOLD}Error installing dependencies.${RESET}`);
    process.exit(1);
  }
}
