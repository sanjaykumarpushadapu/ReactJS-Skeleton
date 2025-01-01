const { execSync } = require('child_process');
const { preBuild } = require('./preBuild');
// Function to run commands
const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    console.error(`Error running command: ${command}`);
    process.exit(1);
  }
};

// Run common tasks: check node_modules, format, lint
preBuild();

// Build Webpack in production mode
runCommand('webpack --mode production');
