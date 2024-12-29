const { execSync } = require('child_process');

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
runCommand('node scripts/checkNodeModules.js');
runCommand('node scripts/format.js');
runCommand('node scripts/lint.js');

// Start Webpack in development mode
runCommand('webpack serve --mode development --open');
