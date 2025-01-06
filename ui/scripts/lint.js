const { execSync } = require('child_process');
//const path = require('path');

function runLint(isProcessStop = true) {
  try {
    console.log('\x1b[33mRunning ESLint...\x1b[0m');
    execSync('npx eslint --fix .', { stdio: 'inherit' });
    console.log('\x1b[32mLinting completed successfully!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mError during linting.\x1b[0m');
    console.error(err.message);

    // Stop process if specified
    if (isProcessStop) {
      process.exit(1);
    }
  }
}

// Export the function to make it reusable
module.exports = {
  runLint,
};

// Execute the linting when the script is directly called
if (require.main === module) {
  runLint();
}
