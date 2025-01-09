const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI Escape Codes for colors
const RED_BOLD = '\x1b[1;31m';
const YELLOW = '\x1b[0;33m';
const GREEN = '\x1b[0;32m';
const RESET = '\x1b[0m';

function checkNodeModules() {
  // Guard: Prevent infinite loop by checking for a flag file
  const flagPath = path.resolve('.checkNodeModules.lock');

  if (fs.existsSync(flagPath)) {
    console.log(
      `${YELLOW}Skipping checkNodeModules to prevent recursion.${RESET}`
    );
    return;
  }

  const nodeModulesPath = path.resolve('node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`${RED_BOLD}node_modules not found!${RESET}`);
    console.log(`${YELLOW}Installing dependencies...${RESET}`);

    try {
      // Create a temporary lock file to prevent recursive execution
      fs.writeFileSync(flagPath, 'LOCK');

      // Run yarn install
      execSync('yarn install', { stdio: 'inherit' });

      console.log(`${GREEN}Dependencies installed successfully!${RESET}`);
    } catch (error) {
      console.error(`${RED_BOLD}Error installing dependencies.${RESET}`);
      console.error(error.message);
      process.exit(1); // Exit on error
    } finally {
      // Remove the lock file
      fs.unlinkSync(flagPath);
    }
  }
}

module.exports = {
  checkNodeModules,
};

// Execute directly if script is called
if (require.main === module) {
  checkNodeModules();
}
