const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    console.error(`Error running command: ${command}`);
    process.exit(1);
  }
};

// Check node_modules
runCommand('node scripts/checkNodeModules.js');

// Run format
runCommand('node scripts/format.js');

// Run lint
runCommand('node scripts/lint.js');
